import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@opensearch-project/opensearch';
import { readFileSync } from 'fs';
import { join } from 'path';

export interface SearchQuery {
  q?: string;
  category?: string;
  city?: string;
  state?: string;
  locale?: 'en' | 'zh';
  limit?: number;
  offset?: number;
}

export interface SearchResult {
  businesses: any[];
  total: number;
  took: number;
  suggestions?: string[];
}

@Injectable()
export class SearchService implements OnModuleInit {
  private readonly logger = new Logger(SearchService.name);
  private client: Client;
  private readonly indexName = 'businesses';

  constructor(private configService: ConfigService) {
    this.client = new Client({
      node: this.configService.get('OPENSEARCH_URL', 'http://localhost:9200'),
      ssl: {
        rejectUnauthorized: false,
      },
    });
  }

  async onModuleInit() {
    await this.initializeIndex();
  }

  private async initializeIndex(): Promise<void> {
    try {
      // Check if index exists
      const indexExists = await this.client.indices.exists({
        index: this.indexName,
      });

      if (!indexExists.body) {
        this.logger.log(`Creating index: ${this.indexName}`);
        
        // Load index template
        const templatePath = join(process.cwd(), '../../docker/opensearch/index-template.json');
        const template = JSON.parse(readFileSync(templatePath, 'utf-8'));
        
        // Create index with mapping
        await this.client.indices.create({
          index: this.indexName,
          body: {
            settings: template.template.settings,
            mappings: template.template.mappings,
          },
        });

        this.logger.log(`Index ${this.indexName} created successfully`);
      } else {
        this.logger.log(`Index ${this.indexName} already exists`);
      }
    } catch (error) {
      this.logger.error(`Failed to initialize search index: ${error.message}`);
      // Don't throw error to allow app to start without search
    }
  }

  async indexBusiness(business: any): Promise<boolean> {
    try {
      const doc = this.transformBusinessForIndex(business);
      
      const response = await this.client.index({
        index: this.indexName,
        id: business.id,
        body: doc,
        refresh: 'wait_for',
      });

      this.logger.log(`Indexed business: ${business.id}`);
      return response.body.result === 'created' || response.body.result === 'updated';
    } catch (error) {
      this.logger.error(`Failed to index business ${business.id}: ${error.message}`);
      return false;
    }
  }

  async updateBusiness(businessId: string, business: any): Promise<boolean> {
    try {
      const doc = this.transformBusinessForIndex(business);
      
      const response = await this.client.update({
        index: this.indexName,
        id: businessId,
        body: {
          doc,
        },
        refresh: 'wait_for',
      });

      this.logger.log(`Updated business in search: ${businessId}`);
      return response.body.result === 'updated';
    } catch (error) {
      this.logger.error(`Failed to update business ${businessId}: ${error.message}`);
      return false;
    }
  }

  async deleteBusiness(businessId: string): Promise<boolean> {
    try {
      await this.client.delete({
        index: this.indexName,
        id: businessId,
        refresh: 'wait_for',
      });

      this.logger.log(`Deleted business from search: ${businessId}`);
      return true;
    } catch (error) {
      if (error.body?.result === 'not_found') {
        this.logger.warn(`Business not found in search index: ${businessId}`);
        return true; // Consider it successful if already doesn't exist
      }
      this.logger.error(`Failed to delete business ${businessId}: ${error.message}`);
      return false;
    }
  }

  async search(query: SearchQuery): Promise<SearchResult> {
    try {
      const searchBody = this.buildSearchQuery(query);
      
      const response = await this.client.search({
        index: this.indexName,
        body: searchBody,
      });

      const hits = response.body.hits;
      const businesses = hits.hits.map((hit: any) => ({
        ...hit._source,
        _score: hit._score,
      }));

      return {
        businesses,
        total: typeof hits.total === 'number' ? hits.total : hits.total.value,
        took: response.body.took,
      };
    } catch (error) {
      this.logger.error(`Search failed: ${error.message}`);
      return {
        businesses: [],
        total: 0,
        took: 0,
      };
    }
  }

  async getSuggestions(query: string, locale: 'en' | 'zh' = 'en'): Promise<string[]> {
    try {
      const nameField = locale === 'zh' ? 'name_zh.autocomplete' : 'name_en.autocomplete';
      
      const response = await this.client.search({
        index: this.indexName,
        body: {
          suggest: {
            business_suggest: {
              text: query,
              completion: {
                field: nameField,
                size: 10,
              },
            },
          },
        },
      });

      const options = response.body.suggest?.business_suggest?.[0]?.options;
      const suggestions = Array.isArray(options) 
        ? options.map((option: any) => option.text)
        : [];

      return suggestions;
    } catch (error) {
      this.logger.error(`Suggestions failed: ${error.message}`);
      return [];
    }
  }

  private transformBusinessForIndex(business: any): any {
    const englishLocalized = business.localized?.find((l: any) => l.lang === 'en');
    const chineseLocalized = business.localized?.find((l: any) => l.lang === 'zh');

    return {
      id: business.id,
      slug: business.slug,
      status: business.status,
      name_en: englishLocalized?.name || '',
      name_zh: chineseLocalized?.name || '',
      description_en: englishLocalized?.description || '',
      description_zh: chineseLocalized?.description || '',
      categories: business.categories?.map((bc: any) => ({
        id: bc.category.id,
        key: bc.category.key,
        name_en: bc.category.nameEn,
        name_zh: bc.category.nameZh,
      })) || [],
      location: {
        city: business.location?.city,
        state: business.location?.state,
        zip: business.location?.zip,
        address_lines: business.location?.addressLines?.join(' ') || '',
        // TODO: Add geo-coordinates when available
      },
      contact: {
        phone: business.contact?.phone,
        email: business.contact?.email,
        website: business.contact?.website,
      },
      attributes: {},
      rating: 0, // TODO: Calculate from reviews
      review_count: business.reviews?.length || 0,
      created_at: business.createdAt,
      updated_at: business.updatedAt,
    };
  }

  private buildSearchQuery(query: SearchQuery): any {
    const must: any[] = [];
    const filter: any[] = [];
    const should: any[] = [];

    // Status filter - only show approved businesses
    filter.push({
      term: { status: 'APPROVED' }
    });

    // Text search
    if (query.q) {
      const searchFields = query.locale === 'zh' 
        ? ['name_zh^3', 'description_zh^2', 'categories.name_zh']
        : ['name_en^3', 'description_en^2', 'categories.name_en'];

      must.push({
        multi_match: {
          query: query.q,
          fields: searchFields,
          type: 'best_fields',
          fuzziness: 'AUTO',
          operator: 'and',
        }
      });

      // Add autocomplete matching for better user experience
      should.push({
        multi_match: {
          query: query.q,
          fields: query.locale === 'zh' ? ['name_zh.autocomplete'] : ['name_en.autocomplete'],
          type: 'phrase_prefix',
          boost: 2,
        }
      });
    }

    // Category filter
    if (query.category) {
      filter.push({
        nested: {
          path: 'categories',
          query: {
            term: {
              'categories.key': query.category
            }
          }
        }
      });
    }

    // Location filters
    if (query.city) {
      filter.push({
        term: { 'location.city': query.city }
      });
    }

    if (query.state) {
      filter.push({
        term: { 'location.state': query.state }
      });
    }

    // Build query
    const searchQuery: any = {
      query: {
        bool: {
          filter,
        }
      },
      sort: [
        { _score: { order: 'desc' } },
        { created_at: { order: 'desc' } }
      ],
      from: query.offset || 0,
      size: Math.min(query.limit || 20, 100), // Cap at 100
      highlight: {
        fields: {
          'name_en': {},
          'name_zh': {},
          'description_en': {},
          'description_zh': {}
        }
      }
    };

    if (must.length > 0) {
      searchQuery.query.bool.must = must;
    }

    if (should.length > 0) {
      searchQuery.query.bool.should = should;
      searchQuery.query.bool.minimum_should_match = 1;
    }

    return searchQuery;
  }
}
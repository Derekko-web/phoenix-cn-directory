import { Controller, Get, Query } from '@nestjs/common';
import { SearchService, SearchQuery } from '../../common/search/search.service';

@Controller('v1/search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async searchBusinesses(@Query() query: SearchQuery) {
    return this.searchService.search(query);
  }

  @Get('suggestions')
  async getSuggestions(
    @Query('q') q: string,
    @Query('locale') locale: 'en' | 'zh' = 'en'
  ) {
    if (!q || q.trim().length < 2) {
      return { suggestions: [] };
    }

    const suggestions = await this.searchService.getSuggestions(q.trim(), locale);
    return { suggestions };
  }
}
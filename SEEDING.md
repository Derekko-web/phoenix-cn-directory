# Database Seeding

This document explains how to seed the Phoenix Chinese Directory database with sample data.

## Quick Start

To seed the database with sample businesses, run:

```bash
pnpm seed:businesses
```

Or from the API directory:

```bash
cd packages/api
pnpm run seed:businesses
```

## Sample Businesses

The seeding script creates 10 diverse sample businesses representing different categories in the Phoenix Chinese community:

### Community & Cultural
- **Phoenix Chinese Cultural Center** (凤凰城华人文化中心) - Community center with cultural events and classes
- **Phoenix Chinese School** (凤凰城中文学校) - Weekend Chinese language school

### Restaurants & Food
- **Golden Dragon Restaurant** (金龙酒楼) - Authentic Szechuan and Cantonese cuisine
- **Ming's Tea House** (明记茶楼) - Traditional tea house

### Retail & Shopping
- **Phoenix Chinese Market** (凤凰城华人超市) - Asian grocery store
- **New Century Bookstore** (新世纪书店) - Bilingual bookstore

### Healthcare & Wellness
- **Dr. Li Traditional Chinese Medicine** (李医生中医诊所) - TCM clinic
- **Jade Beauty Salon** (翡翠美容院) - Beauty salon

### Professional Services
- **Phoenix Immigration Law Office** (凤凰城移民律师事务所) - Immigration law firm
- **Happy Family Childcare** (快乐家庭托儿所) - Bilingual daycare center

## Features Included

Each sample business includes:

- ✅ **Bilingual content** - English and Chinese names/descriptions
- ✅ **Complete contact information** - Phone, email, website (where applicable)
- ✅ **Full address details** - Street address, city, state, ZIP
- ✅ **Business hours** - Realistic operating hours for each day of the week
- ✅ **Category assignment** - Properly categorized businesses
- ✅ **Approved status** - Ready to display on the website immediately

## Geographic Coverage

Businesses are distributed across the Phoenix metro area:

- **Phoenix** (Central, North, West regions)
- **Scottsdale** (East Valley)
- **Tempe** (East Valley) 
- **Glendale** (West Valley)

## Prerequisites

Before running the seeding script, ensure:

1. **Database is running**: `pnpm docker:up`
2. **Categories exist**: Run the main seed script first: `pnpm --filter api run db:seed`
3. **Database schema is up to date**: `pnpm --filter api run db:push`

## Idempotent Operation

The seeding script is safe to run multiple times:
- ✅ **Skips existing businesses** - Won't create duplicates
- ✅ **Detailed logging** - Shows what was created vs skipped
- ✅ **Error handling** - Continues on individual business failures

## Search Integration

Once businesses are seeded, they will automatically:
- 🔍 **Appear in search results** - Indexed in OpenSearch when approved
- 🌐 **Display on website** - Available at `/businesses` pages
- 📱 **Support bilingual browsing** - Searchable in both English and Chinese

## Verification

After seeding, verify the businesses were created:

1. **Web interface**: Visit http://localhost:3000/en/businesses
2. **API endpoint**: `curl http://localhost:4000/v1/businesses`
3. **Search API**: `curl "http://localhost:4000/v1/search?q=restaurant"`

## Customization

To modify the sample data:

1. Edit the `sampleBusinesses` array in `packages/api/src/scripts/seed-sample-businesses.ts`
2. Follow the existing data structure
3. Ensure category keys match existing categories in the database
4. Run the updated script: `pnpm seed:businesses`

## Troubleshooting

**Category not found errors**: Ensure the main categories have been seeded first
```bash
pnpm --filter api run db:seed
```

**Database connection errors**: Ensure Docker containers are running
```bash
pnpm docker:up
```

**Permission errors**: Ensure you're running from the project root or API directory
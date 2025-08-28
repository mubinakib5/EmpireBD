# Sanity CMS Setup Guide for EmpireBD

This guide will help you set up Sanity CMS for the EmpireBD e-commerce website.

## Prerequisites

- Node.js 18+ installed
- A Sanity account (sign up at [sanity.io](https://sanity.io))

## Setup Steps

### 1. Create a Sanity Project

1. Go to [sanity.io/manage](https://sanity.io/manage)
2. Click "Create new project"
3. Choose a project name (e.g., "EmpireBD")
4. Select a dataset name (use "production")
5. Note down your Project ID

### 2. Configure Environment Variables

Update the `.env.local` file with your Sanity credentials:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_actual_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_api_token_here
SANITY_REVALIDATE_SECRET=your_random_secret_here
```

### 3. Get API Token

1. Go to your project settings in Sanity Manage
2. Navigate to "API" tab
3. Click "Add API token"
4. Give it a name (e.g., "NextJS App")
5. Set permissions to "Editor" or "Admin"
6. Copy the token and add it to your `.env.local`

### 4. Generate Revalidate Secret

Generate a random secret for webhook security:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Add this to your `.env.local` as `SANITY_REVALIDATE_SECRET`.

### 5. Access Sanity Studio

1. Start your Next.js development server:

   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/studio`

3. Sign in with your Sanity account

### 6. Create Content

#### Hero Segments

1. In Sanity Studio, go to "Hero Segment"
2. Create segments for each product category:
   - **Women** (slug: `women`)
   - **Men** (slug: `men`)
   - **Summer Bags** (slug: `summer-bags`)
   - **Sandals** (slug: `sandals`)

#### Products

1. Go to "Product" in Sanity Studio
2. Create products with:
   - Title and slug
   - Images (at least one)
   - Brand name
   - Price
   - Summary description
   - Tags
   - Link to appropriate Hero Segment
   - SEO information

### 7. Set Up Webhooks (Optional)

For automatic revalidation when content changes:

1. In Sanity Manage, go to your project
2. Navigate to "API" → "Webhooks"
3. Click "Create webhook"
4. Set URL to: `https://your-domain.com/api/revalidate`
5. Add your `SANITY_REVALIDATE_SECRET` as Authorization header: `Bearer your_secret`
6. Select triggers: Create, Update, Delete
7. Filter by document types: `product`, `heroSegment`

## Usage

### Explore Pages

Once set up, users can:

1. Click "Explore" buttons on hero sections
2. Browse products by category at `/explore/[segment]`
3. Filter by brand, price range
4. Search products
5. Sort by newest, price (low to high, high to low)

### Content Management

Website owners can:

1. Add new products via Sanity Studio
2. Edit existing product information
3. Manage product categories (hero segments)
4. Upload and manage product images
5. Set SEO metadata for better search visibility

## File Structure

```
├── app/
│   ├── api/revalidate/route.js     # Webhook endpoint
│   ├── explore/[segment]/page.js   # Dynamic explore pages
│   ├── studio/[[...index]]/page.js # Sanity Studio
│   └── components/
│       ├── ProductGrid.js          # Product listing grid
│       ├── ProductFilters.js       # Search and filters
│       └── Pagination.js           # Page navigation
├── lib/sanity.js                   # Sanity client config
├── sanity/schemas/                 # Content schemas
│   ├── index.js
│   ├── product.js
│   └── heroSegment.js
├── sanity.config.js                # Sanity configuration
└── .env.local                      # Environment variables
```

## Troubleshooting

### Common Issues

1. **Studio not loading**: Check your Project ID and dataset name
2. **Products not showing**: Ensure hero segments have correct slugs
3. **Images not displaying**: Verify Sanity image URLs and permissions
4. **Webhooks not working**: Check the revalidate secret and URL

### Support

For issues with:

- Sanity setup: [Sanity Documentation](https://www.sanity.io/docs)
- Next.js integration: [Next.js Documentation](https://nextjs.org/docs)

## Performance Notes

- Pages use ISR (Incremental Static Regeneration) with 60-second revalidation
- Images are optimized using Next.js Image component
- GROQ queries are optimized for performance
- Pagination limits results to 12 products per page

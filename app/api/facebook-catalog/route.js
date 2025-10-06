import { NextResponse } from 'next/server';
import { sanityClient } from '../../../lib/sanity';

// Facebook Catalog API endpoint
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'csv';
    
    // Fetch all products from Sanity
    const products = await sanityClient.fetch(`
      *[_type == "product" && !(_id in path("drafts.**")) && (!defined(facebookCatalog.excludeFromCatalog) || facebookCatalog.excludeFromCatalog == false)] {
        _id,
        title,
        slug,
        images[] {
          asset-> {
            url,
            metadata {
              dimensions
            }
          },
          alt
        },
        brand,
        price,
        originalPrice,
        onSale,
        outOfStock,
        summary,
        description,
        sizes,
        productDetails,
        tags,
        facebookCatalog,
        heroSegments[]-> {
          title,
          slug
        },
        navigationMenu-> {
          title,
          slug
        }
      }
    `);

    // Transform products to Facebook Catalog format
    const catalogData = products.map(product => {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.empire.com.bd';
      const productUrl = `${baseUrl}/product/${product.slug?.current}`;
      const imageUrl = product.images?.[0]?.asset?.url;
      
      // Add UTM parameters for Facebook catalog tracking
      const catalogUrl = `${productUrl}?utm_source=facebook&utm_medium=catalog&utm_campaign=dynamic_ads&utm_content=${product._id}`;
      
      // Determine availability
      const availability = product.outOfStock ? 'out of stock' : 'in stock';
      
      // Get condition from Facebook catalog settings or default to 'new'
      const condition = product.facebookCatalog?.condition || 'new';
      
      // Get Google Product Category from Facebook catalog settings or determine from navigation
      let googleProductCategory = product.facebookCatalog?.googleProductCategory;
      
      if (!googleProductCategory) {
        // Fallback to category mapping if not set in Facebook catalog settings
        const categoryMapping = {
          'shoes': 'Apparel & Accessories > Shoes',
          'bags': 'Apparel & Accessories > Handbags, Wallets & Cases',
          'accessories': 'Apparel & Accessories > Jewelry',
          'clothing': 'Apparel & Accessories > Clothing'
        };
        
        googleProductCategory = 'Apparel & Accessories'; // Default category
        if (product.navigationMenu?.slug?.current) {
          googleProductCategory = categoryMapping[product.navigationMenu.slug.current] || googleProductCategory;
        } else if (product.heroSegments?.[0]?.slug?.current) {
          googleProductCategory = categoryMapping[product.heroSegments[0].slug.current] || googleProductCategory;
        }
      }

      return {
        // Required fields for Facebook Catalog
        id: product._id,
        title: product.title,
        description: product.summary || product.title,
        availability: availability,
        condition: condition,
        price: `${product.price} BDT`,
        link: catalogUrl,
        image_link: imageUrl,
        brand: product.brand,
        
        // Additional recommended fields
        google_product_category: googleProductCategory,
        product_type: product.navigationMenu?.title || product.heroSegments?.[0]?.title || 'General',
        
        // Optional fields that improve ad performance
        ...(product.originalPrice && product.onSale && {
          sale_price: `${product.price} BDT`,
          sale_price_effective_date: new Date().toISOString().split('T')[0] + '/' + new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }),
        
        // Additional images (always include, use empty string as fallback)
        additional_image_link: product.images?.length > 1 
          ? product.images.slice(1, 11).map(img => img.asset?.url).filter(Boolean).join(',')
          : '',
        
        // Size information (always include, use 'One Size' as fallback)
        size: product.sizes?.length > 0 
          ? product.sizes.map(s => s.size).join(',')
          : 'One Size',
        
        // Material information (always include, use 'Not Specified' as fallback)
        material: product.productDetails?.material || 'Not Specified',
        
        // Custom labels for better organization
        custom_label_0: product.facebookCatalog?.customLabel0 || product.brand,
        custom_label_1: product.facebookCatalog?.customLabel1 || product.navigationMenu?.title || 'General',
        custom_label_2: product.onSale ? 'Sale' : 'Regular',
        custom_label_3: availability,
        custom_label_4: product.tags?.[0] || 'General',
        
        // Additional Facebook catalog fields
        ...(product.facebookCatalog?.ageGroup && {
          age_group: product.facebookCatalog.ageGroup
        }),
        
        ...(product.facebookCatalog?.gender && {
          gender: product.facebookCatalog.gender
        })
      };
    });

    // Return data in requested format
    if (format === 'csv') {
      // Convert to CSV format for Facebook catalog upload
      const headers = Object.keys(catalogData[0] || {});
      const csvContent = [
        headers.join(','),
        ...catalogData.map(item => 
          headers.map(header => {
            const value = item[header] || '';
            // Escape commas and quotes in CSV
            return typeof value === 'string' && (value.includes(',') || value.includes('"')) 
              ? `"${value.replace(/"/g, '""')}"` 
              : value;
          }).join(',')
        )
      ].join('\n');

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="facebook-catalog.csv"'
        }
      });
    }

    // Return JSON format (default)
    return NextResponse.json({
      success: true,
      count: catalogData.length,
      data: catalogData,
      meta: {
        generated_at: new Date().toISOString(),
        format: 'facebook_catalog_v1',
        base_url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.empire.com.bd'
      }
    });

  } catch (error) {
    console.error('Facebook Catalog API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate catalog data',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
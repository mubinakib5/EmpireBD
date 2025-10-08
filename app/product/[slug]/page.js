import { notFound } from "next/navigation";
import { sanityClient as client } from '../../../lib/sanity';
import ProductPageClient from "../../components/ProductPageClient";

// GROQ query to fetch product by slug
const productQuery = `
  *[_type == "product" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    images[] {
      asset-> {
        _id,
        url
      },
      alt
    },
    brand,
    price,
    originalPrice,
    onSale,
    outOfStock,
    salePercentage,
    summary,
    description,
    sizes[] {
      size,
      inStock
    },
    productDetails {
      material,
      care,
      origin,
      features
    },
    shipping {
      freeShipping,
      shippingTime,
      returnPolicy
    },
    specs,
    tags,
    heroSegment-> {
      title,
      slug
    },
    navigationMenu-> {
      title,
      slug
    },
    seo {
      metaTitle,
      metaDescription,
      keywords
    }
  }
`;

// Related products query
const relatedProductsQuery = `
  *[_type == "product" && slug.current != $slug] | order(_createdAt desc) [0...8] {
    _id,
    title,
    slug,
    images[] {
      asset-> {
        _id,
        url
      },
      alt
    },
    brand,
    price,
    originalPrice,
    onSale,
    salePercentage
  }
`;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await client.fetch(productQuery, { slug });
  
  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  // Generate URLs and image data
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.empire.com.bd';
  const productUrl = `${baseUrl}/product/${product.slug.current}`;
  const imageUrl = product.images?.[0]?.asset?.url;
  const imageAlt = product.images?.[0]?.alt || `${product.title} - ${product.brand}`;
  
  // Format price for display
  const formattedPrice = `৳${product.price}`;
  const originalPriceText = product.onSale && product.originalPrice ? ` (was ৳${product.originalPrice})` : '';
  
  return {
    title: product.seo?.metaTitle || `${product.title} - ${product.brand}`,
    description: product.seo?.metaDescription || product.summary,
    keywords: product.seo?.keywords?.join(", ") || product.tags?.join(", "),
    
    // Open Graph tags for rich link previews
    openGraph: {
      title: `${product.title} - ${product.brand}`,
      description: product.summary || product.description,
      url: productUrl,
      siteName: 'Empire BD',
      type: 'website',
      images: imageUrl ? [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: imageAlt,
        }
      ] : [],
      locale: 'en_US',
    },
    
    // Twitter Card tags
    twitter: {
      card: 'summary_large_image',
      title: `${product.title} - ${product.brand}`,
      description: product.summary || product.description,
      images: imageUrl ? [imageUrl] : [],
      creator: '@EmpireBD',
      site: '@EmpireBD',
    },
    
    // Additional meta tags for better SEO and social sharing
    other: {
      'product:price:amount': product.price,
      'product:price:currency': 'BDT',
      'product:availability': product.outOfStock ? 'out of stock' : 'in stock',
      'product:brand': product.brand,
      'product:condition': 'new',
      'og:price:amount': product.price,
      'og:price:currency': 'BDT',
    },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await client.fetch(productQuery, { slug });
  
  if (!product) {
    notFound();
  }

  const relatedProducts = await client.fetch(relatedProductsQuery, {
    slug,
  });

  // Generate structured data for Facebook and SEO
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.empire.com.bd';
  const productUrl = `${baseUrl}/product/${product.slug.current}`;
  const imageUrl = product.images?.[0]?.asset?.url;
  
  const structuredData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.title,
    "image": imageUrl,
    "description": product.description || product.summary,
    "sku": product._id,
    "mpn": product._id,
    "brand": {
      "@type": "Brand",
      "name": product.brand
    },
    "offers": {
      "@type": "Offer",
      "url": productUrl,
      "priceCurrency": "BDT",
      "price": product.price,
      "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.outOfStock ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Empire BD"
      }
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <ProductPageClient product={product} relatedProducts={relatedProducts} />
    </>
  );
}
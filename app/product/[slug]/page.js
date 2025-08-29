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

  return {
    title: product.seo?.metaTitle || `${product.title} - ${product.brand}`,
    description: product.seo?.metaDescription || product.summary,
    keywords: product.seo?.keywords?.join(", ") || product.tags?.join(", "),
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

  return (
    <ProductPageClient product={product} relatedProducts={relatedProducts} />
  );
}
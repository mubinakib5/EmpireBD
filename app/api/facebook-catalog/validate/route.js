import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';

export async function GET() {
  try {
    // Fetch all products for validation
    const products = await client.fetch(`
      *[_type == "product" && !(_id in path("drafts.**"))] {
        _id,
        title,
        slug,
        images,
        brand,
        price,
        originalPrice,
        onSale,
        outOfStock,
        description,
        summary,
        tags,
        navigationMenu,
        facebookCatalog
      }
    `);

    const validationResults = {
      totalProducts: products.length,
      validProducts: 0,
      invalidProducts: 0,
      warnings: [],
      errors: [],
      recommendations: []
    };

    const issues = [];

    products.forEach((product, index) => {
      const productIssues = {
        productId: product._id,
        productTitle: product.title,
        errors: [],
        warnings: []
      };

      // Required field validation
      if (!product.title || product.title.trim() === '') {
        productIssues.errors.push('Missing required field: title');
      }

      if (!product.slug?.current) {
        productIssues.errors.push('Missing required field: slug');
      }

      if (!product.price || product.price <= 0) {
        productIssues.errors.push('Missing or invalid price');
      }

      if (!product.brand || product.brand.trim() === '') {
        productIssues.errors.push('Missing required field: brand');
      }

      if (!product.images || product.images.length === 0) {
        productIssues.errors.push('Missing product images');
      }

      if (!product.description && !product.summary) {
        productIssues.errors.push('Missing product description');
      }

      // Warning validations
      if (product.title && product.title.length > 150) {
        productIssues.warnings.push('Title too long (>150 characters) - may be truncated in Facebook ads');
      }

      if (product.description && product.description.length > 5000) {
        productIssues.warnings.push('Description too long (>5000 characters) - may be truncated');
      }

      if (!product.facebookCatalog?.condition) {
        productIssues.warnings.push('Missing Facebook catalog condition - will default to "new"');
      }

      if (!product.facebookCatalog?.googleProductCategory) {
        productIssues.warnings.push('Missing Google product category - may affect ad targeting');
      }

      if (!product.tags || product.tags.length === 0) {
        productIssues.warnings.push('No tags assigned - may affect categorization');
      }

      if (product.images && product.images.length === 1) {
        productIssues.warnings.push('Only one image - consider adding more for better performance');
      }

      // Count valid/invalid products
      if (productIssues.errors.length === 0) {
        validationResults.validProducts++;
      } else {
        validationResults.invalidProducts++;
      }

      // Add to issues if there are any problems
      if (productIssues.errors.length > 0 || productIssues.warnings.length > 0) {
        issues.push(productIssues);
      }
    });

    // Generate recommendations
    const errorRate = (validationResults.invalidProducts / validationResults.totalProducts) * 100;
    
    if (errorRate > 10) {
      validationResults.recommendations.push('High error rate detected. Consider bulk updating product data.');
    }

    if (validationResults.invalidProducts > 0) {
      validationResults.recommendations.push('Fix products with errors before submitting catalog to Facebook.');
    }

    const productsWithoutCategories = issues.filter(issue => 
      issue.warnings.some(warning => warning.includes('Google product category'))
    ).length;

    if (productsWithoutCategories > validationResults.totalProducts * 0.5) {
      validationResults.recommendations.push('Consider adding Google product categories to improve ad targeting.');
    }

    // Summary statistics
    validationResults.summary = {
      validationScore: Math.round((validationResults.validProducts / validationResults.totalProducts) * 100),
      readyForFacebook: validationResults.invalidProducts === 0,
      criticalIssues: validationResults.invalidProducts,
      minorIssues: issues.filter(issue => issue.errors.length === 0 && issue.warnings.length > 0).length
    };

    return NextResponse.json({
      success: true,
      validation: validationResults,
      issues: issues,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Catalog validation error:', error);
    return NextResponse.json(
      { error: 'Failed to validate catalog data', message: error.message },
      { status: 500 }
    );
  }
}
// Pure pricing rules shared by the storefront, catalog and CMS validation.
const validPrice = (value) => Number.isFinite(value) && value >= 0;
const validDiscount = (value) => Number.isFinite(value) && value > 0 && value <= 100;

export function validateSalePricing(product) {
  if (!product?.onSale) return true;
  if (!validPrice(product.price)) return "Enter a valid Price before enabling On Sale.";
  if (validPrice(product.originalPrice) && product.originalPrice > product.price) return true;
  if (validDiscount(product.salePercentage)) return true;
  return "On Sale requires a Sale Percentage greater than 0, or an Original Price greater than Price.";
}

export function applyProductPricing(product) {
  if (!product) return product;
  const { price, originalPrice, salePercentage, onSale } = product;
  // The toggle is authoritative. Never infer a sale from old discount fields.
  if (!onSale) return { ...product, originalPrice: null, salePercentage: null };
  if (!validPrice(price)) return { ...product, originalPrice: null, salePercentage: null };
  // Explicit old/current prices take precedence over an optional percentage label.
  if (validPrice(originalPrice) && originalPrice > price) {
    return {
      ...product,
      salePercentage: Math.round((1 - price / originalPrice) * 10000) / 100,
    };
  }
  if (validDiscount(salePercentage)) {
    const discountedPrice = Math.round(price * (1 - salePercentage / 100) * 100) / 100;
    return {
      ...product,
      originalPrice: discountedPrice < price ? price : null,
      price: discountedPrice,
      salePercentage: discountedPrice < price ? Math.round((1 - discountedPrice / price) * 10000) / 100 : null,
    };
  }
  return { ...product, originalPrice: null, salePercentage: null };
}

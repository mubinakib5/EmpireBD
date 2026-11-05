// Keep explicit original/current prices compatible with percentage-only sales.
export function applyProductPricing(product) {
  if (!product) return product;
  const { price, originalPrice, salePercentage, onSale } = product;
  if (!onSale) return product;
  if (Number.isFinite(originalPrice) && originalPrice > price) return product;
  if (Number.isFinite(price) && salePercentage > 0 && salePercentage <= 100) {
    return {
      ...product,
      originalPrice: price,
      price: Math.round(price * (1 - salePercentage / 100) * 100) / 100,
    };
  }
  return { ...product, originalPrice: null };
}

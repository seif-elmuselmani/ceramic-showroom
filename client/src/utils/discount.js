/**
 * Calculates discount status, percentage, savings amount, and auto-expiry duration text for a product.
 * If offerEndDate has passed, the discount automatically deactivates (returns hasDiscount: false).
 */
export function getProductDiscount(product) {
  if (!product || !product.originalPrice || Number(product.originalPrice) <= Number(product.price)) {
    return { hasDiscount: false, discountPercent: 0, savingsAmount: 0, durationText: '' };
  }

  // Check if offer date has passed (Auto-Expiry)
  if (product.offerEndDate) {
    const endDate = new Date(product.offerEndDate);
    endDate.setHours(23, 59, 59, 999);
    if (new Date() > endDate) {
      return { hasDiscount: false, expired: true, discountPercent: 0, savingsAmount: 0, durationText: '' };
    }
  }

  const orig = Number(product.originalPrice);
  const curr = Number(product.price);
  const discountPercent = Math.round(((orig - curr) / orig) * 100);
  const savingsAmount = orig - curr;

  let durationText = product.offerNote || product.offerDuration || '';
  if (product.offerEndDate) {
    const endDate = new Date(product.offerEndDate);
    const today = new Date();
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      durationText = `ينتهي اليوم! ⌛ ${product.offerNote ? `(${product.offerNote})` : ''}`;
    } else if (diffDays === 1) {
      durationText = `ينتهي غداً! ⌛ ${product.offerNote ? `(${product.offerNote})` : ''}`;
    } else if (diffDays > 1 && diffDays <= 30) {
      durationText = `باقي ${diffDays} أيام على انتهاء العرض ⏰ ${product.offerNote ? `(${product.offerNote})` : ''}`;
    } else {
      durationText = `ينتهي في ${endDate.toLocaleDateString('ar-EG')} ⏰ ${product.offerNote ? `(${product.offerNote})` : ''}`;
    }
  }

  return {
    hasDiscount: true,
    discountPercent,
    savingsAmount,
    durationText
  };
}

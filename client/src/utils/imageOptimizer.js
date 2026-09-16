/**
 * Utility to optimize image delivery on-the-fly without modifying original files or database records.
 * Supports Cloudinary auto-format & quality compression and Unsplash parameters safely.
 * 
 * @param {string} url - Original image URL
 * @param {object} options - Optimization options { width: number, quality: string | number }
 * @returns {string} - Optimized URL or safe original fallback
 */
export function getOptimizedImageUrl(url, options = {}) {
  if (!url || typeof url !== 'string') return url;

  const { width = 600, quality = 'auto' } = options;

  // 1. Cloudinary on-the-fly transformation (f_auto,q_auto,w_{width})
  if (url.includes('cloudinary.com') && url.includes('/image/upload/')) {
    // Avoid duplicate transformations
    if (
      url.includes('/image/upload/f_auto') || 
      url.includes('/image/upload/w_') || 
      url.includes('/image/upload/q_')
    ) {
      return url;
    }
    const transformStr = `f_auto,q_${quality},w_${width}`;
    return url.replace('/image/upload/', `/image/upload/${transformStr}/`);
  }

  // 2. Unsplash on-the-fly transformations
  if (url.includes('images.unsplash.com')) {
    try {
      const parsedUrl = new URL(url);
      parsedUrl.searchParams.set('auto', 'format');
      parsedUrl.searchParams.set('fit', 'crop');
      parsedUrl.searchParams.set('w', width.toString());
      parsedUrl.searchParams.set('q', quality === 'auto' ? '75' : quality.toString());
      return parsedUrl.toString();
    } catch {
      return url;
    }
  }

  // 3. Any other image URL (local uploads / external) -> Return safely unchanged
  return url;
}

export default getOptimizedImageUrl;

/**
 * Generates a proxied image URL using wsrv.nl
 * This helps bypass CORS issues and 403 errors from source URLs
 *
 * @param url - The original image URL
 * @param width - Optional width for the image
 * @param quality - Optional quality (1-100)
 * @returns Proxied image URL
 */
export const getProxiedImageUrl = (url: string, width?: number, quality: number = 75): string => {
  const encodedUrl = encodeURIComponent(url);
  const params = new URLSearchParams({
    url: url,
    w: width?.toString() || '400',
    q: quality.toString(),
    output: 'jpg'
  });

  return `https://wsrv.nl/?${params.toString()}`;
};

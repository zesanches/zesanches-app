const DEFAULT_IMAGE_WIDTH = 400;
const DEFAULT_IMAGE_QUALITY = 75;
const IMAGE_OUTPUT_FORMAT = 'jpg';

export const getProxiedImageUrl = (url: string, width?: number, quality: number = DEFAULT_IMAGE_QUALITY): string => {
  const params = new URLSearchParams({
    url: url,
    w: width?.toString() || DEFAULT_IMAGE_WIDTH.toString(),
    q: quality.toString(),
    output: IMAGE_OUTPUT_FORMAT
  });

  return `https://wsrv.nl/?${params.toString()}`;
};

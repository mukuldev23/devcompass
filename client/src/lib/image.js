export function optimizeImageUrl(rawUrl, width = 640) {
  if (!rawUrl) return rawUrl;

  try {
    const url = new URL(rawUrl);
    const host = url.hostname.toLowerCase();

    if (host.includes('unsplash.com') || host.includes('images.unsplash.com')) {
      url.searchParams.set('auto', 'format');
      url.searchParams.set('fit', 'crop');
      url.searchParams.set('w', String(width));
      url.searchParams.set('q', '70');
      return url.toString();
    }

    if (host.includes('res.cloudinary.com')) {
      // Best-effort Cloudinary quality hints when URL already supports transformations.
      return url.toString();
    }

    return url.toString();
  } catch {
    return rawUrl;
  }
}

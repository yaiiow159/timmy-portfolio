const normalizeImageUrl = (imageUrl) => {
  if (!imageUrl) return [];
  if (Array.isArray(imageUrl)) return imageUrl;
  if (typeof imageUrl === 'string') return [imageUrl];
  return [];
};

module.exports = { normalizeImageUrl };

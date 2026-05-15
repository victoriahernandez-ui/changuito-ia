export async function searchOpenFoodFacts(query: string) {
  const trimmedQuery = query?.trim();
  if (!trimmedQuery || trimmedQuery.length < 3) {
    return [];
  }

  try {
    const response = await fetch(`/api/products?query=${encodeURIComponent(trimmedQuery)}`);

    if (!response.ok) {
      throw new Error('Error fetching products');
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('searchOpenFoodFacts error:', error);
    return [];
  }
}
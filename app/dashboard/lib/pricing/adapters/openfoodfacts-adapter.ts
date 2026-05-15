export async function searchOpenFoodFacts(query: string) {
  if (!query) return [];

  try {
    const response = await fetch(
      `/api/products?query=${encodeURIComponent(query)}`
    );

    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}
export async function loadGeoJson(path: string) {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error("Failed to load GeoJSON");
  }

  return response.json();
}
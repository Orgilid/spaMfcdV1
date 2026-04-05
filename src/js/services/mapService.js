// 4. SVG газрын зургийг ачаалах
export async function loadMapSvg() {
  const response = await fetch("./img/map.svg");

  if (!response.ok) {
    throw new Error("Failed to load map.svg");
  }

  return await response.text();
}

// 4.1. Аймгийн нэрээр food data шүүх
export function getFoodsByProvince(nutritionData, provinceName) {
  if (!Array.isArray(nutritionData)) return [];

  return nutritionData.filter((item) => item.province === provinceName);
}

import { loadMapSvg, getFoodsByProvince } from "../services/mapService.js";
import { openModal, renderModalFoodList } from "./InfoModal.js";

// 2. Газрын зургийн HTML хэсгийг дүрслэх
export function renderMap() {
  return `
    <div class="map-wrap">
      <div id="svg-container"></div>
    </div>
  `;
}

// 2.1. Газрын зургийг ачаалж, аймаг дээр click event холбоно.
export async function bindMapEvents(nutritionData) {
  const svgContainer = document.getElementById("svg-container");
  if (!svgContainer) return;

  // 2.1.1. SVG газрын зургийг ачаалж оруулна.
  const svgData = await loadMapSvg();
  svgContainer.innerHTML = svgData;

  // 2.1.2. SVG доторх аймаг бүрийн path элементүүдийг авна.
  const provincePaths = svgContainer.querySelectorAll("svg path[name]");

  provincePaths.forEach((path) => {
    path.addEventListener("click", () => {
      const provinceName = path.getAttribute("name")?.trim();
      if (!provinceName) return;

      // 2.1.3. Сонгогдсон аймагт харьяалагдах food-уудыг шүүнэ.
      const matchedFoods = getFoodsByProvince(nutritionData, provinceName);

      if (matchedFoods.length > 0) {
        const foods = matchedFoods.map((item) => ({
          foodCode: item.food_code,
          foodName: item.food_name,
        }));

        openModal({
          title: `${provinceName} province`,
          content: renderModalFoodList(foods),
        });
      } else {
        openModal({
          title: `${provinceName} province`,
          content: `<p class="has-text-grey">No food data found for this province.</p>`,
        });
      }
    });
  });
}

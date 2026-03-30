import { renderSearchControls } from "./SearchControls.js";
import { renderFoodGroupList } from "./FoodGroupList.js";

export function renderSearchFilters(foodGroups) {
  return `
    ${renderSearchControls()}
    <br>
    ${renderFoodGroupList(foodGroups)}
  `;
}

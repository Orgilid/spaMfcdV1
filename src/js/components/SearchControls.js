import { escapeHtml } from "../utils/escapeHtml.js";

// Хүнсний найрлагыг харуулах анхны тохиргоо.
const nutritionOptions = [
  { value: "proximates", label: "Proximates", checked: true },
  { value: "minerals", label: "Minerals", checked: true },
  { value: "vitamins", label: "Vitamins", checked: true },
  {
    value: "collection_information",
    label: "Collection information",
    checked: false,
  },
  {
    value: "edible_inedible_part",
    label: "Edible inedible part",
    checked: false,
  },
  {
    value: "pretreatment_conditions",
    label: "Pretreatment conditions",
    checked: false,
  },
  { value: "description", label: "Description", checked: false },
  { value: "images", label: "Images", checked: false },
];

// Хүнсний найрлагын checkbox сонголтыг дүрслэх функц
// <input type="checkbox" checked name="nutrition" value="proximates"> Proximates
// <input type="checkbox" name="nutrition" value="collection_information"> Collection information гэх мэт
function renderNutritionOption(option) {
  return `
    <div class="control">
      <label class="checkbox">
        <input
          type="checkbox"
          name="nutrition"
          value="${escapeHtml(option.value)}"
          ${option.checked ? "checked" : ""}
        >
        ${escapeHtml(option.label)}
      </label>
    </div>
  `;
}

//  Үг бичиж хайх, хүнсний найрлага сонгох checkbox-уудыг бүгдийг нь агуулсан хайлт хийх хэсгийг HTML хэлбэрээр үүсгэх функц.
export function renderSearchControls() {
  const mainNutritionOptions = nutritionOptions.slice(0, 3); // Proximates, Minerals, Vitamins
  const sampleInfoOptions = nutritionOptions.slice(3); // Collection information, Edible inedible part, Pretreatment conditions, Description, Images

  return `
    <div class="container box search-filters">
      <!-- 2.1.1. Үг бичиж хайх -->
      <div class="field has-addons">
        <div class="control is-expanded">
          <input
            id="searchTxt"
            class="input"
            type="text"
            placeholder="Food Name"
          >
        </div>
        <div class="control">
          <button id="searchBtn" class="button is-primary" type="button">
            Search
          </button>
        </div>
      </div>

      <br>

      <!-- 2.1.2. Хүнсний найрлага сонгох checkbox-ууд -->
      <div class="field">
        <label class="label">Nutritions:</label>
        ${mainNutritionOptions.map(renderNutritionOption).join("")}

        <label class="label" style="margin-top: 1rem;">Sample informations:</label>
        ${sampleInfoOptions.map(renderNutritionOption).join("")}
      </div>
    </div>
  `;
}

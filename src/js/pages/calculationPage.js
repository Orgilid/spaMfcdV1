import { getNutritions } from "../services/nutritionService.js";
import { renderFoodGroupList } from "../components/FoodGroupList.js";
import { renderCalculationTable, refreshCalculationTable } from "../components/CalculationTable.js";
import { renderCalculationInfo } from "../components/CalculationInfo.js";

let nutritionData = [];

export async function renderCalculationPage() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <div id="calculation">
      <div class="container">
        <h1 class="is-size-4-mobile is-size-3-tablet is-size-2-desktop has-text-weight-semibold has-text-centered txt-h">
          Food Calculation
        </h1>

        <div class="box">
          <p>Loading data...</p>
        </div>
      </div>
    </div>
  `;

  try {
    nutritionData = await getNutritions();
    const foodGroups = buildFoodGroups(nutritionData);

    app.innerHTML = `
      <div id="calculation">
        <div class="container">
          <h1 class="is-size-4-mobile is-size-3-tablet is-size-2-desktop has-text-weight-semibold has-text-centered txt-h">
            Food Calculation
          </h1>

          <div class="columns is-variable is-4">
            <div class="column is-12-mobile is-4-tablet is-3-desktop">
              ${renderFoodGroupList(foodGroups)}
            </div>

            <div id="resultCalculatedTbl" class="column is-12-mobile is-8-tablet is-9-desktop">
              ${renderCalculationInfo()}
              ${renderCalculationTable([])}
            </div>
          </div>
        </div>
      </div>
    `;

    bindCalculationEvents();
  } catch (error) {
    app.innerHTML = `
      <div class="section">
        <div class="container">
          <div class="notification is-danger">
            Failed to load nutrition data.
          </div>
        </div>
      </div>
    `;

    console.error(error);
  }
}

function buildFoodGroups(data) {
  const grouped = new Map();

  for (const item of data) {
    const groupName = item.food_group || "Other";

    if (!grouped.has(groupName)) {
      grouped.set(groupName, new Map());
    }

    const groupItems = grouped.get(groupName);

    groupItems.set(item.food_code, {
      food_code: item.food_code,
      food_name: item.food_name,
    });
  }

  return Array.from(grouped.entries()).map(([groupName, itemsMap]) => ({
    groupName,
    items: Array.from(itemsMap.values()).sort((a, b) => (a.food_name || "").localeCompare(b.food_name || "")),
  }));
}

function bindCalculationEvents() {
  const calculationRoot = document.getElementById("calculation");
  if (!calculationRoot) return;

  calculationRoot.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    if (target.matches('input[name="foodcode"]')) {
      refreshCalculationTable(nutritionData);
    }
  });

  calculationRoot.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const toggle = target.closest(".toggle-sublist");
    if (!toggle) return;

    event.preventDefault();

    const sublist = toggle.nextElementSibling;
    if (!(sublist instanceof HTMLElement)) return;

    sublist.classList.toggle("is-hidden");
  });
}

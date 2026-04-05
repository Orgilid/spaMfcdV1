import { escapeHtml } from "../utils/escapeHtml.js";

function getFoodCode(item) {
  return item.food_code || item.foodcode || item.code || item.FoodCode || "";
}

function getFoodName(item) {
  return item.food_name || item.foodname || item.foodName || item.name || item.FoodName || "Unknown food";
}

function getProtein(item) {
  return Number(
    item?.proximates?.["Protein (g)"] ?? item?.proximates?.["Protein(g)"] ?? item?.proximates?.Protein ?? 0,
  );
}

function getFat(item) {
  return Number(item?.proximates?.["Fat (g)"] ?? item?.proximates?.["Fat(g)"] ?? item?.proximates?.Fat ?? 0);
}

function getCarb(item) {
  return Number(
    item?.proximates?.["Carbohydrate (g)"] ??
      item?.proximates?.["Carbohydrate(g)"] ??
      item?.proximates?.Carbohydrate ??
      0,
  );
}

function findFoodByCode(nutritionData, code) {
  return nutritionData.find((item) => getFoodCode(item) === code);
}

function renderCalculationRow(food) {
  const code = getFoodCode(food);
  const name = getFoodName(food);
  const protein = getProtein(food);
  const fat = getFat(food);
  const carb = getCarb(food);

  const amount = 100;
  const proteinAmount = (protein * amount) / 100;
  const fatAmount = (fat * amount) / 100;
  const carbAmount = (carb * amount) / 100;

  const energy = proteinAmount * 4 + fatAmount * 9 + carbAmount * 4;

  const protPct = energy ? (((proteinAmount * 4) / energy) * 100).toFixed(2) : "0.00";
  const fatPct = energy ? (((fatAmount * 9) / energy) * 100).toFixed(2) : "0.00";
  const carbPct = energy ? (((carbAmount * 4) / energy) * 100).toFixed(2) : "0.00";

  return `
    <tr>
      <td>${escapeHtml(name)}</td>
      <td>
        <input
          id="amount-${escapeHtml(code)}"
          class="input is-small amount-input"
          type="number"
          min="0"
          step="0.01"
          value="${amount}"
          data-protein="${protein}"
          data-fat="${fat}"
          data-carb="${carb}"
        />
      </td>
      <td id="energy-${escapeHtml(code)}" class="has-text-right">
        ${energy.toFixed(2)}
      </td>
      <td id="prot-${escapeHtml(code)}" class="has-text-right">
        ${protPct}
      </td>
      <td id="fat-${escapeHtml(code)}" class="has-text-right">
        ${fatPct}
      </td>
      <td id="carb-${escapeHtml(code)}" class="has-text-right">
        ${carbPct}
      </td>
      <td class="has-text-centered">
        <button
          type="button"
          class="button is-small is-danger is-light remove-row-btn"
          data-code="${escapeHtml(code)}"
        >
          ×
        </button>
      </td>
    </tr>
  `;
}

export function renderCalculationTable(selectedFoods = []) {
  if (!selectedFoods.length) {
    return `
      <div id="calculationTableWrap" class="mt-4"></div>
    `;
  }

  return `
    <div id="calculationTableWrap" class="table-container box tbl">
      <table class="table is-fullwidth is-bordered is-striped is-hoverable is-narrow">
        <thead>
          <tr>
            <th>Food name</th>
            <th>Amount (g)</th>
            <th class="has-text-right">Calculated Energy (kcal)</th>
            <th class="has-text-right">Protein Energy (%)</th>
            <th class="has-text-right">Fat Energy (%)</th>
            <th class="has-text-right">Carbohydrate Energy (%)</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          ${selectedFoods.map(renderCalculationRow).join("")}
        </tbody>

        <tfoot>
          <tr class="has-background-light has-text-weight-semibold">
            <td>Total</td>
            <td id="total-amount" class="has-text-right">0.00</td>
            <td id="total-energy" class="has-text-right">0.00</td>
            <td id="total-prot" class="has-text-right">0.00</td>
            <td id="total-fat" class="has-text-right">0.00</td>
            <td id="total-carb" class="has-text-right">0.00</td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
  `;
}

export function recalculate(code, baseProtein, baseFat, baseCarb) {
  const amount = parseFloat(document.getElementById(`amount-${code}`)?.value) || 0;

  const protein = (baseProtein * amount) / 100;
  const fat = (baseFat * amount) / 100;
  const carb = (baseCarb * amount) / 100;

  const energy = protein * 4 + fat * 9 + carb * 4;

  const protPct = energy ? (((protein * 4) / energy) * 100).toFixed(2) : "0.00";
  const fatPct = energy ? (((fat * 9) / energy) * 100).toFixed(2) : "0.00";
  const carbPct = energy ? (((carb * 4) / energy) * 100).toFixed(2) : "0.00";

  document.getElementById(`energy-${code}`).textContent = energy.toFixed(2);
  document.getElementById(`prot-${code}`).textContent = protPct;
  document.getElementById(`fat-${code}`).textContent = fatPct;
  document.getElementById(`carb-${code}`).textContent = carbPct;

  updateTotals();
}

export function updateTotals() {
  let totalAmount = 0;
  let totalProtein = 0;
  let totalFat = 0;
  let totalCarb = 0;

  document.querySelectorAll(".amount-input").forEach((input) => {
    const amount = parseFloat(input.value) || 0;
    const baseProtein = parseFloat(input.dataset.protein) || 0;
    const baseFat = parseFloat(input.dataset.fat) || 0;
    const baseCarb = parseFloat(input.dataset.carb) || 0;

    totalAmount += amount;
    totalProtein += (baseProtein * amount) / 100;
    totalFat += (baseFat * amount) / 100;
    totalCarb += (baseCarb * amount) / 100;
  });

  const totalEnergy = totalProtein * 4 + totalFat * 9 + totalCarb * 4;

  const totalProtPct = totalEnergy ? (((totalProtein * 4) / totalEnergy) * 100).toFixed(2) : "0.00";
  const totalFatPct = totalEnergy ? (((totalFat * 9) / totalEnergy) * 100).toFixed(2) : "0.00";
  const totalCarbPct = totalEnergy ? (((totalCarb * 4) / totalEnergy) * 100).toFixed(2) : "0.00";

  const totalAmountEl = document.getElementById("total-amount");
  const totalEnergyEl = document.getElementById("total-energy");
  const totalProtEl = document.getElementById("total-prot");
  const totalFatEl = document.getElementById("total-fat");
  const totalCarbEl = document.getElementById("total-carb");

  if (totalAmountEl) totalAmountEl.textContent = totalAmount.toFixed(2);
  if (totalEnergyEl) totalEnergyEl.textContent = totalEnergy.toFixed(2);
  if (totalProtEl) totalProtEl.textContent = totalProtPct;
  if (totalFatEl) totalFatEl.textContent = totalFatPct;
  if (totalCarbEl) totalCarbEl.textContent = totalCarbPct;
}

export function refreshCalculationTable(nutritionData) {
  const checkedCodes = [...document.querySelectorAll('input[name="foodcode"]:checked')].map((el) => el.value);

  const selectedFoods = checkedCodes.map((code) => findFoodByCode(nutritionData, code)).filter(Boolean);

  const resultBox = document.getElementById("resultCalculatedTbl");
  if (!resultBox) return;

  resultBox.innerHTML = renderCalculationTable(selectedFoods);

  resultBox.querySelectorAll(".amount-input").forEach((input) => {
    input.addEventListener("input", () => {
      const code = input.id.replace("amount-", "");
      const baseProtein = parseFloat(input.dataset.protein) || 0;
      const baseFat = parseFloat(input.dataset.fat) || 0;
      const baseCarb = parseFloat(input.dataset.carb) || 0;

      recalculate(code, baseProtein, baseFat, baseCarb);
    });
  });

  resultBox.querySelectorAll(".remove-row-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const code = btn.dataset.code;
      const checkbox = document.querySelector(`input[name="foodcode"][value="${code}"]`);
      if (checkbox) checkbox.checked = false;

      refreshCalculationTable(nutritionData);
    });
  });

  updateTotals();
}

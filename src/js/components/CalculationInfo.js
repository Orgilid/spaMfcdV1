export function renderCalculationInfo() {
  return `
    <div class="notification is-success is-light">
      Please select the food items to calculate from the list. The <strong>total energy</strong> content per 100 grams of each food will be calculated and displayed, showing the percentage of <strong>protein, fat,</strong> and <strong>carbohydrates</strong>. When you adjust the amount of each food item, the overall result will be recalculated.
    </div>

    <div class="notification is-info is-light mt-3">
      <strong>Calculated Energy</strong><br>
      <code>Calculated Energy (kcal) = (Protein × 4) + (Fat × 9) + (Carbohydrate × 4)</code><br>
      ➥ This calculates the total energy derived from protein, fat, and carbohydrates.
    </div>

    <div class="notification is-warning is-light mt-3">
      <strong>Energy Contribution %</strong><br>
      <code>% Protein Energy = (Protein × 4 / Calculated Energy) × 100</code><br>
      <code>% Fat Energy = (Fat × 9 / Calculated Energy) × 100</code><br>
      <code>% Carbohydrate Energy = (Carbohydrate × 4 / Calculated Energy) × 100</code><br>
      ➥ This shows the sources of energy: how much percentage of the total energy comes from protein, fat, and carbohydrates.
    </div>
  `;
}

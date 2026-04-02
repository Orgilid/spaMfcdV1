import { escapeHtml } from "../utils/escapeHtml.js";

// Хүнсний нэрээр хайх сонголтыг дүрслэх функц
// <input type="checkbox" name="foodcode" value="01_0106" />Barley flour, whole grain
// <input type="checkbox" name="foodcode" value="01_0105" />Barley flour, whole grain, pearled
function renderFoodGroup(group) {
  return `
    <li>
      <a href="#" class="toggle-sublist">
        ${escapeHtml(group.groupName)}
      </a>
      <ul class="sublist is-hidden">
        ${group.items
          .map(
            (item) => `
              <li>
                <label class="search-food-option">
                  <input
                    type="checkbox"
                    name="foodcode"
                    value="${escapeHtml(item.food_code)}"
                  >
                  <span>${escapeHtml(item.food_name)}</span>
                </label>
              </li>
            `,
          )
          .join("")}
      </ul>
    </li>
  `;
}

export function renderFoodGroupList(foodGroups) {
  return `
    <!-- 2.1.3. Жагсаалтаас сонгож хайх-->
    <aside class="box menu">
      <p class="label">Search by food groups:</p>
      <ul class="menu-list">
        ${foodGroups.map(renderFoodGroup).join("")}
      </ul>
    </aside>
  `;
}

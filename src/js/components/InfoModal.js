import { escapeHtml } from "../utils/escapeHtml.js";

// 3. Аймгийн мэдээлэл болон food list харуулах modal
export function renderInfoModal() {
  return `
    <div class="modal" id="infoModal">
      <div class="modal-background"></div>

      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title" id="modalTitle">Province</p>
          <button class="delete" aria-label="close"></button>
        </header>

        <section class="modal-card-body">
          <div id="modalContent">Information will appear here.</div>
        </section>

        <footer class="modal-card-foot is-flex is-justify-content-space-between">
          <div>
            <span id="selectedCount" class="tag is-warning is-light is-medium">0 selected</span>
          </div>

          <div class="buttons">
            <button class="button is-link is-small" id="clearFoodsBtn" type="button">
              Clear
            </button>

            <button class="button is-link is-small" id="selectAllFoodsBtn" type="button">
              Select all
            </button>

            <button class="button is-primary is-small" id="searchSelectedFoodsBtn" type="button">
              Search
            </button>

            <button class="button modal-close-btn is-dark is-small" type="button">
              Close
            </button>
          </div>
        </footer>
      </div>
    </div>
  `;
}

// Modal дотор food list-ийг checkbox хэлбэрээр гаргах
export function renderModalFoodList(foods) {
  return `
    <div class="content">
      ${foods
        .map((food) => {
          const safeFoodCode = escapeHtml(food.foodCode);
          const safeFoodName = escapeHtml(food.foodName);

          return `
            <label class="checkbox is-block mb-2">
              <input
                type="checkbox"
                class="overview-food-checkbox"
                value="${safeFoodCode}"
                data-foodname="${safeFoodName}"
              />
              ${safeFoodName}
            </label>
          `;
        })
        .join("")}
    </div>
  `;
}

// 3.1. Modal нээх
export function openModal({ title, content }) {
  const modal = document.getElementById("infoModal");
  const titleEl = document.getElementById("modalTitle");
  const contentEl = document.getElementById("modalContent");

  if (!modal || !titleEl || !contentEl) return;

  titleEl.textContent = title;
  contentEl.innerHTML = content;
  modal.classList.add("is-active");
  // count reset
  setTimeout(() => {
    updateSelectedCount();
  }, 0);
}

// 3.2. Modal хаах
export function closeModal() {
  const modal = document.getElementById("infoModal");
  if (modal) {
    modal.classList.remove("is-active");
  }
}

// 3.3. Modal-ийн event-үүдийг холбоно
export function bindModalEvents() {
  const modal = document.getElementById("infoModal");
  if (!modal) return;

  const bg = modal.querySelector(".modal-background");
  const deleteBtn = modal.querySelector(".delete");
  const closeBtn = modal.querySelector(".modal-close-btn");
  const selectAllBtn = modal.querySelector("#selectAllFoodsBtn");
  const searchSelectedBtn = modal.querySelector("#searchSelectedFoodsBtn");
  const clearBtn = modal.querySelector("#clearFoodsBtn");
  const countEl = modal.querySelector("#selectedCount");

  bg?.addEventListener("click", closeModal);
  deleteBtn?.addEventListener("click", closeModal);
  closeBtn?.addEventListener("click", closeModal);

  // checkbox өөрчлөгдөх үед count update
  modal.addEventListener("change", (e) => {
    if (!e.target.classList.contains("overview-food-checkbox")) return;

    updateSelectedCount();
  });

  // Clear all checkboxes
  clearBtn?.addEventListener("click", () => {
    document.querySelectorAll(".overview-food-checkbox").forEach((checkbox) => {
      checkbox.checked = false;
    });
    updateSelectedCount();
  });
  // Select all checkboxes
  selectAllBtn?.addEventListener("click", () => {
    document.querySelectorAll(".overview-food-checkbox").forEach((checkbox) => {
      checkbox.checked = true;
    });
    updateSelectedCount();
  });

  // Update selected count text
  function updateSelectedCount() {
    const count = document.querySelectorAll(".overview-food-checkbox:checked").length;

    const el = document.getElementById("selectedCount");
    if (el) {
      el.textContent = `${count} selected`;
    }
  }
  // Search selected foods
  searchSelectedBtn?.addEventListener("click", () => {
    const checkedFoods = Array.from(document.querySelectorAll(".overview-food-checkbox:checked")).map((input) => ({
      foodCode: input.value,
      foodName: input.dataset.foodname,
    }));

    if (!checkedFoods.length) {
      alert("Please select at least one food.");
      return;
    }

    sessionStorage.setItem("pendingSelectedFoods", JSON.stringify(checkedFoods));

    closeModal();
    window.location.hash = "#/search";
  });
}

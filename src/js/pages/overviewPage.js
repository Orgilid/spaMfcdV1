import { getNutritions } from "../services/nutritionService.js";
import { renderMap, bindMapEvents } from "../components/Map.js";
import { renderInfoModal, bindModalEvents } from "../components/InfoModal.js";
import { renderOverviewText } from "../components/OverviewText.js";

// 1. Танилцуулга, газрын зурагтай overview хуудсыг render хийх
export async function renderOverviewPage() {
  const app = document.getElementById("app");
  if (!app) return;

  try {
    // 1.1. Хүнсний найрлагын JSON өгөгдлийг авна.
    const nutritionData = await getNutritions();

    // 1.2. Overview хуудасны үндсэн бүтцийг зурна.
    app.innerHTML = `
      <div id="hero">
        <div class="container">
          <h1 class="is-size-4-mobile is-size-3-tablet is-size-2-desktop has-text-weight-semibold has-text-centered txt-h">
            Food Composition Database Introduction
          </h1>

          <div class="columns is-variable is-4">
            <!-- 1.2.1. Газрын зураг -->
            <div class="column is-12-mobile is-7-tablet is-8-desktop">
              ${renderMap()}
            </div>

            <!-- 1.2.2. Төслийн тайлбар -->
            <div class="column is-12-mobile is-5-tablet is-4-desktop content">
              ${renderOverviewText()}
            </div>
          </div>
        </div>
      </div>

      ${renderInfoModal()}
    `;

    // 1.3. Modal-ийн event-үүдийг холбоно.
    bindModalEvents();

    // 1.4. Газрын зургийг ачаалж, click event-үүдийг холбоно.
    await bindMapEvents(nutritionData);
  } catch (error) {
    console.error("Failed to render overview page:", error);

    app.innerHTML = `
      <div class="container">
        <p class="has-text-danger">
          Failed to load overview page.
        </p>
      </div>
    `;
  }
}

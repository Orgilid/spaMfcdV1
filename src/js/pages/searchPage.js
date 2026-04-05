import { getNutritions } from "../services/nutritionService.js"; // Хоолны шим тэжээлийн өгөгдлийг авна.
import { renderSearchFilters } from "../components/SearchFilters.js"; // Хайлт хийх хэсгийг HTML болгоно.
import { renderNutritionTables } from "../components/NutritionTables.js"; // Хайлтын үр дүнг хүснэгт хэлбэрээр HTML болгоно.
import { loadImages } from "../services/imageService.js";
import { renderImageModal, bindImageModalEvents } from "../components/ImageModal.js";

let nutritionData = [];

const DEFAULT_TYPES = ["proximates", "minerals", "vitamins"];
const DEFAULT_ITEM_COUNT = 4;

export async function renderSearchPage() {
  const app = document.getElementById("app");

  // Өгөгдөл ирэх хүртэл түр Loading data... гэж харуулна.
  app.innerHTML = `
    <section id="search" class="section is-fullheight">
      <div class="container">
        <h1 class="is-size-4-mobile is-size-3-tablet is-size-2-desktop has-text-weight-semibold has-text-centered txt-h">
          Food Composition Database
        </h1>

        <div class="box">
          <p>Loading data...</p>
        </div>
      </div>
    </section>
  `;

  try {
    nutritionData = await getNutritions(); // Хүнсний найрлагын JSON өгөгдүүдлийг авна.
    await loadImages(); // Зургийн JSON өгөгдлийг ачаална.
    const foodGroups = buildFoodGroups(nutritionData); // food_group бүрээр багцалсан food_code, food_name-үүдийг авна. Жишээ нь: "Cereals and Cereal products" → [{ food_code: "01_0106", food_name: "Barley flour, whole grain" }, ...]

    app.innerHTML = `
      <!-- 2. Өгөгдөл хайж харуулах хэсэг -->
      <div id="search">
        <div class="container">
          <h1 class="is-size-4-mobile is-size-3-tablet is-size-2-desktop has-text-weight-semibold has-text-centered txt-h">
            Food Composition Database
          </h1>

          <div class="columns is-variable is-4">
            <!-- 2.1. Хайх хэсэг -->
            <div class="column is-12-mobile is-4-tablet is-3-desktop">
              ${renderSearchFilters(foodGroups)}
            </div>

            <!-- 2.2. Үр дүнг харуулах хэсэг -->
            <div id="resultTbl" class="column is-12-mobile is-8-tablet is-9-desktop">
              ${renderDefaultTables(nutritionData)}
            </div>
          </div>
        </div>
      </div>
      ${renderImageModal()}
    `;

    bindSearchEvents(); // UI дээрх бүх event (click, change, keydown)-уудыг холбож өгдөг функц

    bindImageModalEvents();

    applyPendingSelectedFoodsFromOverview(); // Overview page-аас шилжихдээ хайх үгийг хадгалсан бол тэр үгээр хайх үйлдлийг автоматаар хийх функц
  } catch (error) {
    app.innerHTML = `
      <section class="section">
        <div class="container">
          <div class="notification is-danger">
            Failed to load nutrition data.
          </div>
        </div>
      </section>
    `;

    console.error("Failed to load nutrition data:", error);
  }
}

// food_group бүрээр багцалсан food_code, food_name авна. Жишээ нь: "Cereals and Cereal products" → [{ food_code: "01_0106", food_name: "Barley flour, whole grain" }, ...]
function buildFoodGroups(data) {
  const grouped = new Map(); // Map бол (key → value) хэлбэрээр өгөгдөл хадгалах бүтэц юм. grouped объект үүсгэв.

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

// UI дээрх бүх event (click, change, keydown)-уудыг холбож өгдөг функц
function bindSearchEvents() {
  const searchBtn = document.getElementById("searchBtn");
  const searchTxt = document.getElementById("searchTxt");
  const app = document.getElementById("app");

  // button дээр товшиж food_name-ээр хайна.
  searchBtn?.addEventListener("click", handleTextSearch);

  // Текст бичээд Enter товч дарж food_name-ээр хайна. button дээр товших хэрэггүй.
  searchTxt?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleTextSearch();
    }
  });

  app?.addEventListener("change", (event) => {
    const target = event.target;

    if (!(target instanceof HTMLElement)) return;

    // Хүнсний жагсаалтаас сонголт хийж food_code-оор хайна.
    if (target.matches('input[name="foodcode"]')) {
      handleFoodCodeSearch(); // food_code-оор хайх функц
      return;
    }

    // nutrition category-ээс сонголт хийж үр дүнг дахин гаргах event. Жишээ нь: proximates, minerals, vitamins гэх мэт.
    if (target.matches('input[name="nutrition"]')) {
      rerenderCurrentSelection();
    }
  });

  // Хүнсний бүлэг дээр дарж дэд жагсаалтыг харуулах event. Жишээ нь: "Cereals and Cereal products" бүлэг дээр дарж тухайн бүлгийн бүх хүнсийг харуулах.
  app?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const toggle = target.closest(".toggle-sublist");
    if (!toggle) return;

    event.preventDefault();
    const sublist = toggle.nextElementSibling;
    sublist?.classList.toggle("is-hidden");
  });
}

// Текст бичиж food_name-ээр хайх функц
function handleTextSearch() {
  clearCheckedFoodCodes(); // Хүнсний жагсаалтаас сонгож хайх checkbox-уудыг бүгдийг нь uncheck болгов.

  const keyword = getSearchKeyword(); // input-ээс хайх текстийг авна.

  // Хайх үг хоосон бол анхааруулах мессеж харуулна.
  if (!keyword) {
    setResultHtml(`
      <div class="notification is-warning">
        Please enter a food name.
      </div>
    `);
    return;
  }

  renderCurrentResults();
}

// Хүнсний жагсаалтаас сонгож food_code-оор хайх функц
function handleFoodCodeSearch() {
  const searchTxt = document.getElementById("searchTxt");
  if (searchTxt) {
    searchTxt.value = "";
  }

  const selectedCodes = getSelectedFoodCodes();

  if (!selectedCodes.length) {
    setResultHtml(renderDefaultTables(nutritionData));
    return;
  }

  renderCurrentResults();
}

function rerenderCurrentSelection() {
  renderCurrentResults();
}

// Хүнсний жагсаалтаас сонгосон checkbox-уудын food_code болон input-ээс авсан keyword хоёроор nutritionData-ыг шүүж харуулна. Хэрэв хоёулаа хоосон бол эхний 4 элементийг харуулна.
function renderCurrentResults() {
  const matched = getMatchedItems();
  const selectedTypes = getSelectedNutritionTypes();
  setResultHtml(renderNutritionTables(matched, selectedTypes));
}

// Хүнсний жагсаалтаас сонгосон checkbox-уудын food_code болон input-ээс авсан keyword хоёроор nutritionData-ыг шүүж харуулна. Хэрэв хоёулаа хоосон бол эхний 4 элементийг харуулна.
function getMatchedItems() {
  const selectedCodes = getSelectedFoodCodes();
  const keyword = getSearchKeyword();

  if (selectedCodes.length) {
    return nutritionData.filter((item) => selectedCodes.includes(item.food_code));
  }

  if (keyword) {
    return nutritionData.filter((item) => (item.food_name || "").toLowerCase().includes(keyword));
  }

  return nutritionData.slice(0, DEFAULT_ITEM_COUNT);
}

// Хайх үгийг авна. Хэрэв хоосон бол "" гэж авна.
function getSearchKeyword() {
  return document.getElementById("searchTxt")?.value.trim().toLowerCase() || "";
}

// Хүнсний жагсаалтаас сонгосон checkbox-уудын food_code утгуудыг массив хэлбэрээр авна. Жишээ нь: ["01_0106", "01_0107", ...]
function getSelectedFoodCodes() {
  return Array.from(document.querySelectorAll('input[name="foodcode"]:checked')).map((checkbox) => checkbox.value);
}

// nutrition category-ээс сонгосон бүх checkbox-уудын утгыг авна. Жишээ нь: proximates, minerals, vitamins гэх мэт.
function getSelectedNutritionTypes() {
  return Array.from(document.querySelectorAll('input[name="nutrition"]:checked')).map((checkbox) => checkbox.value);
}

// Хүнсний жагсаалтаас сонгож хайх checkbox-уудыг бүгдийг нь uncheck болгох функц.
function clearCheckedFoodCodes() {
  document.querySelectorAll('input[name="foodcode"]:checked').forEach((checkbox) => {
    checkbox.checked = false;
  });
}

// Үр дүн харуулах хэсэг рүү HTML-ийг гаргана.
function setResultHtml(html) {
  const resultTbl = document.getElementById("resultTbl");
  if (resultTbl) {
    resultTbl.innerHTML = html;
  }
}

// Эхний 4 элементийг харуулж байна. DEFAULT_ITEM_COUNT = 4. DEFAULT_TYPES = ["proximates", "minerals", "vitamins"] гэсэн nutrition category-үүдийг харуулж байна.
function renderDefaultTables(data) {
  const defaultItems = data.slice(0, DEFAULT_ITEM_COUNT);
  return renderNutritionTables(defaultItems, DEFAULT_TYPES);
}

// Overview page-аас шилжихдээ хайх үгийг хадгалсан бол тэр үгээр хайх үйлдлийг автоматаар хийх функц
function applyPendingSelectedFoodsFromOverview() {
  const raw = sessionStorage.getItem("pendingSelectedFoods");
  if (!raw) return;

  let selectedFoods = [];

  try {
    selectedFoods = JSON.parse(raw);
  } catch (error) {
    console.error("Invalid pendingSelectedFoods:", error);
    sessionStorage.removeItem("pendingSelectedFoods");
    return;
  }

  if (!Array.isArray(selectedFoods) || !selectedFoods.length) {
    sessionStorage.removeItem("pendingSelectedFoods");
    return;
  }

  const searchTxt = document.getElementById("searchTxt");
  const searchSection = document.getElementById("search");

  if (searchTxt) {
    searchTxt.value = "";
  }

  document.querySelectorAll('input[name="foodcode"]').forEach((checkbox) => {
    checkbox.checked = false;
  });

  selectedFoods.forEach((food) => {
    const checkbox = document.querySelector(`input[name="foodcode"][value="${food.foodCode}"]`);

    if (checkbox) {
      checkbox.checked = true;
    }
  });

  handleFoodCodeSearch();

  if (searchSection) {
    searchSection.scrollIntoView({ behavior: "smooth" });
  }

  sessionStorage.removeItem("pendingSelectedFoods");
}

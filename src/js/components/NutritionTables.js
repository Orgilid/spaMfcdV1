import { getImagesByFoodCode } from "../services/imageService.js";
// import { escapeHtml } from "../utils/escapeHtml.js";
// import { safeValue, titleFromKey } from "../utils/format.js";
function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

// null, undefined, хоосон утгыг "-" болгож харуулах, XSS хамгаалах функц.
function safeValue(value) {
  return escapeHtml(value ?? "-");
}

// JSON key → хүний уншихад ойлгомжтой title болгох функц. Жишээ нь: "proximates" → "Proximates", "collection_information" → "Collection Information" гэх мэт.
function titleFromKey(key) {
  return escapeHtml(
    String(key ?? "")
      .replaceAll("_", " ")
      .replace(/\b\w/g, (ch) => ch.toUpperCase()),
  );
}

// 2.2. Хайлтын үр дүнгийн хүснэгтийг харуулах хэсэг
// items = хайгаад олсон хүнсний найрлагын json өгөгдөл
// selectedTypes = ["proximates", "minerals", "vitamins" ...]
export function renderNutritionTables(items, selectedTypes) {
  // Хайлтаар өгөгдөл олдоогүй бол мэдэгдэл харуулна.
  if (!items.length) {
    return `
      <div class="notification is-warning">
        No match found.
      </div>
    `;
  }
  // Хайлтаар олдсон хүнсний найрлагын төрөл сонгогдоогүй бол анхааруулах мессеж харуулна.
  if (!selectedTypes.length) {
    return `
      <div class="notification is-warning">
        Please select at least one nutrition category.
      </div>
    `;
  }

  return selectedTypes.map((type) => renderTableByType(type, items)).join("");
}

// Хайлтаар олдсон хүнсний найрлагын төрөл бүрийн data-ыг хүснэгт хэлбэрээр харуулах функц. Жишээ нь: proximates, minerals, vitamins гэх мэт category-үүдийн data-уудыг тус бүр хүснэгтээр харуулна. Харин description category-ийн data-уудыг өөр хүснэгтээр харуулна.
function renderTableByType(type, items) {
  if (type === "description") {
    return `
      <div class="table-container box tbl">
        <h2 class="subtitle is-5 has-text-weight-bold has-text-centered">
          Description
        </h2>
        <table class="table is-striped is-bordered is-hoverable is-fullwidth">
          <thead>
            <tr>
              <th>Food name</th>
              <th>Food group</th>
              <th>Scientific name</th>
              <th>Native name</th>
              <th>Province</th>
            </tr>
          </thead>
          <tbody>
            ${items
              .map(
                (item) => `
                  <tr>
                    <td>${safeValue(item.food_name)}</td>
                    <td>${safeValue(item.food_group)}</td>
                    <td>${safeValue(item.scientific_name)}</td>
                    <td>${safeValue(item.native_name)}</td>
                    <td>${safeValue(item.province)}</td>
                  </tr>
                `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
      <br>
    `;
  }

  // images сонгосон бол зураг харуулах хүснэгтийн дүрслэх хэсэг. Жишээ нь Food name:"Barley flour, whole grain", Number of Images: "4"
  if (type === "images") {
    return `
    <div class="table-container box tbl">
      <h2 class="subtitle is-5 has-text-weight-bold has-text-centered">
        Images
      </h2>
      <table class="table is-striped is-bordered is-hoverable is-fullwidth">
        <thead>
          <tr>
            <th>Food name</th>
            <th>Number of Images</th>
          </tr>
        </thead>
        <tbody>
          ${items
            .map((item) => {
              const images = getImagesByFoodCode(item.food_code);
              const count = images.length;

              return `
                <tr>
                  <td>${safeValue(item.food_name)}</td>
                  <td>
                    ${
                      count > 0
                        ? `
                          <span
                            class="tag is-primary image-count-tag open-image-btn"
                            data-foodcode="${escapeHtml(item.food_code)}"
                            data-foodname="${escapeHtml(item.food_name)}"
                          >
                            ${count}
                          </span>
                        `
                        : "-"
                    }
                  </td>
                </tr>
              `;
            })
            .join("")}
        </tbody>
      </table>
    </div>
    <br>
  `;
  }

  const columns = Array.from(
    new Set(
      items.flatMap((item) => {
        const data = item?.[type];
        return data && typeof data === "object" && !Array.isArray(data)
          ? Object.keys(data)
          : [];
      }),
    ),
  );

  if (!columns.length) {
    return `
      <div class="table-container box tbl">
        <h2 class="subtitle is-5 has-text-weight-bold has-text-centered">
          ${titleFromKey(type)}
        </h2>
        <div class="notification is-warning">
          No data available.
        </div>
      </div>
      <br>
    `;
  }

  return `
    <div class="table-container box tbl">
      <h2 class="subtitle is-5 has-text-weight-bold has-text-centered">
        ${titleFromKey(type)}
      </h2>
      <table class="table is-striped is-bordered is-hoverable is-fullwidth">
        <thead>
          <tr>
            <th>Food name</th>
            ${columns.map((col) => `<th>${safeValue(col)}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${items
            .map((item) => {
              const data =
                item?.[type] && typeof item[type] === "object"
                  ? item[type]
                  : {};

              return `
                <tr>
                  <td>${safeValue(item.food_name)}</td>
                  ${columns.map((col) => `<td>${safeValue(data[col])}</td>`).join("")}
                </tr>
              `;
            })
            .join("")}
        </tbody>
      </table>
    </div>
    <br>
  `;
}

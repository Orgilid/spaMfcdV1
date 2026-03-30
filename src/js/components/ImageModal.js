import { getImagesByFoodCode } from "../services/imageService.js";

let slideshowImages = [];
let currentIndex = 0;

export function renderImageModal() {
  return `
    <div id="imageModal" class="modal">
      <div class="modal-background" id="modalBg"></div>

      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title" id="modalImgTitle"></p>
          <button
            class="delete"
            aria-label="close"
            id="closeImgModalBtn"
            type="button"
          ></button>
        </header>

        <section class="modal-card-body has-text-centered">
          <img
            id="slideshowImage"
            src=""
            style="max-width: 100%; height: auto"
          />
          <div class="buttons is-centered mt-3">
            <button
              class="button is-small is-primary"
              id="prevImageBtn"
              type="button"
            >
              ←
            </button>
            <button
              class="button is-small is-primary"
              id="nextImageBtn"
              type="button"
            >
              →
            </button>
          </div>
        </section>
      </div>
    </div>
  `;
}

export function bindImageModalEvents() {
  document.getElementById("modalBg")?.addEventListener("click", closeImgModal);
  document
    .getElementById("closeImgModalBtn")
    ?.addEventListener("click", closeImgModal);
  document.getElementById("prevImageBtn")?.addEventListener("click", prevImage);
  document.getElementById("nextImageBtn")?.addEventListener("click", nextImage);

  document.addEventListener("click", (event) => {
    const btn = event.target.closest(".open-image-btn");
    if (!btn) return;

    const foodCode = btn.dataset.foodcode;
    const foodName = btn.dataset.foodname;
    showImages(foodCode, foodName);
  });
}

function showImages(foodCode, foodName) {
  slideshowImages = getImagesByFoodCode(foodCode);

  if (!slideshowImages.length) {
    alert("No images found for " + foodName);
    return;
  }

  currentIndex = 0;
  document.getElementById("slideshowImage").src = slideshowImages[currentIndex];
  document.getElementById("modalImgTitle").textContent = foodName;
  document.getElementById("imageModal").classList.add("is-active");
}

function nextImage() {
  if (!slideshowImages.length) return;

  currentIndex = (currentIndex + 1) % slideshowImages.length;
  document.getElementById("slideshowImage").src = slideshowImages[currentIndex];
}

function prevImage() {
  if (!slideshowImages.length) return;

  currentIndex =
    (currentIndex - 1 + slideshowImages.length) % slideshowImages.length;
  document.getElementById("slideshowImage").src = slideshowImages[currentIndex];
}

function closeImgModal() {
  document.getElementById("imageModal").classList.remove("is-active");
}

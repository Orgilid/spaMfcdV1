import { getImagesByFoodCode } from "../services/imageService.js";

let slideshowImages = [];
let currentIndex = 0;
let imageModalEventsBound = false;

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
            alt=""
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
  if (imageModalEventsBound) return;
  imageModalEventsBound = true;

  document.addEventListener("click", (event) => {
    const openBtn = event.target.closest(".open-image-btn");
    if (openBtn) {
      const foodCode = openBtn.dataset.foodcode;
      const foodName = openBtn.dataset.foodname;
      showImages(foodCode, foodName);
      return;
    }

    const closeBtn = event.target.closest("#closeImgModalBtn");
    if (closeBtn) {
      closeImgModal();
      return;
    }

    const modalBg = event.target.closest("#modalBg");
    if (modalBg) {
      closeImgModal();
      return;
    }

    const prevBtn = event.target.closest("#prevImageBtn");
    if (prevBtn) {
      prevImage();
      return;
    }

    const nextBtn = event.target.closest("#nextImageBtn");
    if (nextBtn) {
      nextImage();
    }
  });
}

function showImages(foodCode, foodName) {
  slideshowImages = getImagesByFoodCode(foodCode);

  if (!slideshowImages.length) {
    alert("No images found for " + foodName);
    return;
  }

  currentIndex = 0;

  const imageEl = document.getElementById("slideshowImage");
  const titleEl = document.getElementById("modalImgTitle");
  const modalEl = document.getElementById("imageModal");

  if (!imageEl || !titleEl || !modalEl) return;

  imageEl.src = slideshowImages[currentIndex];
  imageEl.alt = foodName;
  titleEl.textContent = foodName;
  modalEl.classList.add("is-active");
}

function nextImage() {
  if (!slideshowImages.length) return;

  currentIndex = (currentIndex + 1) % slideshowImages.length;

  const imageEl = document.getElementById("slideshowImage");
  if (imageEl) {
    imageEl.src = slideshowImages[currentIndex];
  }
}

function prevImage() {
  if (!slideshowImages.length) return;

  currentIndex = (currentIndex - 1 + slideshowImages.length) % slideshowImages.length;

  const imageEl = document.getElementById("slideshowImage");
  if (imageEl) {
    imageEl.src = slideshowImages[currentIndex];
  }
}

function closeImgModal() {
  const modalEl = document.getElementById("imageModal");
  if (modalEl) {
    modalEl.classList.remove("is-active");
  }
}

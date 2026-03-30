export function renderNotFoundPage() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="box">
      <h2 class="title is-4">404</h2>
      <p>Page not found.</p>
    </div>
  `;
}

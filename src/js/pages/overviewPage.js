export function renderOverviewPage() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="box">
      <h2 class="title is-4">Overview</h2>
      <p>Welcome to the overview page.</p>
    </div>
  `;
}

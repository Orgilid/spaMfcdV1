export function renderBooksPage() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="box">
      <h2 class="title is-4">Books</h2>
      <p>This is the books page.</p>
    </div>
  `;
}

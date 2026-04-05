export function renderNavbar() {
  return `
    <header class="is-sticky navbar-shadow">
      <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="container">
          <div class="navbar-brand">
            <a href="#/overview" class="navbar-item logo-item has-text-weight-bold is-uppercase">
              <figure class="image">
                <img src="./img/icon/icon.png" alt="logo" />
              </figure>
              <p><span>Mongolian</span> Food Composition Database</p>
            </a>

            <a
              class="navbar-burger"
              role="button"
              aria-expanded="false"
              data-target="navbarMenu"
            >
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </a>
          </div>

          <div class="navbar-menu has-text-weight-semibold has-text-centered" id="navbarMenu">
            <div class="navbar-start navbar-main-menu">
              <a href="#/overview" class="navbar-item">
                <span class="icon has-text-warning">
                  <i class="fas fa-circle-question"></i>
                </span>
                <span>Overview</span>
              </a>
                <a href="#/search" class="navbar-item">
                  <span class="icon has-text-primary">
                    <i class="fas fa-search"></i>
                  </span>
                  <span>Search</span>
                </a>
                <a href="#/calculation" class="navbar-item">
                  <span class="icon has-text-link">
                    <i class="fas fa-calculator"></i>
                  </span>
                  <span>Food Calculator</span>
                </a>
                <a href="#/books" class="navbar-item">
                  <span class="icon has-text-info">
                    <i class="fas fa-book"></i>
                  </span>
                  <span>Books</span>
                </a>

                <a href="#/contact" class="navbar-item">
                  <span class="icon has-text-danger">
                    <i class="fas fa-address-card"></i>
                  </span>
                  <span>Contact us</span>
                </a>
            </div>

            <div class="navbar-end">
              <a href="#" class="navbar-item">MN</a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  `;
}

export function initNavbar() {
  const burger = document.querySelector(".navbar-burger");
  const menu = document.getElementById("navbarMenu");

  if (!burger || !menu) return;

  burger.addEventListener("click", () => {
    burger.classList.toggle("is-active");
    menu.classList.toggle("is-active");

    const isExpanded = burger.classList.contains("is-active");
    burger.setAttribute("aria-expanded", String(isExpanded));
  });
}

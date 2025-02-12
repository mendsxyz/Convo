// Main

const main = document.querySelector("main");

// Nav toggle

const nav = document.querySelector("nav.auto");
const nav_toggle = document.querySelector(".nav-toggle");
const cta_btn = document.querySelector("#ctaBtn");

if (!nav || !nav_toggle || !cta_btn) {
  console.error("One or more elements not found in the DOM.");
} else {
  nav_toggle.addEventListener("click", () => {
    nav.classList.toggle("active");
    if (nav.classList.contains("active")) {
      main.addEventListener("click", menuOpenOk_touchBg);
    }
  });

  cta_btn.addEventListener("click", () => {
    nav.classList.toggle("active");
    main.addEventListener("click", (e) => {
      if (main.contains(e.target)) {
        main.addEventListener("click", menuOpenOk_touchBg);
      }
    });
  });

  function menuOpenOk_touchBg(e) {
    if (main.contains(e.target)) {
      nav.classList.remove("active");
      main.removeEventListener("click", menuOpenOk_touchBg);
    }
  }
}

// UI actions

const UI = {
  nav_links: document.querySelectorAll(".nav-link"),
  nl_collapsibles: document.querySelectorAll(".nl-collapsible")
}

UI.nav_links.forEach(link => {
  link.addEventListener("click", () => {
    UI.nl_collapsibles.forEach(cls => {
      if (cls.classList.contains(link.dataset.expand)) {
        cls.classList.toggle("active");
      }
    });
  });
});

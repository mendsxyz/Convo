// Main
const main = document.querySelector("main");

// Nav toggle
const bottomBar = document.querySelector("nav.bottombar.xs-sm-md");
const bb_toggle = document.querySelector(".bottombar-toggle");
const cta_btn = document.querySelector("#ctaBtn");

if (!bottomBar || !bb_toggle || !cta_btn) {
  console.error("One or more elements not found in the DOM.");
} else {
  bb_toggle.addEventListener("click", () => {
    bottomBar.classList.toggle("active");
    if (bottomBar.classList.contains("active")) {
      main.addEventListener("click", menuOpenOk_touchBg);
    }
  });

  cta_btn.addEventListener("click", () => {
    bottomBar.classList.toggle("active");
    main.addEventListener("click", (e) => {
      if (main.contains(e.target)) {
        main.addEventListener("click", menuOpenOk_touchBg);
      }
    });
  });

  function menuOpenOk_touchBg(e) {
    if (main.contains(e.target)) {
      bottomBar.classList.remove("active");
      main.removeEventListener("click", menuOpenOk_touchBg);
    }
  }
}

// UI actions

const UI = {
  settingsBtn: document.querySelectorAll(".settingsBtn"),
  accountBtn: document.querySelectorAll(".accountBtn"),
  helpBtn: document.querySelectorAll(".helpBtn"),
  signOutBtn: document.querySelectorAll(".signOutBtn")
}

UI.settingsBtn.forEach(btn => {
  btn.addEventListener("click", () => {
    alert("200")
  });
});

UI.signOutBtn.forEach(btn => {
  btn.addEventListener("click", signOut);
});
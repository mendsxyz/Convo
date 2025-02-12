document.addEventListener("DOMContentLoaded", () => {
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
    animation_wrapper: document.querySelector("#loader .animation-wrapper"),
    refresh: document.querySelector("#loader .refresh"),
    nav_links: document.querySelectorAll(".nav-link"),
    nl_collapsibles: document.querySelectorAll(".nl-collapsible")
  }

  // UI action load time and page refresh animation

  let refreshDone;
  refreshDone = setTimeout(() => {
    UI.refresh.textContent = "check_circle";
    UI.refresh.classList.remove("rotate");
    UI.refresh.classList.add("popup");
    
    // Display message
    
    let message = `
      <span class="action-message title">action_message_title</span>
      <span class="action-message body-content">action_message_body_content</span>
    `;
    
    UI.animation_wrapper.insertAdjacentHTML("beforeend", message);
    
    clearTimeout(refreshDone);
  }, 4000);

  // X and collapsible nav menu links

  UI.nav_links.forEach(link => {
    link.addEventListener("click", () => {
      UI.nl_collapsibles.forEach(cls => {
        if (cls.classList.contains(link.dataset.expand)) {
          cls.classList.toggle("active");
        }
      });
    });
  });
});
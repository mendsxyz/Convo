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
    loader: document.querySelector("#loader"),
    animation_wrapper: document.querySelector("#loader .animation-wrapper"),
    refresh: document.querySelector("#loader .refresh"),
    header_auth_state: document.querySelector("#userName"),
    authform_wrapper: document.querySelector(".authForm-wrapper"),
    nav_links: document.querySelectorAll(".nav-link"),
    nl_collapsibles: document.querySelectorAll(".nl-collapsible"),
    current_username: document.querySelector(".current-userName"),
    hero: document.querySelector(".hero"),
    auth_content: document.querySelector(".auth-content")
  }

  // UI action load time and page refresh animation

  UI.loader.classList.add("active");
  UI.refresh.classList.add("rotate");

  window.addEventListener("load", () => {

    // Stop loader after full page load

    setTimeout(() => {
      UI.loader.classList.remove("active");
    }, 5000);

    // Handle refresh icon transition

    setTimeout(() => {
      UI.refresh.textContent = "check_circle";
      UI.refresh.classList.remove("rotate");
      UI.refresh.classList.add("popup");
    }, 2000);
  });

  // Collapsible nav menu links

  UI.nav_links.forEach(link => {
    link.addEventListener("click", () => {
      UI.nl_collapsibles.forEach(cls => {
        if (cls.classList.contains(link.dataset.expand)) {
          cls.classList.toggle("active");
        }
      });
    });
  });

  // Check auth
  const states = JSON.parse(localStorage.getItem("states")) || [];

  const activeSession = states.find(state => state.state === "signedin" || state.state === "signedup");
  let loadEnd;

  if (activeSession) {
    // UI changes
    UI.header_auth_state.textContent = activeSession.email.replace(/@.*/, "");
    UI.nav_links.forEach(link => {
      if (link.classList.contains("signOutBtn")) {
        link.addEventListener("click", () => {
          localStorage.removeItem("states");

          // loader

          window.addEventListener("load", () => {

            // Stop loader after full page load

            setTimeout(() => {
              UI.loader.classList.remove("active");
            }, 5000);

            // Handle refresh icon transition

            setTimeout(() => {
              UI.refresh.textContent = "check_circle";
              UI.refresh.classList.remove("rotate");
              UI.refresh.classList.add("popup");
            }, 2500);
          });
        });
      }
    });
    UI.hero.style.display = "none";
    UI.auth_content.classList.add("active");
    UI.authform_wrapper.classList.remove("active");
    UI.current_username.textContent = activeSession.email;
  }
});

// Reset password nav

const resetPasswordForm = document.querySelector(".resetPasswordForm-wrapper");
const forgotPassword = document.querySelector(".forgot-password");
forgotPassword.addEventListener("click", () => {
  resetPasswordForm.classList.add("active");
});

const backToSignin = document.querySelector(".back-to-signin");
backToSignin.addEventListener("click", () => {
  resetPasswordForm.classList.remove("active");
});
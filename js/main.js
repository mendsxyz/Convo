// Import fn

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { getDatabase, ref, set, push, onValue, update, remove } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

// Config

const firebaseConfig = {
  apiKey: "AIzaSyDKJMIf4G_oFG5fRa_bjrZbTRdbXoPG8Kk",
  authDomain: "web-auth-e9d5a.firebaseapp.com",
  databaseURL: "https://web-auth-e9d5a-default-rtdb.firebaseio.com",
  projectId: "web-auth-e9d5a",
  storageBucket: "web-auth-e9d5a.firebasestorage.app",
  messagingSenderId: "231194816624",
  appId: "1:231194816624:web:0a3db5c0b927d89f6dc4b5",
  measurementId: "G-FE8WF5H6XV"
};

const auth = getAuth();
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

document.addEventListener("DOMContentLoaded", () => {

  // Allowed email (replace with your admin email)

  const allowedEmail = "princemendie03@gmail.com";

  // Function to protect routes

  function protectRoute() {
    onAuthStateChanged(auth, (user) => {
      if (user && user.email === allowedEmail) {
        console.log("Access granted to /posts");
      } else {
        // Redirect unauthorized users
        window.location.href = "/404.html";
      }
    });
  }

  // Call this function only on /post page

  if (window.location.pathname.includes("post.html")) {
    protectRoute();
  }

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

  if (UI.loader && UI.refresh) {
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
  }

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

  if (activeSession) {
    // UI changes

    UI.header_auth_state.textContent = activeSession.email.replace(/@.*/, "");
    UI.nav_links.forEach(link => {
      if (link.classList.contains("signOutBtn")) {
        link.addEventListener("click", () => {
          localStorage.removeItem("states");

          UI.loader.classList.add("active");
          if (!UI.refresh.classList.contains("rotate")) {
            UI.refresh.classList.add("rotate");
            // .. alert("no rotate")
          }

          UI.refresh.textContent = "refresh";

          setTimeout(() => {
            UI.loader.classList.remove("active");
          }, 5000);

          setTimeout(() => {
            UI.refresh.textContent = "check_circle";
            UI.refresh.classList.remove("rotate");
            UI.refresh.classList.add("popup");
          }, 2500);

          // Delay page refresh
          setTimeout(() => {
            location.reload();
          }, 6000);
        });
      }
    });
    UI.hero.style.display = "none";
    UI.auth_content.classList.add("active");
    UI.authform_wrapper.classList.remove("active");
    UI.current_username.textContent = activeSession.email;
  }

  // Retrieve saved posts and display on posts-wrapper

  const postsWrapper = document.querySelector(".posts-wrapper");

  function getPosts() {
    if (!postsWrapper) {
      console.error("Error: .posts-wrapper element not found!");
      alert("Error: Posts container missing!");
      return;
    }

    const postsRef = ref(db, "posts");

    onValue(postsRef, (snapshot) => {
      if (!snapshot.exists()) {
        console.warn("No posts found in the database.");
        postsWrapper.innerHTML = "<h3>No posts available.</h3>";
        alert("No posts available.");
        return;
      }

      postsWrapper.innerHTML = ""; // Clear before updating

      snapshot.forEach((childSnapshot) => {
        const post = childSnapshot.val();
        const postId = childSnapshot.key;

        postsWrapper.innerHTML += `
        <div id="post-${postId}">
          <div>${post.body}</div>
          ${post.imgUrl ? `<img src="${post.imgUrl}" width="200">` : ""}
          <span>Views: ${post.views}, Likes: ${post.counts}</span>
          <button onclick="updatePost('${postId}', '${post.body}', '${post.imgUrl}')">Edit</button>
          <button onclick="deletePost('${postId}')">Delete</button>
        </div>
      `;
      });

      alert("Posts loaded successfully!");
    }, (error) => {
      console.error("Error fetching posts:", error);
      alert("Error fetching posts: " + error.message);
    });
  }

  getPosts();
});

// Reset password nav

const resetPasswordForm = document.querySelector(".resetPasswordForm-wrapper");
const forgotPassword = document.querySelector(".forgot-password");
if (forgotPassword) {
  forgotPassword.addEventListener("click", () => {
    resetPasswordForm.classList.add("active");
  });
}

const backToSignin = document.querySelector(".back-to-signin");
if (backToSignin) {
  backToSignin.addEventListener("click", () => {
    resetPasswordForm.classList.remove("active");
  });
}
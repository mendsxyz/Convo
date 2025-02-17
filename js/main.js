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

    if (UI.header_auth_state) UI.header_auth_state.textContent = activeSession.email.replace(/@.*/, "");
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

          setTimeout(() => {
            location.reload();
          }, 5000);
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
        console.warn("No posts available yet.");
        postsWrapper.innerHTML = `<h3 style="text-align: center; margin-top: 4rem;">No posts available yet.</h3>`;
        return;
      }

      postsWrapper.innerHTML = ""; // Clear before updating
      const storedData = JSON.parse(localStorage.getItem("postId")) || [];
      console.log(storedData);

      snapshot.forEach((childSnapshot) => {
        const post = childSnapshot.val();
        const postId = childSnapshot.key;

        let MAX_BODY = 220;

        postsWrapper.innerHTML += `
          <div class="post" id="post-${postId}">
            <div class="post-col-1">
              <img src="" alt="author-pfp">
            </div>
            
            <div class="post-col-2">
              <div class="author">
                <span class="author-name">${post.author_name ? post.author_name : "retrieving_author..."}</span>
                <span>•</span>
                <span class="time-posted" data-id="${postId}" data-timestamp="${post.time_posted || Date.now()}">${formatTime(post.time_posted)}</span>
              </div>
              
              <div class="post-body" data-id="post-${postId}">
                ${post.body}
              </div>
              
              ${post.imgUrl ? `<img class="post-img" src="${post.imgUrl}" width="200">` : ""}
              
              <div class="post-analytics">
              <div class="pa convo">
                <span>${post.convo}</span>
                <span class="ms-rounded">quickreply</span>
              </div>  
              
              <div class="pa counts">
                <span>${post.counts}</span>
                <span class="ms-rounded">bolt</span>
              </div>
              
              <div class="pa saves">
                <span>${post.saves}</span>
                <span class="ms-rounded">bookmark</span>
              </div>
              
              <div class="pa shares">
                <span>${post.shares}</span>
                <span class="ms-rounded">share</span>
              </div>
              
              <div class="pa views">
                <span>${post.views}</span>
                <span class="ms-rounded">bar_chart</span>
              </div>
              
              <span class="update-post ms-rounded" style="display: ${post.user_email === activeSession.email ? "flex" : "none"};" id="${postId}">edit</span>
              <span class="delete-post ms-rounded" style="display: ${post.user_email === activeSession.email ? "flex" : "none"};" id="${postId}">delete</span>
            </div>
            </div>
          </div>
        `;

        const posts = document.querySelectorAll(".post");
        const postBodies = document.querySelectorAll(".post .post-body");

        if (postBodies) {
          postBodies.forEach(postBody => {
            postBody.addEventListener("click", () => {
              postBody.classList.toggle("expand");
            });
          });
        }

        if (posts) {
          posts.forEach(post0 => {
            const update0 = post0.querySelector(".post-analytics .update-post");
            const delete0 = post0.querySelector(".post-analytics .delete-post");

            update0.addEventListener("click", () => {
              if (activeSession.email === allowedEmail) {
                console.log("Access granted to /posts");

                const body0 = {
                  id: postId,
                  body: post.body
                }

                storedData.push(body0);
                localStorage.setItem("postId", JSON.stringify(storedData));
                window.location.href = "/post.html";
                
                if (localStorage.getItem("postId")) document.querySelector(".post-status").textContent = "Edit post";
              } else {
                window.location.href = "/404.html";
              }
            });

            delete0.addEventListener("click", () => {
              if (confirm("Are you sure you want to delete this post?")) {
                const deleteRef = ref(db, "posts/" + postId);
                remove(deleteRef);
              }
            });
          });
        }
      });

      console.log("Posts loaded successfully!");
    }, (error) => {
      console.error("Error fetching posts:", error);
    });
  }

  getPosts();

  function formatTime(timestamp) {
    if (!timestamp || isNaN(timestamp) || timestamp < 10000000000) {
      return "Just now"; // Handles bad timestamps like 0 or null
    }

    const now = Date.now();
    const seconds = Math.floor((now - timestamp) / 1000);

    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days <= 6) return `${days}d ago`;

    return new Date(timestamp).toLocaleDateString("en-GB"); // dd/mm/yyyy
  }

  function updatePostTimes() {
    document.querySelectorAll(".post .time-posted").forEach(timeEl => {
      const postId = timeEl.dataset.id;
      const timestamp = parseInt(timeEl.dataset.timestamp);

      if (timestamp) {
        timeEl.innerText = formatTime(timestamp);
      }
    });
  }

  // Run every second to update times in real-time
  setInterval(updatePostTimes, 1000);
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
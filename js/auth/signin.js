// Import fn

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

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

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const auth = getAuth();

let refreshPage;

const authSignupForm = document.querySelector("#authForm");
authSignupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const UI = {
    loader: document.querySelector("#loader"),
    header_auth_state: document.querySelector("#userName"),
    nav_links: document.querySelectorAll(".nav-link"),
    nl_collapsibles: document.querySelectorAll(".nl-collapsible"),
    current_username: document.querySelector(".current-userName"),
    animation_wrapper: document.querySelector("#loader .animation-wrapper"),
    nav: document.querySelector("nav.auto"),
    hero: document.querySelector(".hero"),
    authform_wrapper: document.querySelector(".authForm-wrapper"),
    auth_content: document.querySelector(".auth-content")
  }
  const userEmail = document.querySelector("#userEmail").value;
  const userPassword = document.querySelector("#userPassword").value;
  
  signInWithEmailAndPassword(auth, userEmail, userPassword)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;

      // Success loader
      let signinSuccess;
      document.querySelector("#loader").classList.add("active");

      // Display message
      let message = `
        <span class="action-message title"></span>
        <span class="action-message body-content" hidden></span>
      `;
      UI.animation_wrapper.insertAdjacentHTML("beforeend", message);

      document.querySelector(".action-message.title").textContent = "Signed in successfully!";
      document.querySelector(".action-message.body-content").textContent = "";

      signinSuccess = setTimeout(() => {
        document.querySelector("#loader").classList.remove("active");
        clearTimeout(signinSuccess);
      }, 5000);

      // Modal

      // UI changes
      UI.header_auth_state.textContent = userEmail.replace(/@.*/, "");
      UI.nav.classList.remove("active");
      UI.hero.style.display = "none";
      UI.authform_wrapper.classList.remove("active");

      let states = JSON.parse(localStorage.getItem("states")) || [];

      try {
        const newState = {
          email: userEmail.trim(),
          state: "signedin"
        };

        states.push(newState);

        localStorage.setItem("states", JSON.stringify(states));
      } catch (error) {
        console.error("Error saving state:", error);
      }
      
      refreshPage = setTimeout(() => {
        location.reload();
        clearTimeout(refreshPage);
      }, 2000);
      
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

if (window.location.pathname === "/post.html") {
  protectRoute();
}
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
});
// Import fn

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

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

const authSignupForm = document.querySelector("#authForm");
authSignupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const UI = {
    animation_wrapper: document.querySelector("#loader .animation-wrapper")
  }
  const userEmail = document.querySelector("#userEmail").value;
  const userPassword = document.querySelector("#userPassword").value;

  createUserWithEmailAndPassword(auth, userEmail, userPassword)
    .then((userCredential) => {
      // Signed up
      const user = userCredential.user;

      // Success loader
      let signupSuccess;
      document.querySelector("#loader").classList.add("active");

      // Display message
      let message = `
        <span class="action-message title"></span>
        <span class="action-message body-content"></span>
      `;
      UI.animation_wrapper.insertAdjacentHTML("beforeend", message);

      document.querySelector(".action-message.title").textContent = "Signed Up Successfully!";
      document.querySelector(".action-message.body-content").textContent = "";

      signupSuccess = setTimeout(() => {
        document.querySelector("#loader").classList.remove("active");
        clearTimeout(signupSuccess);
      }, 6000);
      
      // Modal
      // Show content, nav-links and other user info
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
    });
});
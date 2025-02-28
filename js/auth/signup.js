// Import fn

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signOut } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

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
const db = getDatabase();

const authSignupForm = document.querySelector("#authForm");
authSignupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const UI = {
    nav: document.querySelector("nav.auto"),
    hero: document.querySelector(".hero"),
    authform_wrapper: document.querySelector(".authForm-wrapper")
  }

  const userEmail = document.querySelector("#userEmail").value;
  const userPassword = document.querySelector("#userPassword").value;

  createUserWithEmailAndPassword(auth, userEmail, userPassword)
    .then((userCredential) => {

      // Signed up

      const user = userCredential.user;

      // Send verification email

      sendEmailVerification(user)
        .then(() => {
          alert("Verification email sent! Please check your inbox.");

          // Sign out the user immediately after signup to prevent access

          signOut(auth).then(() => {
            console.log("awaiting email verification.");
            window.location.href = "/await-verification.html";
          });
        }).catch((error) => {
          console.error("Error sending verification email:", error);
        });

      // Set user session
      
      localStorage.setItem("userKey", "key");
      
      UI.nav.classList.remove("active");
      UI.hero.style.display = "none";
      UI.authform_wrapper.classList.remove("active");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
});
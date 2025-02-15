// Import fn

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

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

// Reset email password

const states = JSON.parse(localStorage.getItem("states")) || [];

const resetPasswordForm = document.querySelector("#resetPasswordForm");
resetPasswordForm.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const emailId = document.querySelector("#resetUserEmail");
  const saved = states.find(state => state.email === emailId.value);

  if (saved) {
    sendPasswordResetEmail(auth, saved.email)
    .then(() => {
      // Password reset email sent!
      alert("Password reset email sent successfully!");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
    });
  } else {
    alert("Email doesn't exist in our records!");
  }
});
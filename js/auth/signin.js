// Import fn

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

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

authSignupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userEmail = document.querySelector("#userEmail").value;
  const userPassword = document.querySelector("#userPassword").value;

  console.log("Attempting sign-in:", userEmail); // Debugging

  try {
    const userCredential = await signInWithEmailAndPassword(auth, userEmail, userPassword);
    const user = userCredential.user;

    console.log("Sign-in successful:", user);

    document.querySelector("#loader")?.classList.add("active");

    setTimeout(() => {
      document.querySelector("#loader .refresh").textContent = "check_circle";
      document.querySelector("#loader .refresh").classList.remove("rotate");
      document.querySelector("#loader .refresh").classList.add("popup");
    }, 3000);

    // Start user session
    
    const states = JSON.parse(localStorage.getItem("states")) || [];
    const userState = states.find(state => state.state === "signedin" || state.state === "signedup" || state.state === "signedout");
    
    if (userState) userState.state = "signedin";
    
    localStorage.setItem("states", JSON.stringify(states));
    localStorage.setItem("sessionCache", "active");
    
    const safeEmail = userEmail.replace(/\./g, "_");

    // Fetch user tier from Firebase

    const snapshot = await get(ref(db, "users/" + safeEmail));

    let userTier = "T1";

    if (snapshot.exists()) {
      userTier = snapshot.val().tier || "T1";
    }
    
    setTimeout(() => {
      document.querySelector("#loader")?.classList.remove("active");
    }, 5000);
    
    setTimeout(() => {
      location.reload();
    }, 5000);
  }
  catch (error) {
    console.error("Sign-in error:", error);
  }
});
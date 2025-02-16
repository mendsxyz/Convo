// Posts db

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getDatabase, ref, set, push, onValue, update, remove } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

// Firebase configuration

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
const db = getDatabase(app);

// Format post

document.addEventListener("DOMContentLoaded", () => {
  const bodyEditor = document.querySelector(".body-editor");

  document.querySelector(".bold").addEventListener("click", () => formatText("bold"));
  document.querySelector(".italic").addEventListener("click", () => formatText("italic"));
  document.querySelector(".underline").addEventListener("click", () => formatText("underline"));
  document.querySelector(".strikethrough").addEventListener("click", () => formatText("strikethrough"));

  function formatText(command) {
    document.execCommand(command, false, null);
  }

  document.querySelector(".add-image").addEventListener("click", () => {
    document.getElementById("uploadImage").click();
  });

  document.getElementById("uploadImage").addEventListener("change", (event) => {
    event.preventDefault();

    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
      insertImage(e.target.result);
    };
    reader.readAsDataURL(file);
  });

  function insertImage(imageSrc) {
    const img = document.createElement("img");
    img.src = imageSrc;
    img.style.border = "1px solid #ddd";
    img.style.borderRadius = "15px";
    img.style.maxWidth = "100%";

    const selection = window.getSelection();
    if (!selection.rangeCount) {
      bodyEditor.appendChild(img);
    } else {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(img);
    }
  }

  const createPostForm = document.querySelector("#createPostForm");
  createPostForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Post data

    try {
      // Get body
      
      if (!bodyEditor) {
        alert("Error: Missing form elements.");
        return;
      }

      // Validate inputs
      
      const body = bodyEditor.innerHTML.trim();
      const imgUrl = [...bodyEditor.getElementsByTagName("img")].map(img => img.src);

      if (!body) {
        alert("Body cannot be empty!");
        return;
      }

      // Add post to Firebase
      
      await addPost(body, imgUrl);

      // Success alert
      
      alert("Post added successfully!");
      createPostForm.reset(); 

    } catch (error) {
      console.error("Error adding post:", error);
      alert("Failed to add post. Please try again.");
    }
  });

  // Add post to firebase
  
  function addPost(body, imgUrl = "") {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject("Firebase database is not initialized.");
        return;
      }

      const newPostRef = db.ref("posts").push(); // Auto-generate unique ID
      newPostRef.set({
          body: body,
          imgUrl: imgUrl,
          counts: 0,
          views: 0
        })
        .then(() => resolve(true))
        .catch((error) => reject(error));
    });
  }
});
// Import fn

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getDatabase, ref, get, set, push, onValue, update, remove } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

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
const db = getDatabase(app);

// Posts

document.addEventListener("DOMContentLoaded", () => {
  
  // Edit post content

  const bodyEditor = document.querySelector(".body-editor");
  
  // Formatting
  
  document.querySelector(".bold").addEventListener("click", () => formatText("bold"));
  document.querySelector(".italic").addEventListener("click", () => formatText("italic"));
  document.querySelector(".underline").addEventListener("click", () => formatText("underline"));
  document.querySelector(".strikethrough").addEventListener("click", () => formatText("strikethrough"));

  function formatText(command) {
    document.execCommand(command, false, null);
  }
  
  // Image uploads
  
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

  // Build post data

  let states = JSON.parse(localStorage.getItem("states")) || [];
  const userEmail = states.find(state => state.email !== "");
  const emailToUsername = userEmail.email.replace(/@.*/, "");

  const createPostForm = document.querySelector("#createPostForm");
  createPostForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Post data

    try {
      if (!bodyEditor) {
        alert("Error: Missing form elements.");
        return;
      }

      const body = bodyEditor.innerHTML.trim();
      const imgUrl = [...bodyEditor.getElementsByTagName("img")].map(img => img.src);

      if (!body) {
        alert("Body cannot be empty!");
        return;
      }

      await addPost(body, imgUrl);
      createPostForm.reset();
    } catch (error) {
      alert("Error adding post:", error);
    }
  });

  // Add post to firebase

  const storedData = JSON.parse(localStorage.getItem("postId")) || [];
  console.log(storedData);

  async function addPost(body, imgUrl = "") {
    try {
      if (!db) throw new Error("Firebase database is not initialized.");

      // Ensure `localStorage` contains valid post data
      
      const storedData = JSON.parse(localStorage.getItem("postId")) || [];
      console.log("Stored Data at post submit:", storedData);

      // Extract correct post ID
      
      const storedPost = storedData.length > 0 ? storedData[0] : null;

      if (storedPost && storedPost.id) {
        console.log("Updating post with ID:", storedPost.id);

        const existingPostRef = ref(db, "posts/" + storedPost.id);
        const snapshot = await get(existingPostRef);

        if (!snapshot.exists()) {
          throw new Error("Post not found in Firebase for update.");
        }

        const existingPost = snapshot.val();
        console.log("Existing Post Data:", existingPost);

        // Ensure proper update
        
        await update(existingPostRef, {
          body,
          imgUrl: imgUrl || existingPost.imgUrl,
          time_posted: existingPost.time_posted,
          author_name: existingPost.author_name || "Unknown Author"
        });

        alert("Post updated successfully!");
        console.log("Post updated successfully!");

        // Remove `localStorage` item after update
        
        localStorage.removeItem("postId");
        localStorage.removeItem("edit");
      } else {
        const newPostRef = push(ref(db, "posts"));
        
        // Post object
        
        await set(newPostRef, {
          id: newPostRef.key,
          user_email: userEmail.email,
          author_name: emailToUsername.trim(),
          time_posted: Date.now(),
          body,
          imgUrl,
          convo: 0,
          convo_partners: {},
          boosts: 0,
          boostedBy: {},
          saves: 0,
          savedBy: {},
          shares: 0,
          views: 0
        });

        alert("New post added successfully!");
        console.log("New post added successfully!");
      }
    } catch (error) {
      console.error("Error adding/updating post:", error.message);
      alert("Error: " + error.message);
    }
  }

  // Inject post content to createPostForm

  if (storedData) {
    const bodyData = storedData.find(data => data.body !== "");
    if (bodyData) bodyEditor.innerHTML = bodyData.body;
  }
});
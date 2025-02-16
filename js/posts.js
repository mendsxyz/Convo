// Import fn

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
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

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Posts

document.addEventListener("DOMContentLoaded", () => {
  // Edit post content

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

  // Create post data

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
      alert("Post added successfully!");
      createPostForm.reset();
    } catch (error) {
      alert("Error adding post:", error);
    }
  });

  // Add post to firebase

  function addPost(body, imgUrl = "") {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject("Firebase database is not initialized.");
        return;
      }

      // Create a new post reference with an auto-generated ID
      const newPostRef = push(ref(db, "posts"));

      set(newPostRef, {
          body: body,
          imgUrl: imgUrl,
          counts: 0,
          views: 0
        })
        .then(() => {
          resolve("Post added successfully!");
        })
        .catch((error) => {
          reject("Failed to add post: " + error.message);
        });
    });
  }

  // Retrieve saved posts and display on posts-wrapper

  const postsWrapper = document.querySelector(".posts-wrapper");

  function getPosts() {
    /*if (!postsWrapper) {
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
    });*/
    alert("200");
  }

  getPosts();
});
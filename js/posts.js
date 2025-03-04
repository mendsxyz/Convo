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
const db = getDatabase();

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

  document.querySelector(".add-image").addEventListener("click", (e) => {
    e.preventDefault();

    document.getElementById("uploadImage").click();
  });

  document.getElementById("uploadImage").addEventListener("change", (event) => {
    event.preventDefault();
    event.stopPropagation();

    const file = event.target.files[0];
    if (!file) return;

    const maxSize = 514 * 1024;

    if (file.size > maxSize) {
      alert("File size exceeds 514KB limit.");
      return;
    }

    const imgFile = new Image();

    const reader = new FileReader();
    reader.onload = function(e) {
      insertImage(e.target.result);

      imgFile.src = e.target.result;

      imgFile.onload = function() {
        console.log(imgFile.height);
        localStorage.setItem("uploadedImgFileHeight", imgFile.height);
      }
    };
    reader.readAsDataURL(file);
  });

  let imgHeight = localStorage.getItem("uploadedImgFileHeight") || 0;

  function insertImage(imageSrc) {
    const img = document.createElement("img");
    img.src = imageSrc;
    img.style.maxHeight = "300px";
    img.style.objectFit = "cover";
    img.style.objectPosition = "center";
    img.style.border = "1px solid #ddd";
    img.style.borderRadius = "15px";
    img.style.marginTop = "5px";
    img.style.width = "100%";

    const selection = window.getSelection();
    if (!selection.rangeCount) {
      bodyEditor.appendChild(img);
      img.setAttribute("data-height", imgHeight);
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
  const userTier = userEmail.tier;
  const userName = userEmail.name;

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

      // Get and sanitize user email

      const safeEmail = userEmail.email.replace(/\./g, "_");

      // Fetch user tier from Firebase

      const userRef = ref(db, "users/" + safeEmail);
      const userSnapshot = await get(userRef);

      let userTier, userAvatar = userSnapshot.val().avatar;

      if (userSnapshot.exists()) {
        userTier = userSnapshot.val().tier || "T1"; // Default to T1 if missing
        console.log("User tier found:", userTier);
      } else {
        throw new Error("User not found in database.");
      }

      // Tier-based limits

      const tierLimits = {
        T1: { maxPosts: 5, maxImages: 5 },
        T2: { maxPosts: 50, maxImages: 25 },
        T3: { maxPosts: Infinity, maxImages: Infinity }
      };

      const { maxPosts, maxImages } = tierLimits[userTier];

      // Fetch user's existing post count

      const userPostsRef = ref(db, "posts");
      const postsSnapshot = await get(userPostsRef);
      const userPosts = postsSnapshot.exists() ? Object.values(postsSnapshot.val()).filter(post => post.user_email === userEmail.email) : [];

      if (userPosts.length >= maxPosts) {
        throw new Error(`You have reached your daily post limit of ${maxPosts} for your tier.`);
        return;
      }

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
          author_avatar: existingPost.author_avatar || "",
          author_name: existingPost.author_name || "Anon",
          author_tagname: existingPost.author_tagname || "unknown"
        });

        alert("Post updated successfully!");
        console.log("Post updated successfully!");

        // Remove `localStorage` items after update

        localStorage.removeItem("postId");
        localStorage.removeItem("edit");

        setTimeout(() => {
          localStorage.removeItem("storedData");
        }, 2000);
      } else {
        const newPostRef = push(ref(db, "posts"));

        // Post object

        await set(newPostRef, {
          id: newPostRef.key,
          user_email: userEmail.email,
          author_avatar: userAvatar,
          author_tier: userTier,
          author_name: userName,
          author_tagname: emailToUsername.trim(),
          time_posted: Date.now(),
          body,
          imgUrl,
          comments: {},
          commentsCount: 0,
          boosts: 0,
          boostedBy: {},
          saves: 0,
          savedBy: {},
          shares: 0,
          views: 0
        });

        alert("New post added successfully! " + "Tier: " + userTier);
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
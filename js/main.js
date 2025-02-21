// Import fn

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
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

const auth = getAuth();
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

document.addEventListener("DOMContentLoaded", () => {

  // Function to protect routes

  function protectRoute() {
    onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        console.log("Access granted to /posts");
        
        // Change title of createPostForm label from "Create" to "Edit"
        
        const edit = localStorage.getItem("edit");
        if (edit) document.querySelector(".post-status").textContent = "Edit post";
      } else {

        // Redirect unauthorized users

        window.location.href = "/404.html";
      }
    });
  }
  
  /* 
    Only verified users can edit and unverified users can
    post up to 5 times daily
  */
  
  if (window.location.pathname.includes("post.html")) {
    protectRoute();
  }

  const main = document.querySelector("main");

  // Nav menu toggle

  const nav = document.querySelector("nav.auto");
  const nav_toggle = document.querySelector(".nav-toggle");
  const cta_btn = document.querySelector("#ctaBtn");
  
  // Check if the elements exist
  
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
    
    // Close nav menu by clicking away from it
    
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
    auth_content: document.querySelector(".auth-content"),
    cn_links: document.querySelectorAll(".cn-link"),
    post_wrappers: document.querySelectorAll(".posts-wrapper")
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

  // Switching feed tabs

  if (UI.cn_links && UI.post_wrappers) {
    UI.cn_links.forEach(link => {
      link.addEventListener("click", () => {
        UI.cn_links.forEach(link => link.classList.remove("active"));
        link.classList.add("active");
        UI.post_wrappers.forEach(wrapper => {
          if (wrapper.classList.contains(link.dataset.tab)) {
            UI.post_wrappers.forEach(w => w.classList.remove("active"));
            wrapper.classList.add("active");
          }
        });
      });
    });
  }

  // Check user session

  const states = JSON.parse(localStorage.getItem("states")) || [];

  const activeSession = states.find(state => state.state === "signedin" || state.state === "signedup");

  if (activeSession) {

    // User session
    
    const safeEmail = activeSession.email.replace(/\./g, "_");
    const userRef = ref(db, "users/" + safeEmail);
    
    async function setUserTierMarks(){
      const userSnapshot = await get(userRef);
      if (userSnapshot.exists()) {
        
      }
    }
    
    setUserTierMarks();
    
    if (UI.header_auth_state) {
      UI.header_auth_state.classList.add("active");
      UI.header_auth_state.textContent = activeSession.email.replace(/@.*/, "");
    }
    
    UI.nav_links.forEach(link => {
      if (link.classList.contains("signOutBtn")) {
        link.addEventListener("click", () => {
          localStorage.removeItem("states");

          UI.loader.classList.add("active");
          if (!UI.refresh.classList.contains("rotate")) {
            UI.refresh.classList.add("rotate");
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

  // Retrieve posts

  const postsWrapper = document.querySelector(".posts-wrapper.for-you-posts");
  const savedPostsWrapper = document.querySelector(".posts-wrapper.saved-posts");

  async function getPosts() {
    if (!postsWrapper) {
      console.error("Error: .posts-wrapper.for-you-posts element not found!");
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

      let postsArray = [];

      snapshot.forEach((childSnapshot) => {
        const post = childSnapshot.val();
        const postId = childSnapshot.key;

        postsArray.push({ postId, ...post });
      });

      // Sort posts by `time_posted` (oldest to newest)

      postsArray.sort((a, b) => b.time_posted - a.time_posted);

      // Append sorted posts to the DOM

      postsArray.forEach((post) => {
        const postId = post.postId;
        console.log(postId);
        
        // Post HTML template
        
        postsWrapper.innerHTML += `
          <div class="post" id="post-${postId}" data-id="${postId}">
            <div class="post-col-1">
              <img src="" alt="author-pfp">
            </div>
          
            <div class="post-col-2">
              <div class="author">
                <span class="author-name">${post.author_name  ||  "retrieving_author..."}</span>
                <span>•</span>
                <span class="time-posted" data-id="${postId}" data-timestamp="${post.time_posted  ||  Date.now()}">${formatTime(post.time_posted)}</span>
              </div>
          
              <div class="post-body" data-id="post-${postId}">${post.body}</div>
            
              <div class="post-analytics">
                <div class="pa convo"><span>${post.convo  ||  0}</span><span class="ms-rounded">quickreply</span></div>
                <div class="pa boosts" data-id="${postId}"><span class="boosts-count">${post.boosts  ||  0}</span><span class="ms-rounded">bolt</span></div>
                <div class="pa saves" data-id="${postId}"><span class="saves-count">${post.saves  ||  0}</span><span class="ms-rounded">bookmark</span></div>
                <div class="pa shares"><span>${post.shares  ||  0}</span><span class="ms-rounded">share</span></div>
                <div class="pa views"><span>${post.views  ||  0}</span><span class="ms-rounded">bar_chart</span></div>
                
                <span class="more-post-actions ms-rounded">more_horiz</span>
                
                <div class="mpa-options">
                  <span class="block-user ms-rounded" style="display: ${post.user_email !== activeSession.email ? "flex" : "none"};" id="${post.user_email}">block</span>
                  <span class="report-post ms-rounded" style="display: ${post.user_email !== activeSession.email ? "flex" : "none"};" id="${postId}">report</span>
                  <span class="update-post ms-rounded" data-id=${postId} style="display: ${post.user_email ===activeSession.email ? "flex" : "none"};" id="${postId}">edit</span>
                  <span class="delete-post ms-rounded" data-id=${postId} style="display: ${post.user_email ===activeSession.email ? "flex" : "none"};" id="${postId}">delete</span>
                </div>
              </div>
            </div>
          </div>
        `;
        
        // Individual post actions
        
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
            const mpa_toggle = post0.querySelector(".more-post-actions");
            const mpa = post0.querySelector(".mpa-options");
            const update0 = post0.querySelector(".post-analytics .update-post");
            const delete0 = post0.querySelector(".post-analytics .delete-post");

            mpa_toggle.addEventListener("click", () => {
              mpa.classList.toggle("active");
            });

            // Edit post

            update0.addEventListener("click", () => {
              if (activeSession.email) {
                console.log("Access granted to edit posts");

                if (update0.dataset.id !== post0.dataset.id) return;

                const postBodyEl = post0.querySelector(".post-body");
                const postBody = postBodyEl ? postBodyEl.innerHTML.trim() : "";

                // Store the post ID and body
                
                const storedPostData = [{ id: post0.dataset.id, body: postBody }];
                localStorage.setItem("postId", JSON.stringify(storedPostData));
                localStorage.setItem("edit", "fromEditPost");

                // Debug log to confirm data is stored
                
                console.log("Stored in localStorage (Edit Click):", localStorage.getItem("postId"));

                setTimeout(() => {
                  window.location.href = "/post.html";
                }, 3000);
              } else {
                window.location.href = "/404.html";
              }
            });

            // Delete post

            delete0.addEventListener("click", () => {
              if (confirm("Are you sure you want to delete this post?")) {
                const postIdToDelete = delete0.getAttribute("data-id"); // ✅ Get the correct post ID
                const deleteRef = ref(db, "posts/" + postIdToDelete);

                remove(deleteRef)
                  .then(() => console.log(`Post ${postIdToDelete} deleted successfully`))
                  .catch(error => console.error("Error deleting post:", error));
              }
            });

            // Other post actions

            const pa = {
              convo: post0.querySelector(".post-analytics .pa.convo"),
              boosts: post0.querySelector(".post-analytics .pa.boosts"),
              saves: post0.querySelector(".post-analytics .pa.saves"),
              shares: post0.querySelector(".post-analytics .pa.shares"),
              views: post0.querySelector(".post-analytics .pa.views")
            }

            // Boosts

            const safeEmail = activeSession.email.replace(/\./g, "_");

            async function handleBoosts(postId, userEmail) {
              const postRef = ref(db, "posts/" + postId);

              try {

                // Fetch latest post data

                const snapshot = await get(postRef);

                if (!snapshot.exists()) {
                  console.error("Post not found in database.");
                  return;
                }

                let post = snapshot.val(); // Get latest data
                console.log("Fetched post data:", post);

                let currentBoosts = post.boosts ?? 0; // Default to 0
                let boosterUsers = post.boostedBy ? { ...post.boostedBy } : {}; // Ensure object

                if (boosterUsers[userEmail]) {
                  currentBoosts = Math.max(0, currentBoosts - 1);
                  delete boosterUsers[userEmail];
                } else {
                  currentBoosts += 1;
                  boosterUsers[userEmail] = true;
                }

                // Debug before updating Firebase

                console.log("Updating boosts:", { ...post, boosts: currentBoosts, boostedBy: boosterUsers });

                // Update only the boosts field in Firebase

                await update(postRef, {
                  boosts: currentBoosts,
                  boostedBy: boosterUsers
                });

                // Update the UI

                let boostCountEl = document.querySelector(`.pa.boosts[data-id="${postId}"] .boosts-count`);
                if (boostCountEl) boostCountEl.textContent = currentBoosts;

                console.log("Boost updated successfully!");
              } catch (error) {
                console.error("Error updating boosts:", error);
              }
            }

            // Saves

            async function handleSaves(postId, userId) {
              const postRef = ref(db, "posts/" + postId);
              const userRef = ref(db, "users/" + userId + "/saved_posts/" + postId);

              try {
                const postSnap = await get(postRef);
                if (!postSnap.exists()) return;

                let post = postSnap.val();
                let savedBy = post.savedBy || {};
                let isSaved = savedBy[userId];

                if (isSaved) {
                  delete savedBy[userId];
                  post.saves = Math.max(0, post.saves - 1);
                  await remove(userRef);
                } else {
                  savedBy[userId] = true;
                  post.saves += 1;
                  await set(userRef, true);
                }

                await update(postRef, { saves: post.saves, savedBy });
              } catch (error) {
                console.error("Error updating saves:", error);
              }
            }

            // Event Delegation for Boosts

            document.addEventListener("click", async (event) => {
              let boostBtn = event.target.closest(".pa.boosts");
              if (!boostBtn) return;

              let postId = boostBtn.getAttribute("data-id");
              if (!postId) return;

              let userEmail = activeSession.email.replace(/\./g, "_");

              // Prevent multiple rapid clicks from triggering duplicate events

              if (boostBtn.classList.contains("processing")) return;
              boostBtn.classList.add("processing");

              await handleBoosts(postId, userEmail);

              // Remove the "processing" class after action is complete

              boostBtn.classList.remove("processing");
            });

            // Event Delegation for Saves

            document.addEventListener("click", async (event) => {
              let saveBtn = event.target.closest(".pa.saves");
              if (!saveBtn) return;

              let postId = saveBtn.getAttribute("data-id");
              if (!postId) return;

              let userEmail = activeSession.email.replace(/\./g, "_");
              handleSaves(postId, userEmail);
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
  
  // Comments
  
  async function getComments(userId) {
    
  }
  
  // Retrieve user's saved posts per session
  
  async function getSavedPosts(userId) {
    const userRef = ref(db, "users/" + userId + "/saved_posts");
    const snapshot = await get(userRef);

    savedPostsWrapper.innerHTML = "";

    if (!snapshot.exists() || Object.keys(snapshot.val()).length === 0) {
      console.log("No saved posts available.");
      savedPostsWrapper.innerHTML = `<h3 style="text-align: center; margin-top: 4rem;">No saved posts yet.</h3>`;
      return;
    }

    let savedPostIds = Object.keys(snapshot.val());
    console.log("Saved Post IDs:", savedPostIds);

    for (let postId of savedPostIds) {
      let postSnap = await get(ref(db, "posts/" + postId));
      if (!postSnap.exists()) continue;

      let post = postSnap.val();
      console.log("Post Data:", post);

      let postElement = document.createElement("div");
      postElement.className = "post";
      postElement.id = `post-${postId}`;
      
      // Saved post HTML template
      
      postElement.innerHTML = `
        <div class="post-col-1">
          <img src="" alt="author-pfp">
        </div>
        
        <div class="post-col-2">
          <div class="author">
            <span class="author-name">${post.author_name  ||  "retrieving_author..."}</span>
            <span>•</span>
            <span class="time-posted" data-id="${postId}" data-timestamp="${post.time_posted  ||  Date.now()}">${formatTime(post.time_posted)}</span>
          </div>
          
          <div class="post-body" data-id="post-${postId}">${post.body}</div>
          
          <div class="post-analytics">
            <div class="pa convo"><span>${post.convo  ||  0}</span><span class="ms-rounded">quickreply</span></div>
            <div class="pa boosts data-id="${postId}"><span>${post.boosts  ||  0}</span><span class="ms-rounded">bolt</span></div>
            <div class="pa saves" data-id="${postId}"><span>${post.saves  ||  0}</span><span class="ms-rounded">bookmark</span></div>
            <div class="pa shares"><span>${post.shares  ||  0}</span><span class="ms-rounded">share</span></div>
            <div class="pa views"><span>${post.views  ||  0}</span><span class="ms-rounded">bar_chart</span></div>
            
            <span class="more-post-actions ms-rounded">more_horiz</span>
            
            <div class="mpa-options">
              <span class="block-user ms-rounded" style="display: ${post.user_email !== activeSession.email ? "flex" : "none"};" id="${post.user_email}">block</span>
              <span class="report-post ms-rounded" style="display: ${post.user_email !== activeSession.email ? "flex" : "none"};" id="${postId}">report</span>
              <span class="update-post ms-rounded" style="display: ${post.user_email === activeSession.email ? "flex" : "none"};" id="${postId}">edit</span>
              <span class="delete-post ms-rounded" style="display: ${post.user_email === activeSession.email ? "flex" : "none"};" id="${postId}">delete</span>
            </div>
          </div>
        </div>
      `;

      savedPostsWrapper.appendChild(postElement);
    }
    
    // Second click on save btn should unsave post
    
    document.querySelectorAll(".pa.saves").forEach(btn => {
      btn.removeEventListener("click", handleUnsave);
      btn.addEventListener("click", handleUnsave);
    });

    const safeEmail = activeSession.email.replace(/\./g, "_");
    
    // Unsave post
    
    function handleUnsave(event) {
      let postId = event.currentTarget.getAttribute("data-id");
      removeSavedPost(postId, safeEmail);
    }
  }

  const safeEmail = activeSession.email.replace(/\./g, "_");
  getSavedPosts(safeEmail);
  
  // Remove saved post
  
  async function removeSavedPost(postId, userEmail) {
    console.log("Removing saved post: " + postId + " for user: " + userEmail);

    // Remove from Firebase

    const postRef = ref(db, "users/" + userEmail + "/saved_posts/" + postId);
    await remove(postRef);
    console.log("Post " + postId + " removed from Firebase");

    // Remove from UI

    const postElement = document.querySelector(`#post-${postId}`);
    if (postElement) postElement.remove();

    // Update saves count in Firebase

    const savesRef = ref(db, "posts/" + postId + "/saves");
    let snapshot = await get(savesRef);
    if (snapshot.exists()) await set(savesRef, Math.max(0, snapshot.val() - 1));

    // Update saves count in UI

    let saveCountEl = document.querySelector(`#post-${postId} .pa.saves[data-id="${postId}"] .saves-count`);
    if (saveCountEl) saveCountEl.innerText = Math.max(0, parseInt(saveCountEl.innerText) - 1);

    // Reload saved posts

    setTimeout(() => getSavedPosts(safeEmail), 300);
  }
  
  // Post time
  
  function formatTime(timestamp) {
    
    // If no valid/running timestamp return "Just now"
    
    if (!timestamp || isNaN(timestamp) || timestamp < 10000000000) {
      return "Just now";
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
  
  // Update post time
  
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

// Reset password

const resetPasswordForm = document.querySelector(".resetPasswordForm-wrapper");
const forgotPassword = document.querySelector(".forgot-password");
if (forgotPassword) {
  forgotPassword.addEventListener("click", () => {
    resetPasswordForm.classList.add("active");
  });
}

// Cancel password reset and navigate back to signin form

const backToSignin = document.querySelector(".back-to-signin");
if (backToSignin) {
  backToSignin.addEventListener("click", () => {
    resetPasswordForm.classList.remove("active");
  });
}
// Import fn

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
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

  // Assign public functions

  const states = JSON.parse(localStorage.getItem("states")) || [];
  const main = document.querySelector("main");

  const awaitBtns = document.querySelectorAll("button.awaitable");

  // UI components

  const nav = document.querySelector("nav.auto");
  const nav_toggle = document.querySelector(".nav-toggle");
  const content_nav = document.querySelector(".content-nav");
  const cta_btn = document.querySelector("#ctaBtn");

  const UI = {
    loader: document.querySelector("#loader"),
    animation_wrapper: document.querySelector("#loader .animation-wrapper"),
    auth_ok_avatar: document.querySelector("#avatar"),
    auth_ok_navToggle: document.querySelector(".nav-toggle"),
    auth_ok_userName: document.querySelectorAll(".userName"),
    authform_wrapper: document.querySelector(".authForm-wrapper"),
    nav_links: document.querySelectorAll(".nav-link"),
    nl_collapsibles: document.querySelectorAll(".nl-collapsible"),
    current_username: document.querySelector(".current-userName"),
    hero: document.querySelector(".hero"),
    auth_content: document.querySelector(".auth-content"),
    cn_links: document.querySelectorAll(".cn-link"),
    post_wrappers: document.querySelectorAll(".posts-wrapper")
  }

  // Check for existence

  if (!awaitBtns || !nav || !nav_toggle || !cta_btn) {
    console.error("One or more elements not found in the DOM.");
  } else {
    awaitBtns.forEach(btn => {
      let awaitSpan;

      btn.addEventListener("click", () => {
        btn.classList.add("active");

        awaitSpan = setTimeout(() => {
          btn.classList.remove("active");

          clearTimeout(awaitSpan);
        }, 5000);
      });
    });

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

    // Changing text effect on hero > cta btn

    const changingTxt = cta_btn.querySelector(".changing-text");
    const words = ["writing", "connecting", "reading"];
    let index = 0;

    setInterval(() => {
      changingTxt.textContent = words[index];
      index = (index + 1) % words.length; // Loops back to 0 after last word
    }, 2000);

    // Close nav menu by clicking away from it

    function menuOpenOk_touchBg(e) {
      if (main.contains(e.target)) {
        nav.classList.remove("active");
        main.removeEventListener("click", menuOpenOk_touchBg);
      }
    }
  }

  // Check user verification

  onAuthStateChanged(auth, (user) => {
    const activeSession = states.find(state => state.state === "signedin" || state.state === "signedup");
    const emailUsername = activeSession?.email.replace(/@.*/, "");

    let welcomeScrHTML, userEmail;

    /* ⚠️ Force reset ⚠️

    if (localStorage.getItem("states")) {
      localStorage.removeItem("states");
    };

    if (localStorage.getItem("sessionCache")) {
      localStorage.removeItem("sessionCache");
    }

    */

    if (user) {
      user.reload().then(() => {
        userEmail = user.email;

        const safeEmail = userEmail.replace(/\./g, "_");
        const emailUsername = userEmail.replace(/@.*/, "");

        if (user.emailVerified) {

          // Display success message

          let welcomeScr = `
            <div class="welcome-screen">
              <div class="splash">
                <img class="ws-img" src="img/welcome-img.png" alt="welcome_img">
        
                <div class="ws-text">
                  <span class="title">
                    Welcome
                  </span>
                  <span class="body-content">
                    <i>Read</i> as much, <i>Write</i> as much, <i>Connect</i> as much
                  </span>
                </div>
              </div>
        
              <div class="accountSetupForm-wrapper">
                <div>
                  Account setup
                </div>
        
                <form id="accountSetupForm">
                  <div class="input">
                    <label class="pfp">
                      <span class="ms-rounded">account_circle</span>
                      <span>Set a profile picture</span>
                    </label>
                    
                    <div class="set-profile-picture">
                      <img src="img/default-avatar.jpeg" alt="avatar_holder" class="avatar-holder">
                      <label for="setAvatar" class="pfp upload-pfp">
                        <span class="ms-rounded">image</span>
                      </label>
                      <input type="file" id="setAvatar" accept="image/*" hidden>
                    </div>
                  </div>
                  
                  <div class="input">
                    <label for="setName" class="name">
                      <span class="ms-rounded">abc</span>
                      <span>Set name</span>
                    </label>
                    
                    <input type="text" id="setName" placeholder="What do we call you?" required>
                  </div>
        
                  <div class="input">
                    <label for="setGender" class="gender">
                      <span class="ms-rounded">female</span>
                      <span>Set gender</span>
                    </label>
        
                    <div id="setGender">
                      <div class="set-gender male" data-gender="male">Male</div>
                      <div class="set-gender female" data-gender="female">Female</div>
                      <div class="set-gender not-applicable" data-gender="not-applicable">Not applicable</div>
                    </div>
                  </div>
        
                  <div class="input">
                    <label for="setBirthday" class="birthday">
                      <span class="ms-rounded">123</span>
                      <span>Set birthday</span>
                    </label>
                    <input type="tel" id="setBirthday" placeholder="DD-MM-YYYY" required>
                  </div>
        
                  <div class="input">
                    <label for="setInterests" class="interests">
                      <span class="ms-rounded" style="font-size: 18px;">favorite</span>
                      <span>Pick interests</span>
                    </label>
                    
                    <div id="setInterests"></div>
                  </div>
        
                  <div class="input">
                    <button type="submit">
                      <span>Continue</span>
                      <span class="btn-loader"></span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          `;

          let welcomeScrLoaded;

          async function userSetup() {
            const userRef_ = ref(db, "users/" + safeEmail);
            const userSnapshot_ = await get(userRef_);

            if (userSnapshot_.exists()) {
              UI.loader.querySelector(".welcome-screen")?.remove();
              UI.animation_wrapper.style.display = "flex";
            } else {
              alert("Email verified successfully!");

              UI.loader.classList.add("active");
              UI.loader.insertAdjacentHTML("afterbegin", welcomeScr);
              UI.animation_wrapper.style.display = "none";

              welcomeScrLoaded = document.querySelector(".welcome-screen");
            }
          }

          // Account setup for new users

          async function initialize() {
            await userSetup();

            if (welcomeScrLoaded) {
              setTimeout(() => {
                const setPfp = document.querySelector(".set-profile-picture");

                document.querySelector(".upload-pfp")?.addEventListener("click", (event) => {
                  event.preventDefault();

                  document.getElementById("setAvatar")?.click();
                });

                document.getElementById("setAvatar")?.addEventListener("change", (event) => {
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
                  const img = document.querySelector(".avatar-holder");
                  img.src = imageSrc;

                  const labels = document.querySelectorAll("label.pfp");
                  labels.forEach(label => label.classList.add("complete"));
                }

                // Gender selection

                const genders = document.querySelectorAll("#setGender .set-gender");
                genders.forEach(gender => {
                  gender.addEventListener("click", () => {
                    genders.forEach(gender => gender.classList.remove("active"));
                    gender.classList.add("active");
                    const labels = document.querySelectorAll("label.gender");
                    labels.forEach(label => label.classList.add("complete"));
                  });
                });

                // Birthday

                const setBirthday = document.querySelector("#setBirthday");
                const label_b = document.querySelector("label.birthday");

                setBirthday.addEventListener("input", () => {
                  let ddValue, mmValue;

                  if (setBirthday.value.length === 2) {
                    ddValue = setBirthday.value;
                    setBirthday.value = ddValue + "-";
                  }

                  if (setBirthday.value.length === 5) {
                    mmValue = setBirthday.value;
                    setBirthday.value = mmValue + "-";
                  }

                  if (setBirthday.value.length === 10) {
                    label_b.classList.add("complete");
                  } else {
                    label_b.classList.remove("complete");
                  }
                });

                // Interests

                const setInterests = document.querySelector("#setInterests");
                const label_i = document.querySelector("label.interests");

                setInterests.innerHTML = "";

                let interests = [
                "Sports", "Tech", "Crypto", "Food", "Travel", "Fashion",
                "Remote jobs", "Ghostwriting", "Hiking", "Tv shows",
                "Soccer", "DIY tutorials", "Carnivals", "Knitting",
                "Basketball", "Religion", "Celebrities", "Music", "Rap",
                "Outdoor", "Affiliate marketing", "Graphic designs",
                "Forex", "Finance", "Military", "Cycling", "Content creation",
                "Blogging", "Vlogging", "POV reads", "Fiction", "Non-fiction",
                "Afrobeats", "Hip-hop", "Reggae", "Baseball", "NASA", "Internships",
                "Apple", "IBM", "Smartphones", "Laptops", "Accessories",
                "Naija", "News", "Movies", "Hangouts", "Cooking",
                "Poetry", "Politics"
              ];

                const interestsWrapper = [];

                for (let i = 0; i < interests.length; i++) {
                  const interest = {
                    "interest": interests[i]
                  }

                  interestsWrapper.push(interest);

                  const interestHTML = `<div class="set-interest" data-interest="${interests[i]}">${interests[i]}</div>`;

                  setInterests.innerHTML += interestHTML;
                }

                const interestEls = setInterests.querySelectorAll(".set-interest");
                let activeCount = 0;

                interestEls.forEach(el => {
                  el.addEventListener("click", () => {
                    el.classList.toggle("active");

                    if (!el.classList.contains("active")) {
                      activeCount--;
                    } else {
                      activeCount += 1;
                    }

                    if (activeCount > 2) {
                      label_i.classList.add("complete");
                    } else {
                      label_i.classList.remove("complete");
                    }
                  });
                });
              }, 1000);

              // Set user account

              const accountSetupForm = document.querySelector("#accountSetupForm");
              accountSetupForm.addEventListener("submit", async function(event) {
                event.preventDefault();

                const genders = document.querySelectorAll(".set-gender");
                const interests = document.querySelectorAll(".set-interest");

                const setting = {
                  name: document.querySelector("#setName").value,
                  avatarUrl: document.querySelector(".avatar-holder").src,
                  gender: [...genders].find(el => el.classList.contains("active"))?.dataset.gender || "not set",
                  birthday: document.querySelector("#setBirthday").value,
                  interests: [...interests].filter(el => el.classList.contains("active")).map(el => el.dataset.interest) || []
                }

                console.log(setting);

                try {
                  console.log(userEmail);

                  // Default tier for new users is "T1"

                  const userTier = "T1";

                  // Store user data in Firebase Realtime Database

                  await set(ref(db, "users/" + safeEmail), {
                    name: setting.name,
                    tagname: emailUsername,
                    email: userEmail.trim(),
                    tier: userTier,
                    avatar: setting.avatarUrl,
                    gender: setting.gender,
                    birthday: setting.birthday,
                    interests: setting.interests,
                    date_joined: new Date().toLocaleString(),
                    passedAccSetup: "yes"
                  });

                  const userSetup = {
                    name: setting.name,
                    tagname: emailUsername,
                    email: userEmail.trim(),
                    state: "signedup",
                    tier: userTier,
                    avatar: setting.avatarUrl,
                    gender: setting.gender,
                    birthday: setting.birthday,
                    interests: setting.interests,
                    date_joined: new Date().toLocaleString(),
                    passedAccSetup: "yes"
                  }

                  states.push(userSetup);

                  localStorage.setItem("states", JSON.stringify(states));

                  setTimeout(() => {
                    UI.loader.querySelector(".welcome-screen")?.remove();
                  }, 1000);

                  UI.animation_wrapper.style.display = "flex";

                  setTimeout(() => {
                    location.reload();
                  }, 2000);

                } catch (error) {
                  alert("Error saving state:", error);
                }
              });
            }
          };

          initialize();

          // Page loaded and page refresh: remove loader

          UI.loader?.classList.remove("active");

          // Hide user avatar

          UI.auth_ok_avatar?.classList.remove("active");

          // Hide nav toggle

          UI.auth_ok_navToggle?.classList.remove("active");

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

          if (activeSession) {

            // Show user avatar

            if (UI.auth_ok_avatar) {
              UI.auth_ok_avatar.classList.add("active");
              UI.auth_ok_avatar.src = activeSession.avatar;
            }

            // Show nav toggle

            UI.auth_ok_navToggle?.classList.add("active");

            // Tier marks

            const tierMarks = {
              T2: `<span style="color: var(--primary); font-size: 16px;" class="ms-rounded">verified</span>`,
              T3: `<span style="color: var(--secondary); font-size: 18px;" class="ms-rounded">award_star</span>`
            };

            // Set tiers per session

            const safeEmail_ = activeSession.email.replace(/@.*/, "");

            if (UI.auth_ok_userName) {

              if (activeSession.tier === "T2") {
                UI.auth_ok_userName.forEach(username => username.innerHTML = `${emailUsername + " " + tierMarks.T2}`);
              } else if (activeSession.tier === "T3") {
                UI.auth_ok_userName.forEach(username => username.innerHTML = `${emailUsername + " " + tierMarks.T3}`);
              } else {
                UI.auth_ok_userName.forEach(username => username.innerHTML = emailUsername);
              }

              UI.auth_ok_userName.forEach(username => username.classList.add("active"));
            }

            // Signing Out

            UI.nav_links.forEach(link => {
              if (link.classList.contains("signOutBtn")) {
                link.addEventListener("click", () => {
                  signOut(auth).then(() => {
                    const newState = states.find(state => state.state === "signedin" || state.state === "signedup");
                    if (newState) newState.state = "signedout";

                    localStorage.setItem("states", JSON.stringify(states));
                    if (localStorage.getItem("sessionCache")) localStorage.removeItem("sessionCache");

                    UI.loader.classList.add("active");
                    UI.animation_wrapper.style.display = "flex";

                    setTimeout(() => {
                      UI.loader.classList.remove("active");
                    }, 5000);

                    setTimeout(() => {
                      location.reload();
                    }, 5000);
                  });
                });
              }
            });

            UI.loader.querySelector(".welcome-screen")?.remove();
            UI.animation_wrapper.style.display = "flex";

            UI.hero.classList.add("await-auth");
            UI.auth_content.classList.add("active");
            UI.authform_wrapper.classList.remove("active");
            UI.current_username.textContent = activeSession.email;
          };

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

                // Author tier marks

                const tierMarks = {
                  T2: `<span style="color: var(--primary); font-size: 16px;" class="ms-rounded">verified</span>`,
                  T3: `<span style="color: var(--secondary); font-size: 18px;" class="ms-rounded">award_star</span>`
                };

                // Post HTML template

                postsWrapper.innerHTML += `
                  <div class="post" id="post-${postId}" data-id="${postId}">
                    <div class="post-col-1">
                      <img src="${post.author_avatar}" alt="author-pfp">
                    </div>
                  
                    <div class="post-col-2">
                      <div class="author">
                        <span class="author-name" data-email="${post.user_email}" data-tier="${post.author_tier}">
                          ${((post.author_tier === "T2") ? 
                          post.author_name + " " + tierMarks.T2 
                          : (post.author_tier === "T3") ?
                          post.author_name + " " + tierMarks.T3 
                          : post.author_name) || "loading..."}
                          <span class="author-tagname">${"@" + post.author_tagname}</span>
                        </span>
                        <span>•</span>
                        <span class="time-posted" data-id="${postId}" data-timestamp="${post.time_posted  ||  Date.now()}">${formatTime(post.time_posted)}</span>
                      </div>
                  
                      <div class="post-body" data-id="post-${postId}">${post.body}</div>
                    
                      <div class="post-analytics">
                        <div class="pa comments"><span class="count">${post.commentsCount  ||  0}</span><span class="ms-rounded">quickreply</span></div>
                        <div class="pa boosts" data-id="${postId}"><span class="boosts-count">${post.boosts || 0}</span><span class="ms-rounded">flash_on</span></div>
                        <div class="pa saves" data-id="${postId}"><span class="saves-count">${post.saves || 0}</span><span class="ms-rounded">bookmark</span></div>
                        <div class="pa shares"><span>${post.shares  ||  0}</span><span class="ms-rounded">share</span></div>
                        <div class="pa views"><span>${post.views  ||  0}</span><span class="ms-rounded">bar_chart</span></div>
                        
                        <span class="more-post-actions ms-rounded">more_horiz</span>
                        
                        <div class="mpa-options">
                          <span class="block-user ms-rounded" style="display: ${post.user_email !== activeSession?.email ? "flex" : "none"};" id="${post.user_email}">block</span>
                          <span class="report-post ms-rounded" style="display: ${post.user_email !== activeSession?.email ? "flex" : "none"};" id="${postId}">report</span>
                          <span class="update-post ms-rounded" data-id=${postId} style="display: ${post.user_email === activeSession?.email ? "flex" : "none"};" id="${postId}">edit</span>
                          <span class="delete-post ms-rounded" data-id=${postId} style="display: ${post.user_email === activeSession?.email ? "flex" : "none"};" id="${postId}">delete</span>
                        </div>
                      </div>
                    </div>
                  </div>
                `;

                // Post image actions

                const postImages = document.querySelectorAll(".post-body img");

                postImages.forEach(img => {
                  img.addEventListener("click", expandImg);

                  function expandImg() {
                    img.classList.add("expanded");

                    const closeExpandedImgViewHTML = document.createElement("div");
                    closeExpandedImgViewHTML.classList.add("close-expandedImgView");
                    closeExpandedImgViewHTML.innerHTML = `
                      <span class="ms-rounded">close</span>
                    `;

                    main.appendChild(closeExpandedImgViewHTML);

                    const closeExpandedImgView = document.querySelector(".close-expandedImgView");

                    if (img.classList.contains("expanded")) {
                      closeExpandedImgView.addEventListener("click", imgExpandedOk_close);
                      img.removeEventListener("click", expandImg);
                    }
                  };

                  function imgExpandedOk_close(e) {
                    if (document.querySelector(".close-expandedImgView").contains(e.target)) {
                      img.classList.remove("expanded");
                      img.addEventListener("click", expandImg);
                      document.querySelector(".close-expandedImgView").removeEventListener("click", imgExpandedOk_close);
                      document.querySelector(".close-expandedImgView").remove();
                    }
                  }
                });

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
                    const updatePost = post0.querySelector(".post-analytics .update-post");
                    const deletePost = post0.querySelector(".post-analytics .delete-post");

                    mpa_toggle.addEventListener("click", () => {
                      mpa.classList.toggle("active");
                    });

                    // Edit post

                    updatePost.addEventListener("click", () => {
                      if (activeSession.email) {
                        console.log("Access granted to edit posts");

                        if (updatePost.dataset.id !== post0.dataset.id) return;

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

                    deletePost.addEventListener("click", () => {
                      if (confirm("Delete post?")) {
                        const postIdToDelete = deletePost.getAttribute("data-id");
                        const deleteRef = ref(db, "posts/" + postIdToDelete);

                        remove(deleteRef)
                          .then(() => console.log(`Post ${postIdToDelete} deleted successfully`))
                          .catch(error => console.error("Error deleting post:", error));
                      }
                    });

                    // Other post actions

                    const pa = {
                      comments: post0.querySelector(".post-analytics .pa.comments"),
                      boosts: post0.querySelector(".post-analytics .pa.boosts"),
                      saves: post0.querySelector(".post-analytics .pa.saves"),
                      shares: post0.querySelector(".post-analytics .pa.shares"),
                      views: post0.querySelector(".post-analytics .pa.views")
                    }

                    // Boosts

                    // const safeEmail = activeSession.email.replace(/\./g, "_");

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

                        const savesCountElement = document.querySelector(`#post-${postId} .saves-count`);

                        // Optimistically update UI before async calls

                        if (savesCountElement) {
                          savesCountElement.textContent = isSaved ? post.saves - 1 : post.saves + 1;
                        }

                        if (isSaved) {
                          delete savedBy[userId];
                          post.saves = Math.max(0, post.saves - 1);
                          await remove(userRef);
                        } else {
                          savedBy[userId] = true;
                          post.saves += 1;
                          await set(userRef, true);
                        }

                        // Update Firebase

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

              // Run view tracking every 30 seconds

              setInterval(trackPostViews, 3000);
            }, (error) => {
              console.error("Error fetching posts:", error);
            });
          }

          getPosts();

          const viewedPosts = new Set(); // Store posts that have been counted

          function trackPostViews() {
            const posts = document.querySelectorAll(".post");

            posts.forEach((post) => {
              const rect = post.getBoundingClientRect();
              const postId = post.getAttribute("data-id");

              // Check if the post is in the middle or above it

              if (rect.top > window.innerHeight * 0.01 && rect.top < window.innerHeight * 0.6) {
                if (!viewedPosts.has(postId)) {
                  handlePostViews(postId); // Update views in the database
                  viewedPosts.add(postId); // Prevent multiple counts
                }
              }
            });
          }

          // Handle post views

          async function handlePostViews(postId) {
            if (!postId) return;

            const userEmail = activeSession.email.replace(/\./g, "_"); // Normalize email
            const postKey = `${userEmail}_${postId}`; // Unique key for user+post
            let viewedPosts = JSON.parse(localStorage.getItem("viewedPosts")) || {};

            // Prevent duplicate views

            if (viewedPosts[postKey]) {
              console.log("View already recorded for this user:", postId);
              return;
            }

            const postRef = ref(db, "posts/" + postId);

            try {
              const snapshot = await get(postRef);
              if (!snapshot.exists()) return;

              let postData = snapshot.val();
              let currentViews = postData.views ?? 0;

              // Increase view count

              await update(postRef, {
                views: currentViews + 1
              });

              // Mark as viewed & save in localStorage

              viewedPosts[postKey] = true;
              localStorage.setItem("viewedPosts", JSON.stringify(viewedPosts));

              console.log("Post view updated:", currentViews + 1);
            } catch (error) {
              console.error("Error updating post views:", error);
            }
          }

          // Comments

          const postComments = document.querySelector(".post-comments-overlay");
          const commentBody = document.querySelector(".comment-body");
          const commentForm = document.querySelector("#commentForm");

          let activePostId = null;

          // Open comments

          const openComments = (postElement) => {
            if (!postElement) return;

            content_nav.classList.add("hide");

            const postId = postElement.dataset.id;
            if (activePostId === postId) return; // Prevent reloading comments for the same post

            activePostId = postId;
            postComments.classList.add("active");

            const postHeader = postComments.querySelector(".post-header");
            postHeader.innerHTML = ""; // Clear old post
            postHeader.appendChild(postElement.cloneNode(true));

            const commentsList = postComments.querySelector(".comments-list");
            commentsList.innerHTML = "";
            loadComments(activePostId);

            // Comment boosts

            async function handleCommentBoosts(postId, commentId, userEmail) {
              const commentRef = ref(db, "posts/" + activePostId + "/comments/" + commentId); // ✅ Correct path

              try {

                // Fetch latest comment data

                const snapshot = await get(commentRef);

                if (!snapshot.exists()) {
                  console.error("Comment not found in database.");
                  return;
                }

                let comment = snapshot.val();
                console.log("Fetched comment data:", comment);

                let currentBoosts = comment.boosts ?? 0;
                let boosterUsers = comment.boostedBy ? { ...comment.boostedBy } : {};

                if (boosterUsers[userEmail]) {
                  currentBoosts = Math.max(0, currentBoosts - 1);
                  delete boosterUsers[userEmail];
                } else {
                  currentBoosts += 1;
                  boosterUsers[userEmail] = true;
                }

                console.log("Updating comment boosts:", { ...comment, boosts: currentBoosts, boostedBy: boosterUsers });

                // Update comment boosts in Firebase

                await update(commentRef, {
                  boosts: currentBoosts,
                  boostedBy: boosterUsers
                });

                // Update the UI

                let boostCountEl = document.querySelector(`.ca.boosts.boosts-count[data-id="${commentId}"]`);
                if (boostCountEl) boostCountEl.textContent = currentBoosts;

                console.log("Comment boost updated successfully!");
              } catch (error) {
                console.error("Error updating comment boosts:", error);
              }
            }

            // Event delegation for comment boosts

            document.addEventListener("click", async (event) => {
              let boostBtn = event.target.closest(".ca-option.boosts");
              if (!boostBtn) return;

              let commentId = boostBtn.getAttribute("data-id");

              if (!commentId || !activePostId) return;

              let userEmail = activeSession.email.replace(/\./g, "_");

              if (boostBtn.classList.contains("processing")) return;
              boostBtn.classList.add("processing");

              await handleCommentBoosts(activePostId, commentId, userEmail);

              boostBtn.classList.remove("processing");
            });

            // Delete comment

            setTimeout(() => {
              const comments = document.querySelectorAll(".comment");

              if (comments) {
                comments.forEach(commentEl => {
                  const deleteComment = commentEl.querySelector(".ca.delete-comment");

                  deleteComment.addEventListener("click", (event) => {
                    let comment = event.target.closest(".comment");
                    if (!comment) return;

                    let commentsList = comment.closest(".comments-list");
                    if (!commentsList) return;

                    let postHeader = commentsList.previousElementSibling;
                    if (!postHeader || !postHeader.classList.contains("post-header")) return;

                    let post = postHeader.querySelector(".post");
                    if (!post) return;

                    let postIdToDeleteComment = post.dataset.id;
                    let commentIdToDelete = comment.dataset.id;

                    if (confirm("Delete comment?")) {
                      const commentRef = ref(db, "posts/" + postIdToDeleteComment + "/comments/" + commentIdToDelete);
                      const postRef = ref(db, "posts/" + postIdToDeleteComment);

                      remove(commentRef)
                        .then(async () => {
                          console.log(`Comment:${commentIdToDelete} of Post:${postIdToDeleteComment} deleted successfully`);

                          // Fetch the latest comments count

                          const postSnapshot = await get(postRef);
                          if (postSnapshot.exists()) {
                            let postData = postSnapshot.val();
                            let currentCommentCount = postData.commentsCount ?? 0;
                            let newCommentCount = Math.max(0, currentCommentCount - 1); // Ensure count doesn't go negative

                            // Update comment count in the database

                            await update(postRef, { commentsCount: newCommentCount });

                            // Update comment count in UI

                            let commentCountElement = post.querySelector(".post-analytics .pa.comments .count");
                            if (commentCountElement) {
                              commentCountElement.textContent = newCommentCount;
                            }

                            loadComments(postIdToDeleteComment);
                          }
                        })
                        .catch(error => console.error("Error deleting comment:", error));
                    }
                  });
                });
              }
            }, 500);
          };

          // Close comments and reset functions

          document.querySelector(".close-comments").addEventListener("click", () => {
            content_nav.classList.remove("hide");

            postComments.classList.remove("active");

            // Reset active post ID

            activePostId = null;

            // Clear comment input

            commentBody.innerHTML = "";

            // Clear comments list

            const commentsList = postComments.querySelector(".comments-list");
            commentsList.innerHTML = "";
          });

          // Ensure event listener is attached only once

          commentForm.addEventListener("submit", handleSubmitComment);

          // Helper function for handling comments

          async function handleSubmitComment(event) {
            event.preventDefault();
            event.stopPropagation();
            await handleComments(activePostId, commentBody.innerHTML);
          };

          // Listen for comment button clicks

          document.addEventListener("click", (e) => {
            if (e.target.closest(".pa.comments")) {
              openComments(e.target.closest(".post"));
            }
          });

          // Function to add a comment

          async function handleComments(postId, commentText) {
            if (!postId || !commentText) return;

            let refreshComments;

            const commentsList = document.querySelector(".comments-list");
            const tagName = activeSession.email.replace(/@.*/, "");

            const userRef = ref(db, "users/" + safeEmail);
            const postRef = ref(db, "posts/" + postId);
            const commentsRef = ref(db, "posts/" + postId + "/comments");

            try {

              // Fetch user data

              const userSnapshot = await get(userRef);
              if (!userSnapshot.exists()) return;

              const userData = userSnapshot.val();
              const userTier = userData.tier;
              const userName = userData.name;
              const userAvatar = userData.avatar;

              // Fetch current post data

              const postSnapshot = await get(postRef);
              if (!postSnapshot.exists()) {
                alert("Post not found.");
                return;
              }

              const postData = postSnapshot.val();
              const currentComments = postData.comments || {}; // Ensure comments exist
              const currentCommentsCount = Number(postData.commentsCount || 0); // Ensure it's a number

              // Create new comment with a unique key

              const newCommentRef = push(commentsRef);
              const commentId = newCommentRef.key;

              const newCommentData = {
                id: commentId,
                commenter_tier: userTier,
                commenter_avatar: userAvatar,
                commenter_name: userName,
                commenter_tagname: tagName,
                body: commentText,
                boosts: 0,
                boostedBy: {},
                views: 0,
                timestamp: Date.now()
              };

              // Save new comment object in database

              await set(newCommentRef, newCommentData);

              // Update comment count separately

              await update(postRef, {
                commentsCount: currentCommentsCount + 1,
                ["comments/" + commentId]: newCommentData
              });

              // Clear input field

              commentBody.innerText = "";

              addCommentToUI(postId, newCommentData);

              refreshComments = setTimeout(() => {
                loadComments(activePostId);
                clearTimeout(refreshComments);
              }, 500);
            } catch (error) {
              console.error("Error adding comment:", error);
            }
          }

          // Add new comment

          function addCommentToUI(commentId, commentData) {
            const commentsList = document.querySelector(".comments-list");
            if (!commentsList) return;

            const comment = commentData;

            // Tier marks

            const tierMarks = {
              T2: `<span style="color: var(--primary); font-size: 16px;" class="ms-rounded">verified</span>`,
              T3: `<span style="color: var(--secondary); font-size: 18px;" class="ms-rounded">award_star</span>`
            };

            const commentElement = document.createElement("div");
            commentElement.classList.add("comment");
            commentElement.dataset.id = commentId;
            commentElement.innerHTML = `
              <div class="commenter-info">
                <img class="commenter-pfp" src="${comment.commenter_avatar}" alt="user_pfp">
                <span class="commenter-name">
                  ${comment.commenter_name} ${tierMarks[comment.commenter_tier] || ""}
                  <span class="commenter-tagname">${"@" + comment.commenter_tagname}</span>
                </span>
                <span>•</span>
                <span class="time-commented" data-id="${commentId}" data-timestamp="${comment.timestamp  ||  Date.now()}">${formatTime(comment.timestamp)}</span>
              </div>
              <span class="commenter-comment">${comment.body}</span>
              <div class="comment-analytics">
                <div class="ca-option boosts" data-id="${commentId}">
                  <span class="ca boosts boosts-count" data-id="${commentId}">${comment.boosts}</span>
                  <span class="ms-rounded">flash_on</span>
                </div>
                <div class="ca-option">
                  <span class="ca views">0</span>
                  <span class="ms-rounded">bar_chart</span>
                </div>
                <span class="ms-rounded ca delete-comment data-id=${commentId}">delete</span>
              </div>
            `;

            commentsList.appendChild(commentElement);
          }

          // Function to load and display comments

          async function loadComments(postId) {
            const commentsList = document.querySelector(".comments-list");
            if (!commentsList) return;

            commentsList.innerHTML = ""; // Clear previous comments

            const commentsRef = ref(db, "posts/" + postId + "/comments");

            // Tier marks

            const tierMarks = {
              T2: `<span style="color: var(--primary); font-size: 16px;" class="ms-rounded">verified</span>`,
              T3: `<span style="color: var(--secondary); font-size: 18px;" class="ms-rounded">award_star</span>`
            };

            try {
              const commentsSnapshot = await get(commentsRef);
              if (!commentsSnapshot.exists()) return;

              const commentsData = commentsSnapshot.val();

              Object.keys(commentsData).forEach(commentId => {
                const comment = commentsData[commentId];

                if (document.querySelector(`.comment[data-id="${commentId}"]`)) return;

                const commentElement = document.createElement("div");
                commentElement.classList.add("comment");
                commentElement.dataset.id = commentId; // Store comment ID for future actions
                commentElement.innerHTML = `
                  <div class="commenter-info">
                    <img class="commenter-pfp" src="${comment.commenter_avatar}" alt="user_pfp">
                    <span class="commenter-name">
                      ${comment.commenter_name} ${tierMarks[comment.commenter_tier] || ""}
                      <span class="commenter-tagname">${"@" + comment.commenter_tagname}</span>
                    </span>
                    <span>•</span>
                    <span class="time-commented" data-id="${commentId}" data-timestamp="${comment.timestamp  ||  Date.now()}">${formatTime(comment.timestamp)}</span>
                  </div>
                  <span class="commenter-comment">${comment.body}</span>
                  <div class="comment-analytics">
                    <div class="ca-option boosts" data-id="${commentId}">
                      <span class="ca boosts boosts-count" data-id="${commentId}">${comment.boosts}</span>
                      <span class="ms-rounded">flash_on</span>
                    </div>
                    <div class="ca-option">
                      <span class="ca views">0</span>
                      <span class="ms-rounded">bar_chart</span>
                    </div>
                    <span class="ms-rounded ca delete-comment" data-id="${commentId}">delete</span>
                  </div>
                `;

                commentsList.appendChild(commentElement);
              });

            } catch (error) {
              console.error("Error loading comments:", error);
            }
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
              postElement.dataset.id = `post-${postId}`;

              // Author tier marks

              const tierMarks = {
                T2: `<span style="color: var(--primary); font-size: 16px;" class="ms-rounded">verified</span>`,
                T3: `<span style="color: var(--secondary); font-size: 18px;" class="ms-rounded">award_star</span>`
              };

              // Saved post HTML template

              postElement.innerHTML = `
                <div class="post-col-1">
                  <img src="${post.author_avatar}" alt="author-pfp">
                </div>
                
                <div class="post-col-2">
                  <div class="author">
                    <span class="author-name" data-email="${post.user_email}">
                      ${((post.author_tier === "T2") ? 
                      post.author_name + " " + tierMarks.T2 
                      : (post.author_tier === "T3") ?
                      post.author_name + " " + tierMarks.T3 
                      : post.author_name) || "loading..."}
                      <span class="author-tagname">${post.author_tagname}</span>
                    </span>
                    <span>•</span>
                    <span class="time-posted" data-id="${postId}" data-timestamp="${post.time_posted  ||  Date.now()}">${formatTime(post.time_posted)}</span>
                  </div>
                  
                  <div class="post-body" data-id="post-${postId}">${post.body}</div>
                  
                  <div class="post-analytics">
                    <div class="pa comments"><span class="count">${post.commentsCount  ||  0}</span><span class="ms-rounded">quickreply</span></div>
                    <div class="pa boosts data-id="${postId}"><span>${post.boosts  ||  0}</span><span class="ms-rounded">flash_on</span></div>
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

            // const safeEmail = activeSession.email.replace(/\./g, "_");

            // Unsave post

            function handleUnsave(event) {
              let postId = event.currentTarget.getAttribute("data-id");
              removeSavedPost(postId, safeEmail);
            }
          }

          // const safeEmail = activeSession?.email.replace(/\./g, "_");
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

            if (seconds < 60) return `${seconds}s`;
            const minutes = Math.floor(seconds / 60);
            if (minutes < 60) return `${minutes}m`;
            const hours = Math.floor(minutes / 60);
            if (hours < 24) return `${hours}h`;
            const days = Math.floor(hours / 24);
            if (days <= 6) return `${days}d`;

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

          // Comment time

          function formatCommentTime(timestamp) {

            // If no valid/running timestamp return "Just now"

            if (!timestamp || isNaN(timestamp) || timestamp < 10000000000) {
              return "Just now";
            }

            const now = Date.now();
            const seconds = Math.floor((now - timestamp) / 1000);

            if (seconds < 60) return `${seconds}s`;
            const minutes = Math.floor(seconds / 60);
            if (minutes < 60) return `${minutes}m`;
            const hours = Math.floor(minutes / 60);
            if (hours < 24) return `${hours}h`;
            const days = Math.floor(hours / 24);
            if (days <= 6) return `${days}d`;

            return new Date(timestamp).toLocaleDateString("en-GB"); // dd/mm/yyyy
          }

          // Update comment time

          function updateCommentTimes() {
            document.querySelectorAll(".comment .time-commented").forEach(timeEl => {
              const postId = timeEl.dataset.id;
              const timestamp = parseInt(timeEl.dataset.timestamp);

              if (timestamp) {
                timeEl.innerText = formatCommentTime(timestamp);
              }
            });
          }

          // Run every second to update timestamps in real-time

          setInterval(updateCommentTimes, 1000);
        } else {

          // Restrict content

          alert("Please verify your email to access content.");
        }
      });
    } else {

      // Signed out

      UI.loader.classList.remove("active");
      UI.hero.classList.remove("await-auth");
      UI.auth_content.classList.remove("active");
    }
  });
});

// Toggle password visibility

const togglePasswordVisibility = document.querySelector(".toggle-password-visibility");
const visualSwitch = togglePasswordVisibility.querySelector(".visual-switch");

togglePasswordVisibility.addEventListener("click", (event) => {
  const inputWrapper = event.target.closest(".input");
  const input = inputWrapper.querySelector("input");
  if (input.type === "password") {
    input.type = "text";
    visualSwitch.textContent = "visibility";
  } else {
    input.type = "password";
    visualSwitch.textContent = "visibility_off";
  }
});

// Reset password

const resetPasswordFormWrapper = document.querySelector(".resetPasswordForm-wrapper");
const forgotPassword = document.querySelector(".forgot-password");

if (forgotPassword) {
  forgotPassword.addEventListener("click", () => {
    resetPasswordFormWrapper.classList.add("active");
  });
}

// Cancel password reset and navigate back to signin form

const backToSignin = document.querySelector(".back-to-signin");
if (backToSignin) {
  backToSignin.addEventListener("click", () => {
    resetPasswordFormWrapper.classList.remove("active");
  });
}
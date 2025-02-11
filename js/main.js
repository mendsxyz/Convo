// Main
const main = document.querySelector("main");

// Nav toggle
const bottomBar = document.querySelector("nav.bottombar.xs-sm-md");
const bb_toggle = document.querySelector(".bottombar-toggle");
const cta_btn = document.querySelector("#ctaBtn");

if (!bottomBar || !bb_toggle || !cta_btn) {
  console.error("One or more elements not found in the DOM.");
} else {
  bb_toggle.addEventListener("click", () => {
    bottomBar.classList.toggle("active");
    if (bottomBar.classList.contains("active")) {
      main.addEventListener("click", menuOpenOk_touchBg);
    }
  });

  cta_btn.addEventListener("click", () => {
    bottomBar.classList.toggle("active");
    main.addEventListener("click", (e) => {
      if (main.contains(e.target)) {
        main.addEventListener("click", menuOpenOk_touchBg);
      }
    });
  });

  function menuOpenOk_touchBg(e) {
    if (main.contains(e.target)) {
      bottomBar.classList.remove("active");
      main.removeEventListener("click", menuOpenOk_touchBg);
    }
  }
}

// Google sign in function
let googleUser = {};
const signInBtn = document.querySelector("#signInBtn");

let startApp = function() {
  gapi.load("auth2", function() {
    // Client setup
    auth2 = gapi.auth2.init({
      client_id: "754387532769-2vrnrga8vunfjk7hbislp168u36hjsr2.apps.googleusercontent.com",
      cookiepolicy: "single_host_origin",
      scope: "profile email"
    });
    attachSignin(signInBtn);
  });
};

function attachSignin(element) {
  console.log("Attaching sign-in handler to:", element.id);
  auth2.attachClickHandler(element, {},
    function(googleUser) {
      const profile = googleUser.getBasicProfile();

      const userName = document.querySelector("#gUserName");
      userName.innerText = profile.getName();

      /*const userAvatar = null;
      const userEmail = null;*/
    },
    function(error) {
      console.error("Sign-in error:", error);
      console.log(JSON.stringify(error, undefined, 2));
    }
  );
}

function signOut() {
  let auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function() {
    console.log('User signed out.');
    document.querySelector("#userName").innerText = "--";
  });
}

startApp();

// UI actions

const UI = {
  settingsBtn: document.querySelectorAll(".settingsBtn"),
  accountBtn: document.querySelectorAll(".accountBtn"),
  helpBtn: document.querySelectorAll(".helpBtn"),
  signOutBtn: document.querySelectorAll(".signOutBtn")
}

UI.settingsBtn.forEach(btn => {
  btn.addEventListener("click", () => {
    alert("200")
  });
});

UI.signOutBtn.forEach(btn => {
  btn.addEventListener("click", signOut);
});
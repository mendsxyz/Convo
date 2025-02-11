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

let startApp = function() {
  gapi.load("auth2", function() {
    // Retrieve the singleton for the GoogleAuth library and set up the client.
    auth2 = gapi.auth2.init({
      client_id: "754387532769-2vrnrga8vunfjk7hbislp168u36hjsr2.apps.googleusercontent.com",
      cookiepolicy: "single_host_origin",
      scope: "profile email https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/drive.readonly"
    });
    attachSignin(document.querySelector("#signInBtn"));
  });
};

function onSignIn(googleUser) {
  let profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId());
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail());
}

function attachSignin(element) {
  console.log(element.id);
  auth2.attachClickHandler(element, {},
  function(googleUser) {
    document.querySelector(".name").innerText = "Signed in: " +
    googleUser.getBasicProfile().getName();
    
    // Sign in successful
    
  },
  function(error) {
    alert(JSON.stringify(error, undefined, 2));
  });
}

const signOutBtn = document.querySelector("#signOutBtn");
signOutBtn.addEventListener("click", signOut);

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });
}

startApp();
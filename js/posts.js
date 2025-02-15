// Posts Object Array

const postsData = JSON.parse(localStorage.getItem("postsData")) || [];
const contentView = document.querySelector(".content-view");

const posts = {
  "2": {
    title: "Post 2 title",
    body: "Post 2 body content"
  },
  "1": {
    title: "Post 1 title",
    body: "Post 1 body content"
  }
};

// Loop through the object correctly

for (const [key, post] of Object.entries(posts)) {
  function postBlob() {
    return `
      <div class="post-author">
        <div class="author-pfp">
          <img src="${post.imgSrc}" alt="author-pfp">
        </div>
        <div class="author-info">
          <span class="emailUsername">${post.userName}</span>
          <span class="postedTime">${post.time}</span>
        </div>
      </div>
      <span class="post-body">${post.body}</span>
      <div class="post-img">${post.img ? post.img : ""}</div>
      <div class="post-analytics">
        <div class="favorites-count">
          <span class="ms-rounded">heart</span>
          <span class="fc-txt">${post.favCount}</span>
        </div>
      </div>
    `;
  }

  // Append to innerHTML correctly
  
  contentView.innerHTML += postBlob();
}
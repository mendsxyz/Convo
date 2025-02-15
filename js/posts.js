// Posts Object Array

const contentView = document.querySelector(".content-view");

const posts = {
  "2": {
    "title": "Post 2 title",
    "body": "Post 2 body content"
  },
  "1": {
    "title": "Post 1 title",
    "body": "Post 1 body content"
  }
};

// Loop through the object correctly

for (const [key, post] of Object.entries(posts)) {
  function postBlob() {
    return `
      <div class="post">
        <span class="post-title">${post.title}</span>
        <span class="post-body">${post.body}</span>
      </div>
    `;
  }

  // Append to innerHTML correctly
  
  contentView.innerHTML += postBlob();
}
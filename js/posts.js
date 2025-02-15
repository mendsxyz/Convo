// Posts Object Array

const contentView = document.querySelector(".content-view");

const posts = {
  
  //--2
  "1": {
    "title": "Post 1 title",
    "body": "Post 1 body content"
  }
  //--1
}

for (const post of posts) {
  function postBlob() {
    return `
      <div>
        <span class="post-title">${post[index].title}</span>
        <span class="post-body">${post[index].body}</span>
      </div>
    `
  }
  
  contentView.innerHTML = postBlob();
}
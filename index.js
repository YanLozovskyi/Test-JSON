// main.js
const refs = {
  formEl: document.getElementById("blogForm"),
  postList: document.querySelector(".post-list"),
  portal: document.getElementById("portal"),
};

// api.js
class BlogPostAPI {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
  }

  // Отримує всі пости
  async getAllPosts() {
    try {
      const response = await fetch(`${this.apiUrl}?_limit=10`);
      const data = await response.json();
      console.log("All Posts:", data);
      data.forEach((post) => addPostToDOM(post));
    } catch (error) {
      console.error("Error fetching all posts:", error);
    }
  }

  // Отримує один пост за айди
  async getPostById(id) {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`);
      const data = await response.json();
      console.log("Post by ID:", data);
    } catch (error) {
      console.error(`Error fetching post with ID ${id}:`, error);
    }
  }

  // Створює новий пост
  async createPost(post) {
    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(post),
      });
      const data = await response.json();

      addPostToDOM(data);

      console.log("New Post:", data);
    } catch (error) {
      console.error("Error creating new post:", error);
    }
  }

  // Оновлює пост за айді
  async updatePost(id, post) {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(post),
      });
      const data = await response.json();
      console.log("Updated Post:", data);
      const listItem = document.getElementById(`post${id}`);

      const title = listItem.querySelector(".post-title");
      const body = listItem.querySelector(".post-body");

      title.textContent = data.title;
      body.textContent = data.body;
    } catch (error) {
      console.error(`Error updating post with ID ${id}:`, error);
    }
  }

  // Видаляє пост
  async deletePost(id) {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      document.getElementById(`post${id}`).remove();
      console.log(`Post with ID ${id} deleted successfully.`);
    } catch (error) {
      console.error(`Error deleting post with ID ${id}:`, error);
    }
  }
}

// dom.js
const addPostToDOM = ({ title, id, body }) => {
  const postHTML = `
    <li class="post-item" id='post${id}'>
      <h2 class="post-title">${title}</h2>
      <p class="post-text">id: ${id}</p>
      <p class="post-text post-body">${body}</p>
     <div class="button-wrapper">
      <button class="open-button" id="${id}" type="button">Open</button>
      <button class="delete-button" id="${id}" type="button">Delete</button>
      <button class="edit-button" id="${id}" type="button">Edit</button>
     </div>
    </li>
  `;

  refs.postList.insertAdjacentHTML("beforeend", postHTML);
};

function handleButtonClick(e) {
  if (e.target.tagName === "BUTTON") {
    const postId = e.target.id;
    const className = e.target.className;

    const listItem = document.getElementById(`post${postId}`);

    const title = listItem.querySelector(".post-title");
    const body = listItem.querySelector(".post-body");
    if (postId) {
      if (className.includes("open-button")) {
        blogPostApi.getPostById(postId);
        refs.portal.insertAdjacentHTML(
          "beforeend",
          `<div class="backdrop">
          <div class="card-modal">
          <button class="modal-close-btn" type="button">
          <svg width="15" height="15">
             <use href="./images/sprite.svg#icon-close"></use>
           </svg>
          </button>
          <h2 class="post-title">${title.textContent}</h2>
          <p class="post-text">id: ${postId}</p>
          <p class="post-text post-body">${body.textContent}</p>
          </div>
        </div>`
        );

        document
          .querySelector(".modal-close-btn")
          .addEventListener("click", () => {
            refs.portal.innerHTML = "";
          });
      } else if (className.includes("delete-button")) {
        blogPostApi.deletePost(postId);
      } else if (className.includes("edit-button")) {
        refs.portal.insertAdjacentHTML(
          "beforeend",
          `<div class="backdrop">
          <div class="update-modal">
          <button class="modal-close-btn" type="button">
             <svg width="15" height="15">
               <use href="./images/sprite.svg#icon-close"></use>
             </svg>
          </button>
            <form class="update-form" id="updateForm">
              <label for="up_title">Title:</label>
              <input type="text" id="up_title" name="up_title" />

              <label for="up_body">Content:</label>
              <textarea id="up_body" name="up_body"></textarea>
              <button class="form-button" type="submit">Save</button>
            </form>
          </div>
        </div>`
        );

        document
          .querySelector(".modal-close-btn")
          .addEventListener("click", () => {
            refs.portal.innerHTML = "";
          });

        const updateForm = document.getElementById("updateForm");
        updateForm.addEventListener("submit", (event) => {
          event.preventDefault();

          const updatedTitle = document.getElementById("up_title").value;
          const updatedBody = document.getElementById("up_body").value;

          if (updatedTitle && updatedBody) {
            blogPostApi.updatePost(postId, {
              title: updatedTitle,
              body: updatedBody,
            });

            updateForm.reset();
            refs.portal.innerHTML = "";
          }
        });
      }
    }
  }
}

refs.postList.addEventListener("click", handleButtonClick);

const submitFormHandler = (e) => {
  e.preventDefault();

  const formDataObj = {};
  const formData = new FormData(refs.formEl);

  formData.forEach((value, key) => {
    formDataObj[key] = value;
  });

  e.currentTarget.reset();

  blogPostApi.createPost(formDataObj);
};

refs.formEl.addEventListener("submit", submitFormHandler);

const blogPostApi = new BlogPostAPI(
  "https://jsonplaceholder.typicode.com/posts"
);

blogPostApi.getAllPosts();
// blogPostApi.getPostById(2);
// blogPostApi.createPost({
//   title: "New Post",
//   body: "This is a new post.",
//   userId: 1,
// });
// blogPostApi.updatePost(1, {
//   title: "Updated Post",
//   body: "This post has been updated.",
// });
// blogPostApi.deletePost(1);

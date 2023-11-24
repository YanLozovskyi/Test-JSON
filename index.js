const refs = {
  formEl: document.getElementById("blogForm"),
  postList: document.querySelector(".post-list"),
};

const addPostToDOM = ({ title, id, body }) => {
  const postHTML = `
      <li class="post-item">
        <h2 class="post-title">${title}</h2>
        <p class="post-text">id: ${id}</p>
        <p class="post-text">${body}</p>
        <button class="delete-button" type="button">Delete</button>
      </li>
    `;

  refs.postList.insertAdjacentHTML("beforeend", postHTML);
};

const submitFormHandler = (e) => {
  e.preventDefault();

  const formDataObj = {};
  const formData = new FormData(refs.formEl);

  formData.forEach((value, key) => {
    console.log(key, value);
    formDataObj[key] = value;
  });

  console.log("dannie z formi", formDataObj);

  e.currentTarget.reset();

  blogPostApi.createPost(formDataObj);
};

refs.formEl.addEventListener("submit", submitFormHandler);

class BlogPostAPI {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
  }

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

  async getPostById(id) {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`);
      const data = await response.json();
      console.log("Post by ID:", data);
    } catch (error) {
      console.error(`Error fetching post with ID ${id}:`, error);
    }
  }

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

  async updatePost(id, post) {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(post),
      });
      const data = await response.json();
      console.log("Updated Post:", data);
    } catch (error) {
      console.error(`Error updating post with ID ${id}:`, error);
    }
  }

  async deletePost(id) {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: "DELETE",
      });
      console.log(`Post with ID ${id} deleted successfully.`);
    } catch (error) {
      console.error(`Error deleting post with ID ${id}:`, error);
    }
  }
}

const blogPostApi = new BlogPostAPI(
  "https://jsonplaceholder.typicode.com/posts"
);

blogPostApi.getAllPosts();
// blogPostApi.getPostById(2);
// blogPostApi.createPost({ title: "New Post", body: "This is a new post.", userId: 1 });
// blogPostApi.updatePost(1, { title: "Updated Post", body: "This post has been updated." });
// blogPostApi.deletePost(1);

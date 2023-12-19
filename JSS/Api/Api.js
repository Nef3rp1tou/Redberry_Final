// JSS/Api/Api.js

const apiBaseUrl = 'https://api.blog.redberryinternship.ge/api';
const token = "bddfb9c3a63376dbc4d41d6bcf3a539b5b4ebb7f698fba7b161dc156557977aa";

// Function to create a new blog
function createBlog(blogData) {
  return fetch(`${apiBaseUrl}/blogs`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(blogData)
  })
  .then(response => response.json());
}

// Function to get all blogs from API
function getAllBlogsFromApi() {
  return fetch(`${apiBaseUrl}/blogs`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(response => response.json())
  .then(blogsFromApi => {
    displayBlogs(blogsFromApi, 'blogs-container-api');
  })
  .catch(error => console.error('Error fetching blogs from API:', error));
}

// Function to get all blogs from JSON file
function getAllBlogsFromJson() {
  return fetch('Data/Blogs.json')
    .then(response => response.json())
    .then(data => data.data)
    .then(blogsFromJson => {
      displayBlogs(blogsFromJson, 'blogs-container-json');
    })
    .catch(error => console.error('Error fetching blogs from JSON file:', error));
}

// Example blog data to be sent in a POST request
const blogData = {
  title: "My New Blog Post",
  content: "Content of the new blog post",
  // Add other required blog fields here
};

// Call this function to create a new blog
createBlog(blogData).then(response => {
  console.log('Blog created:', response);
});

// Call this function to fetch all blogs from the API
getAllBlogsFromApi();

// Call this function to fetch all blogs from the JSON file
getAllBlogsFromJson();

// Function to display blogs
function displayBlogs(blogs, containerId) {
  const blogContainer = document.getElementById(containerId);

  // Clear the container before displaying new blogs
  blogContainer.innerHTML = '';

  // Iterate through the blogs and display them
  blogs.forEach(blog => {
    const blogDiv = document.createElement('div');
    blogDiv.innerHTML = `
        <h2>${blog.title}</h2>
        <p>${blog.description}</p>
        <img src="${blog.image}" alt="${blog.title}">
        <p>Publish Date: ${blog.publish_date}</p>
        <p>Author: ${blog.author}</p>
    `;

    // Add additional logic to display categories if needed

    blogContainer.appendChild(blogDiv);
  });
}

// JSS/Api/Api.js

const apiBaseUrl = 'https://api.blog.redberryinternship.ge/api';
const token = "bddfb9c3a63376dbc4d41d6bcf3a539b5b4ebb7f698fba7b161dc156557977aa";


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



export {apiBaseUrl, token};

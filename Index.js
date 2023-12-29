document.addEventListener('DOMContentLoaded', function() {
    // Fetch the blogs when the page loads
    getBlogs().then(blogs => {
      const container = document.getElementById('blog-container');
      blogs.forEach(blog => {
        // Create a div or any other element for each blog
        const blogElement = document.createElement('div');
        blogElement.innerHTML = `<h2>${blog.title}</h2><p>${blog.content}</p>`; // Adjust according to your blog's properties
        container.appendChild(blogElement);
      });
    });
  });
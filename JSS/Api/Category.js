const apiBaseUrl = 'https://api.blog.redberryinternship.ge/api';
const token = "bddfb9c3a63376dbc4d41d6bcf3a539b5b4ebb7f698fba7b161dc156557977aa";

// Function to get all categories
function getAllCategories() {
  return fetch(`${apiBaseUrl}/categories`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Failed to fetch categories. Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => data.data)
  .catch(error => {
    console.error('Error fetching categories:', error);
    return [];
  });
}

// Function to display categories
function displayCategories(categories) {
  const categoriesContainer = document.getElementById('categories-container');
  
  // Clear the container before displaying new categories
  categoriesContainer.innerHTML = '';

  // Iterate through the categories and display them
  categories.forEach(category => {
    const categoryDiv = document.createElement('div');
    categoryDiv.classList.add('category-item');
    categoryDiv.style.backgroundColor = category.background_color;
    categoryDiv.style.color = category.text_color;
    categoryDiv.innerText = category.title;

    categoriesContainer.appendChild(categoryDiv);
  });
}

// Call this function to fetch and display categories
getAllCategories().then(displayCategories);

// You can add more functions as needed for your application

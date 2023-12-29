import { token, apiBaseUrl } from "./Api.js";

// Function to get all categories
export function getAllCategories() {
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


function displayCategories(categories) {
  const categoriesContainer = document.getElementById('categories-container');

  categoriesContainer.innerHTML = '';


  categories.forEach(category => {
    const categoryDiv = document.createElement('div');
    categoryDiv.classList.add('category-item');
    categoryDiv.style.backgroundColor = category.background_color;
    categoryDiv.style.color = category.text_color;
    categoryDiv.innerText = category.title;

    categoriesContainer.appendChild(categoryDiv);
  });
}

export function populateCategoryDropdown() {
  getAllCategories().then(categories => {
    const dropdown = document.getElementById('categories-dropdown');
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category.id; // Assuming each category has an id
      option.textContent = category.title;
      dropdown.appendChild(option);
    });
  });
}


getAllCategories().then(displayCategories);



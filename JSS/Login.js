import { token, apiBaseUrl } from "./Api.js";
const regex = /^[a-zA-Z0-9._%+-]+@redberry\.ge$/i;

// Helper function to toggle styles for blurred elements
const toggleBlurredStyles = (elements, isVisible) => {
  const displayStyle = isVisible ? "none" : "auto";
  elements.forEach(el => {
    el.classList.toggle('blur-effect', isVisible);
    el.style.pointerEvents = displayStyle;
    el.style.userSelect = displayStyle;
  });
};

// Function to toggle display of an element
const toggleDisplay = (containerId) => {
  const container = document.getElementById(containerId);
  const elementsToBlur = document.querySelectorAll(`body > *:not(#${containerId})`);
  const isContainerVisible = container.style.display === "block";
  
  container.style.display = isContainerVisible ? "none" : "block";
  toggleBlurredStyles(elementsToBlur, !isContainerVisible);

  // If the container is being closed, check if it's the login container and reset the form
  if (!isContainerVisible && containerId === "login-container") {
    resetLoginForm();
  }
};

// Re-used function to close displays
const closeDisplay = (containerId) => toggleDisplay(containerId);

window.toggleLoginForm = () => toggleDisplay("login-container");
window.closeLoginForm = () => closeDisplay("login-container");
window.toggleSuccessfulLogin = () => toggleDisplay("SuccessfulLogin");
window.closeSuccessfulLogin = () => closeDisplay("SuccessfulLogin");
window.logout = () => {
  // Clear the token from localStorage
  localStorage.removeItem('authToken');
  sessionStorage.clear();
};

// Function to reset the login form
const resetLoginForm = () => {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.reset(); // Reset the form fields
    const emailInput = document.getElementById('email');
    emailInput.style.backgroundColor = ""; // Reset background color
    emailInput.style.border = ""; // Reset border
    emailInput.classList.remove('error'); // Remove error class

    const loginError = document.getElementById("loginError");
    loginError.style.display = "none"; // Hide the login error message
  }
};

// Validate email function
const setAuthToken = (token) => {
  localStorage.setItem('authToken', token);
};

const checkLoggedIn = () => {
  const authToken = localStorage.getItem('authToken');
  if (authToken) {
    toggleDisplay("SuccessfulLogin");
    closeDisplay("SuccessfulLogin");
    changeButtonToAddBlog();
  }
};

document.addEventListener('DOMContentLoaded', checkLoggedIn);

const changeButtonToAddBlog = () => {
  const oldLoginButton = document.getElementById('login-btn');
  const addBlogButton = document.createElement('button');
  addBlogButton.textContent = 'ბლოგის დამატება';
  addBlogButton.id = 'add-blog-btn';
  addBlogButton.classList.add('add-blog-button');
  
  const navigateToAddBlogPage = () => {
    window.location.href = 'addBlog.html';
  };

  addBlogButton.addEventListener('click', navigateToAddBlogPage);

  oldLoginButton.parentNode.replaceChild(addBlogButton, oldLoginButton);
};

document.getElementById('submit').addEventListener('click', function(event) {
  event.preventDefault();
  var email = document.getElementById('email').value;
  
  const loginError = document.getElementById("loginError");
  const errorMsg = document.getElementById("error-message");

  const setEmailErrorStyles = () => {
    document.getElementById('email').style.backgroundColor = "#FAF2F3";
    document.getElementById('email').style.border = "1.5px solid red";
    document.getElementById('email').classList.add('error');
  };

  if (email === '') {
    loginError.style.display = "block";
    errorMsg.textContent = "გთხოვთ შეიყვანოთ ელ-ფოსტა";
    setEmailErrorStyles();
  } else {
    fetch(`${apiBaseUrl}/login`, {
      method: "POST",
      headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`},
      body: JSON.stringify({ email })
    })
    .then((response) => {
      if (response.status === 204) {
        // Save the token in localStorage
        setAuthToken('yourAuthToken'); // Replace 'yourAuthToken' with the actual token you receive from the server
        
        closeDisplay("login-container");
        toggleDisplay("SuccessfulLogin");
        changeButtonToAddBlog();
      } else if (!regex.test(email)) {
        loginError.style.display = "block";
        errorMsg.textContent = "ელ-ფოსტა უნდა მთავრდებოდეს @redberry.ge";
        setEmailErrorStyles();
      } else {
        loginError.style.display = "block";
        errorMsg.textContent = "ელ-ფოსტა არ მოიძებნა";
        setEmailErrorStyles();
      }
    })
    .catch(() => {
      loginError.style.display = "block";
      errorMsg.textContent = "Network error: Please check your internet connection.";
      setEmailErrorStyles();
    });
  }
});

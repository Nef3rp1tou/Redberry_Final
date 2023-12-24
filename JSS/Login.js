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

const toggleDisplay = (containerId) => {
  const container = document.getElementById(containerId);
  const elementsToBlur = document.querySelectorAll(`body > *:not(#${containerId})`);
  const isContainerVisible = container.style.display === "block";
  
  container.style.display = isContainerVisible ? "none" : "block";
  toggleBlurredStyles(elementsToBlur, !isContainerVisible);
};



// Re-used function to close displays
const closeDisplay = (containerId) => toggleDisplay(containerId);

window.toggleLoginForm = () => toggleDisplay("login-container");
window.closeLoginForm = () => closeDisplay("login-container");
window.toggleSuccessfulLogin = () => toggleDisplay("SuccessfulLogin");
window.closeSuccessfulLogin = () => closeDisplay("SuccessfulLogin");
// Validate email function
const validateEmail = (email) => {
  // Replace this with your actual email validation logic (e.g., API call)
  return new Promise((resolve) => {
    // Simulating a delay with setTimeout
    setTimeout(() => {
      const isEmailValid = regex.test(email); // Replace with actual validation logic
      resolve({ success: isEmailValid });
    }, 1000); // Simulated delay of 1 second
  });
};
const changeButtonToAddBlog = () => {
  const oldLoginButton = document.getElementById('login-btn');

  // Create a new button for adding blogs
  const addBlogButton = document.createElement('button');
  addBlogButton.textContent = 'ბლოგის დამატება';
  addBlogButton.id = 'add-blog-btn'; // Assign a new ID or reuse the old one
  addBlogButton.classList.add('add-blog-button'); // Add any necessary classes
  
  // Function to navigate to the new blog page
  const navigateToAddBlogPage = () => {
    window.location.href = 'addBlog.html'; // Replace with the actual path to your new HTML page
  };

  // Add the click event listener to the new button
  addBlogButton.addEventListener('click', navigateToAddBlogPage);

  // Replace the old login button with the new add blog button
  oldLoginButton.parentNode.replaceChild(addBlogButton, oldLoginButton);
};

document.getElementById('submit').addEventListener('click', function(event) {
  event.preventDefault();
  var email = document.getElementById('email').value;
  
  const loginError = document.getElementById("loginError");
  const errorMsg = document.getElementById("error-message");

  const setEmailErrorStyles = () => {
    document.getElementById('email').style.backgroundColor = "#FAF2F3"; // Corrected to target background color
    document.getElementById('email').style.border = "1.5px solid red";
    document.getElementById('email').classList.add('error');
  };

  if (email === '') {
    loginError.style.display = "block";
    errorMsg.textContent = "გთხოვთ შეიყვანოთ ელ-ფოსტა";
    setEmailErrorStyles();
  } else {
    // Fetch request to login API
    fetch(`${apiBaseUrl}/login`, {
      method: "POST",
      headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`},
      body: JSON.stringify({ email })
    })
    .then((response) => {
      if (response.status === 204) {
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


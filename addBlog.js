import { token, apiBaseUrl } from "Api.js";
document.addEventListener('DOMContentLoaded', () => {
function saveInput(inputId) {
    const inputField = document.getElementById(inputId);
    const inputValue = inputField.value.trim();
    sessionStorage.setItem(inputId, inputValue);
}

function loadInput(inputId) {
    const storedValue = sessionStorage.getItem(inputId);
    if (storedValue !== null) {
        const inputField = document.getElementById(inputId);
        inputField.value = storedValue;
    }
}

function checkDateValidity(inputId) {
    const inputField = document.getElementById(inputId);
    const dateValue = inputField.value.trim();

    if (!dateValue) return;
    const isDateValid = dateValue !== '';

    if (isDateValid) {
        clearValidationStyles(inputField);
    } else {
        setValidationStyles(inputField);
    }
    return isDateValid;
}

function setValidationStyles(inputField) {
   
    inputField.style.borderColor = '#EA1919';
    inputField.style.backgroundColor = '#FAF2F3'
}


function clearValidationStyles(inputField) {
 
    inputField.style.borderColor = '#14D81C';
    
    inputField.style.backgroundColor = '#F8FFF8'
    
}

function checkFieldStrength(inputId, criteriaId, minLength) {
    const inputField = document.getElementById(inputId);
    const criteriaMessage = document.getElementById(criteriaId);
    if (!inputField.value.trim()) return;

    const isLengthValid = inputField.value.length >= minLength;

    criteriaMessage.style.color = isLengthValid ? "#14D81C" : "#EA1919";
    inputField.style.borderColor = isLengthValid ? "#14D81C" : "#EA1919";
    inputField.style.backgroundColor = isLengthValid ? "#F8FFF8" : "#FAF2F3";
    return isLengthValid;
}

function checkAuthorCriteria() {
    const inputField = document.getElementById("input-author");
    const criteria1 = document.getElementById("authorCriteria1");
    const criteria2 = document.getElementById("authorCriteria2");
    const criteria3 = document.getElementById("authorCriteria3");
    if (!inputField.value.trim()) return; 

    const fieldValue = inputField.value;
    

    const isLengthValid = fieldValue.length >= 4;
    criteria1.style.color = isLengthValid ? "#14D81C" : "#EA1919";
    inputField.style.backgroundColor = isLengthValid ? "#F8FFF8" : "#FAF2F3";
    const words = fieldValue.split(" ");
    const isWordCountValid = words.length >= 2 && words[1].length > 0;
    criteria2.style.color = isWordCountValid ? "#14D81C" : "#EA1919";
    inputField.style.backgroundColor = isWordCountValid ? "#F8FFF8" : "#FAF2F3";
    const georgianRegex = /^[\u10A0-\u10FF\s]+$/;
    const isGeorgianValid = georgianRegex.test(fieldValue);
    criteria3.style.color = isGeorgianValid ? "#14D81C" : "#EA1919";
    inputField.style.backgroundColor = isGeorgianValid ? "#F8FFF8" : "#FAF2F3";
    inputField.style.borderColor = isLengthValid && isGeorgianValid && isWordCountValid ? "#14D81C" : "#EA1919";
    return isLengthValid && isGeorgianValid && isWordCountValid;
}


function isFormValid() {
    const emailValidator = new EmailValidator();
    const authorValid = checkAuthorCriteria();
    const titleValid = checkFieldStrength('input-title', 'titleCriteria', 2);
    const descriptionValid = checkFieldStrength('input-description-field', 'below-textarea', 2);
    const dateValid = checkDateValidity('enter-date');
    const emailInput = document.getElementById('email-input');
    const emailValid = emailValidator.validateEmail(emailInput.value);

    const allValid = authorValid && titleValid && descriptionValid && dateValid && emailValid;

    console.log('Author Valid:', authorValid);
    console.log('Title Valid:', titleValid);
    console.log('Description Valid:', descriptionValid);
    console.log('Date Valid:', dateValid);
    console.log('Email Valid:', emailValid);

    document.getElementById('publish').disabled = !allValid;

    return allValid;
}


class ImageUploader {
    constructor() {
        this.fileInput = document.getElementById('image');
        this.uploadForm = document.getElementById('upload-image-form');
        this.newForm = document.getElementById('new-form-container');
        this.fileNameLabel = document.getElementById('file-name');
        this.initEventListeners();
        this.restorePreviousUpload();
    }

    handleDragOver(event) {
        event.preventDefault();
        event.stopPropagation();
        this.uploadForm.classList.add('drag-over');
    }

    handleDrop(event) {
        event.preventDefault();
        event.stopPropagation();
        this.uploadForm.classList.remove('drag-over');

        const files = event.dataTransfer.files;
        if (files && files[0]) {
            this.handleFileSelection(files);
        }
    }

    initEventListeners() {
        this.fileInput.addEventListener('change', (event) => this.handleFileSelection(event.target.files));
        this.uploadForm.addEventListener('dragover', this.handleDragOver);
        this.uploadForm.addEventListener('drop', (event) => this.handleDrop(event));
    }

    handleFileSelection(files) {
        if (files.length > 0 && this.validateFile(files[0])) {
            this.displayFileName(files[0].name);
            this.updateFormStyleAfterUpload();
            this.readFileAndStore(files[0]);
        }
    }

    readFileAndStore(file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            sessionStorage.setItem('uploadedFile', event.target.result);
            sessionStorage.setItem('uploadedFileName', file.name);
            this.attachDownloadHandler(event.target.result, file.name);
        };
        reader.readAsDataURL(file);
    }

    validateFile(file) {
        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        const maxSizeInBytes = 5000000; // 5MB

        if (file && validTypes.includes(file.type) && file.size <= maxSizeInBytes) {
            return true;
        } else {
            alert("Invalid file. Please select an image (jpg, png, gif) smaller than 5MB.");
            return false;
        }
    }

    createRemoveButton() {
        const removeButton = document.createElement('button');
        removeButton.type = 'button';
        removeButton.classList.add('remove-button');

        const imageIcon = document.createElement('img');
        imageIcon.id = "ImageIcon";
        imageIcon.src = "Media/x.png";
        imageIcon.alt = "Remove";

        removeButton.appendChild(imageIcon);

        removeButton.onclick = (event) => {
            event.preventDefault();
            event.stopPropagation();
            this.resetForm();
            
        };
        return removeButton;
    }

    displayFileName(fileName) {
        this.fileNameLabel.textContent = fileName;
        this.fileNameLabel.appendChild(this.createRemoveButton());
    }

    updateFormStyleAfterUpload() {
        this.uploadForm.style.display = "none";
        this.newForm.style.display = 'block';
    }

    resetForm() {
        sessionStorage.removeItem('uploadedFileName');
        sessionStorage.removeItem('uploadedFile');

    
        this.fileInput.value = '';
        this.uploadForm.style.display = "";
        this.newForm.style.display = 'none';
        this.fileNameLabel.textContent = '';
    }

    restorePreviousUpload() {
        const storedFile = sessionStorage.getItem('uploadedFile');
        const storedFileName = sessionStorage.getItem('uploadedFileName');

        if (storedFile && storedFileName) {
            this.displayFileName(storedFileName);
            this.updateFormStyleAfterUpload();
            this.attachDownloadHandler(storedFile, storedFileName);
        }
    }

    attachDownloadHandler(storedFile, storedFileName) {
        const fileNameLabel = this.fileNameLabel;

        const handleDownload = (event) => {
            event.preventDefault();
            event.stopPropagation();

            const a = document.createElement('a');
            a.href = storedFile;
            a.download = storedFileName || 'download';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        };

        fileNameLabel.addEventListener('click', handleDownload);
    }
}



class CategoryManager {
    constructor() {
        // Initialize only if the instance doesn't exist
        if (!CategoryManager.instance) {
            CategoryManager.instance = this;
            this.selectedCategories = [];
            this.categoryInputContainer = document.getElementById('category-input-container');
            this.selectedCategoriesContainer = document.createElement('div');
            this.selectedCategoriesContainer.id = 'selected-categories';
            this.categoryInputContainer.appendChild(this.selectedCategoriesContainer);

            this.categoryInput = document.getElementById('category-input');
            this.dropdown = document.createElement('div');
            this.dropdown.id = 'categories-dropdown';
            this.categoryInputContainer.appendChild(this.dropdown);

            this.dropdownToggleBtn = document.getElementById('dropdown-toggle-btn');
            this.dropdownToggleBtn.addEventListener('click', () => this.toggleDropdown());
            document.addEventListener('click', (e) => this.handleOutsideClick(e), true);

            this.fetchCategoriesAndUpdateDropdown();

            // Load selected categories from session storage on initialization
            const savedCategories = sessionStorage.getItem('selectedCategories');
            if (savedCategories) {
                this.selectedCategories = JSON.parse(savedCategories);
                this.updateSelectedCategoriesDisplay();
            }
        }

        return CategoryManager.instance;
    }

    fetchCategoriesAndUpdateDropdown() {
        fetch(`${apiBaseUrl}/categories`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.ok ? response.json() : Promise.reject(`Failed to fetch categories. Status: ${response.status}`))
            .then(data => this.populateCategoryDropdown(data.data))
            .catch(error => console.error('Error fetching categories:', error));
    }

    populateCategoryDropdown(categories) {
        const fragment = document.createDocumentFragment();

        categories.forEach(category => {
            const label = document.createElement('label');
            label.className = 'category-option';
            label.style.backgroundColor = category.background_color;
            label.style.color = category.text_color;

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = category.id;
            checkbox.id = `category-${category.id}`;
            checkbox.className = 'hidden-checkbox';
            checkbox.onclick = () => this.selectCategory(category);

            const text = document.createTextNode(category.title);
            label.appendChild(checkbox);
            label.appendChild(text);
            fragment.appendChild(label);
        });

        this.dropdown.innerHTML = '';
        this.dropdown.appendChild(fragment);
    }

    updateSelectedCategoriesDisplay() {
        const fragment = document.createDocumentFragment();

        this.selectedCategories.forEach(category => {
            const label = document.createElement('label');
            label.className = 'category-chip';
            label.style.backgroundColor = category.background_color;
            label.style.color = category.text_color;

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = true;
            checkbox.id = `selected-category-${category.id}`;
            checkbox.onclick = () => this.removeCategory(category);

            const text = document.createTextNode(category.title);
            label.appendChild(checkbox);
            label.appendChild(text);

            const removeBtn = document.createElement('span');
            removeBtn.className = 'remove-category';
            removeBtn.textContent = 'x';
            removeBtn.onclick = (event) => {
                event.stopPropagation();
                this.removeCategory(category);
            };

            label.appendChild(removeBtn);
            fragment.appendChild(label);
        });

        this.selectedCategoriesContainer.innerHTML = '';
        this.selectedCategoriesContainer.appendChild(fragment);
        this.adjustPlaceholderAndInputVisibility();
        this.checkCategoryValidity();
        this.saveSelectedCategoriesToSessionStorage();
    }

    toggleDropdown() {
        this.dropdown.style.display = this.dropdown.style.display === 'none' ? 'block' : 'none';
    }

    handleOutsideClick(event) {
        if (!this.categoryInputContainer.contains(event.target) && event.target !== this.dropdownToggleBtn) {
            this.dropdown.style.display = 'none';
        }
    }

    selectCategory(category) {
        if (!this.selectedCategories.some(c => c.id === category.id)) {
            this.selectedCategories.push(category);
            this.updateSelectedCategoriesDisplay();
            this.categoryInput.value = '';
        }
    }

    removeCategory(category) {
        this.selectedCategories = this.selectedCategories.filter(c => c.id !== category.id);
        this.updateSelectedCategoriesDisplay();

        const checkbox = document.getElementById(`category-${category.id}`);
        if (checkbox) {
            checkbox.checked = false;
        }

        this.checkCategoryValidity();
        this.saveSelectedCategoriesToSessionStorage();
    }

    adjustPlaceholderAndInputVisibility() {
        const hasSelectedCategories = this.selectedCategories.length > 0;
        const placeholder = document.getElementById('category-input-placeholder');
        const input = document.getElementById('category-input');
        placeholder.style.display = hasSelectedCategories ? 'none' : '';
        input.style.display = hasSelectedCategories ? '' : 'none';
    }

    saveSelectedCategoriesToSessionStorage() {
        sessionStorage.setItem('selectedCategories', JSON.stringify(this.selectedCategories));
    }

    checkCategoryValidity() {
        const isAnyCategorySelected = this.selectedCategories.length > 0;

        if (!isAnyCategorySelected) {
            this.applyInvalidInputStyles();
            return false;
        } else {
            const isAnythingChecked = this.selectedCategories.some(category => {
                return document.getElementById(`selected-category-${category.id}`).checked;
            });

            this.categoryInputContainer.style.border = isAnythingChecked ? '1px solid #14D81C' : '1px solid #EA1919';
            this.categoryInputContainer.style.backgroundColor = isAnythingChecked ? '#F8FFF8' : '#FAF2F3';
            return isAnythingChecked;
        }
    }

    applyInvalidInputStyles() {
        this.categoryInputContainer.style.border = '1px solid #EA1919';
        this.categoryInputContainer.style.backgroundColor = '#FAF2F3';
    }

    resetCategoryInputStyles() {
        this.categoryInputContainer.style.border = '';
        this.categoryInputContainer.style.backgroundColor = '';
    }

    initializeInputStyles() {
        const isValid = this.checkCategoryValidity();
        if (!isValid) {
            this.resetCategoryInputStyles();
        }
    }
}

class EmailValidator {
    constructor() {
        this.emailInput = document.getElementById('email-input');
        this.loginError = document.getElementById("loginError");
        this.errorMsg = document.getElementById("error-message");
        this.errorIcon = document.getElementById("error-icon");
        this.emailInput.addEventListener('input', this.checkEmailValidity.bind(this));
    }
    setEmailErrorStyles(message) {
        this.emailInput.style.backgroundColor = "#FAF2F3";
        this.emailInput.style.border = "1.5px solid red";
        this.emailInput.classList.remove('email-valid');
        this.loginError.style.display = "block";
        this.errorMsg.textContent = message;
        this.errorMsg.style.color = "red";
        this.errorMsg.style.display = "flex";
        this.errorMsg.style.marginTop = '-27px';
        this.errorMsg.style.marginLeft = '30px';
        this.errorIcon.style.visibility = 'visible';
        this.errorIcon.style.marginTop = '10px';
    }

    clearStyles() {
        this.emailInput.style.backgroundColor = "";
        this.emailInput.style.border = "";
        this.loginError.style.display = "none";
        this.errorIcon.style.visibility = 'hidden';
    }

    setEmailValidStyles() {
        this.clearStyles();
        this.emailInput.style.border = "1px solid #14D81C";
        this.emailInput.classList.add('email-valid');
        this.emailInput.style.backgroundColor = "#F8FFF8";
    }

    validateEmail(email) {
        const trimmedEmail = email.trim();
        return trimmedEmail.toLowerCase().endsWith('@redberry.ge');
    }

    checkEmailValidity() {
        const email = this.emailInput.value.trim();

        if (!email) {
            this.clearStyles();
            return;
        }

        if (this.validateEmail(email)) {
            this.setEmailValidStyles();
        } else {
            this.setEmailErrorStyles("ელ-ფოსტა უნდა მთავრდებოდეს @redberry.ge-ით");
        }
    }
}

async function createBlog() {
    const title = document.getElementById('input-title').value;
    const description = document.getElementById('input-description-field').value;
    const imageFile = document.getElementById('image').files[0];
    const author = document.getElementById('input-author').value;
    const publishDate = document.getElementById('enter-date').value;
    const categories = JSON.stringify(new CategoryManager().selectedCategories.map(category => category.id));
    const email = document.getElementById('email-input').value;

    // Use FormData to send a multipart/form-data request
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('image', imageFile);
    formData.append('author', author);
    formData.append('publish_date', publishDate);
    formData.append('categories', categories);
    formData.append('email', email);

    try {
        const response = await fetch(`${apiBaseUrl}/blogs`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });

        console.log('API Response:', response);

        if (response.ok) {
            
            console.log('Blog created successfully');
        } else {
            // Handle error response
            const errorData = await response.json();
            console.error('Error creating blog:', errorData);
        }
    } catch (error) {
        console.error('Error creating blog:', error);
        console.error(error.stack); // Log the stack trace
    }
}

// Add an event listener to the "Publish" button
document.getElementById('publish').addEventListener('click', async () => {
    console.log('Publish button clicked');
    if (isFormValid()) {
        console.log('Form is valid');
        await createBlog();
    } else {
        console.log('Form is not valid');
    }
});


function togglePlaceholderVisibility() {
    const categoryManager = new CategoryManager();
    categoryManager.updateSelectedCategoriesDisplay();
    categoryManager.initializeInputStyles();
    
}

// Initialize functions and classes when DOM is fully loaded
togglePlaceholderVisibility();
new ImageUploader();
new CategoryManager();
new EmailValidator();

// Attach event listeners and perform other initializations
const inputIdsToPersist = ['input-title', 'input-author', 'input-description-field', 'email-input', 'enter-date'];
const validationFunctions = {
    'input-title': (inputId) => checkFieldStrength(inputId, 'titleCriteria', 2),
    'input-author': checkAuthorCriteria,
    'input-description-field': (inputId) => checkFieldStrength(inputId, 'below-textarea', 2),
    'email-input': () => new EmailValidator().checkEmailValidity(),
    'enter-date': (inputId) => checkDateValidity(inputId),
};

inputIdsToPersist.forEach((inputId) => {
    const inputField = document.getElementById(inputId);
    inputField.addEventListener('input', () => {
        saveInput(inputId);
        const validationFunction = validationFunctions[inputId];
        if (validationFunction) {
            validationFunction(inputId);
        }
    });
    loadInput(inputId);
    const validationFunction = validationFunctions[inputId];
    if (validationFunction) {
        validationFunction(inputId);
    }
});
document.getElementById('input-author').addEventListener('input', isFormValid);
document.getElementById('input-title').addEventListener('input', isFormValid);
document.getElementById('input-description-field').addEventListener('input', isFormValid);
document.getElementById('enter-date').addEventListener('change', isFormValid);
document.getElementById('email-input').addEventListener('input', isFormValid);

// Initial check when the page loads
document.addEventListener('DOMContentLoaded', isFormValid);

document.querySelectorAll('input, textarea, select').forEach(element => {
    element.addEventListener('change', () => {
        // Additional logic if needed when an input changes
    });
});
});

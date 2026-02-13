// Login Form JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.querySelector('.login-btn');

    // Create message containers
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    
    loginForm.insertBefore(errorDiv, loginForm.firstChild);
    loginForm.insertBefore(successDiv, loginForm.firstChild);

    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Show error message
    function showError(message) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        successDiv.style.display = 'none';
        
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }

    // Show success message
    function showSuccess(message) {
        successDiv.textContent = message;
        successDiv.style.display = 'block';
        errorDiv.style.display = 'none';
        
        setTimeout(() => {
            successDiv.style.display = 'none';
        }, 3000);
    }

    // Handle form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Get form values
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Validation
        if (!email || !password) {
            showError('Please fill in all fields');
            return;
        }

        if (!isValidEmail(email)) {
            showError('Please enter a valid email address');
            return;
        }

        // Show loading state
        loginBtn.classList.add('loading');
        loginBtn.textContent = 'Logging in';

        // Replace later with actual backend API call
        
   

        
});

// Check if user is already logged in
window.addEventListener('load', function() {
    const authToken = localStorage.getItem('authToken');
    const userEmail = localStorage.getItem('userEmail');
    
    if (authToken || userEmail) {
        // TODO: Verify token with backend
        // If valid, redirect to dashboard
        // window.location.href = 'dashboard.html';
    }
});
});
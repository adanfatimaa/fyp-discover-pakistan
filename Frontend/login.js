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

        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Save token, role and name to localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('userRole', data.role);
                localStorage.setItem('userName', data.name);

                showSuccess('Login successful! Redirecting...');

                // Redirect based on role
                setTimeout(function() {
                    if (data.role === 'admin') {
                        window.location.href = 'adminDashboard.html';
                    } else {
                        window.location.href = 'homepage.html';
                    }
                }, 1500);

            } else {
                showError(data.message || 'Invalid email or password.');
            }

        } catch (error) {
            console.log('Error:', error);
            showError('Something went wrong. Please try again later.');

        } finally {
            // Remove loading state whether success or error
            loginBtn.classList.remove('loading');
            loginBtn.textContent = 'Login';
        }
    });

    // Check if user is already logged in — skip login page if they are
    window.addEventListener('load', function() {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('userRole');

        if (token) {
            if (role === 'admin') {
                window.location.href = 'adminDashboard.html';
            } else {
                window.location.href = 'homepage.html';
            }
        }
    });
});
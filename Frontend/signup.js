function togglePassword(inputId, iconEl) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
        iconEl.textContent = '🙈';
    } else {
        input.type = 'password';
        iconEl.textContent = '👁️';
    }
}
document.getElementById('signupForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Get form values
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // Reset error messages
    document.querySelectorAll('.error-message').forEach(error => {
        error.style.display = 'none';
    });
    banner.style.display = 'none';

    let isValid = true;

    // Validate full name
    if (fullName === '') {
        document.getElementById('nameError').style.display = 'block';
        isValid = false;
    }

    // Validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        document.getElementById('emailError').style.display = 'block';
        isValid = false;
    }

    // Validate password
    if (password.length < 6) {
        document.getElementById('passwordError').style.display = 'block';
        isValid = false;
    }

    if (!isValid) return;

    try {
        const response = await fetch('http://localhost:3000/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: fullName, email: email, password: password })
        });

        const data = await response.json();

        if (response.ok) {
    showBanner('success', data.message || 'Account created! Please check your email to verify your account.');
    setTimeout(() => { window.location.href = 'login.html'; }, 2500);
        } else {
            showBanner('error', data.message || 'Signup failed. Please try again.');
        }

    } catch (error) {
        console.log('Error:', error);
        showBanner('error', 'Something went wrong. Please try again later.');
    }
});

// Create the banner box once, insert it at the top of the form
const form = document.getElementById('signupForm');
const banner = document.createElement('div');
banner.id = 'formBanner';
form.insertBefore(banner, form.firstChild);

function showBanner(type, message) {
    banner.textContent = message;
    banner.className = type === 'success' ? 'form-banner-success' : 'form-banner-error';
    banner.style.display = 'block';
}
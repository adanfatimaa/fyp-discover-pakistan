document.addEventListener('DOMContentLoaded', function() {

  // --- load navbar ---
  fetch('navbar.html')
    .then(res => res.text())
    .then(html => {
      document.getElementById('navbar').innerHTML = html;

      // hamburger menu
      const hamburger = document.querySelector('.hamburger');
      const navLinks = document.querySelector('.nav-links');

      hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
      });

      document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
          navLinks.classList.remove('active');
          hamburger.classList.remove('active');
        });
      });

      document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
          navLinks.classList.remove('active');
          hamburger.classList.remove('active');
        }
      });

      // --- CHECK LOGIN STATE and update navbar ---
      const token    = localStorage.getItem('token');
      const userName = localStorage.getItem('userName');

      // find the "Sign Up" li in the navbar
      const signupLi = document.querySelector('.nav-links li:last-child');

      if (token && userName) {
        // user is logged in — replace Sign Up with their name + logout
        signupLi.innerHTML = `
          <span style="color:#9cc05a; font-weight:700; margin-right:8px;">
            👤 ${userName}
          </span>
          <a href="#" id="logout-btn" style="color:#fff;">Logout</a>
        `;

        document.getElementById('logout-btn').addEventListener('click', function(e) {
          e.preventDefault();
          localStorage.removeItem('token');
          localStorage.removeItem('userName');
          localStorage.removeItem('userRole');
          window.location.href = 'login.html';
        });

      } else {
        // not logged in — keep Sign Up as is
      }

    });

  // --- load chatbot CSS ---
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'chatbot.css';
  document.head.appendChild(link);

  // --- load chatbot HTML then JS ---
  fetch('chatbot.html')
    .then(res => res.text())
    .then(html => {
      const chatDiv = document.createElement('div');
      chatDiv.innerHTML = html;
      document.body.appendChild(chatDiv);

      const script = document.createElement('script');
      script.src = 'chatbot.js';
      document.body.appendChild(script);
    });

});
// wait for the whole page to load first
document.addEventListener('DOMContentLoaded', function() {

  // --- load navbar ---
  fetch('navbar.html')
    .then(res => res.text())
    .then(html => {
      document.getElementById('navbar').innerHTML = html;

      // hamburger menu (runs AFTER navbar is loaded)
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
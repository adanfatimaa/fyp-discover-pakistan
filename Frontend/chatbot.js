// =========================================
//  CHATBOT - Discover Pakistan
//  Simple open/close + send messages
// =========================================


// --- Grab all the elements we need ---
const chatBtn     = document.getElementById('chatbot-btn');
const chatWindow  = document.getElementById('chatbot-window');
const closeBtn    = document.getElementById('chatbot-close');
const messagesDiv = document.getElementById('chatbot-messages');
const inputBox    = document.getElementById('chatbot-input');
const sendBtn     = document.getElementById('chatbot-send');


// --- Open / close the chat window ---

chatBtn.addEventListener('click', function() {
    chatWindow.classList.toggle('open');

    // change the button icon when open
    const icon = chatBtn.querySelector('i');
    if (chatWindow.classList.contains('open')) {
        icon.className = 'fa-solid fa-xmark';
    } else {
        icon.className = 'fa-solid fa-comment-dots';
    }
});

closeBtn.addEventListener('click', function() {
    chatWindow.classList.remove('open');
    chatBtn.querySelector('i').className = 'fa-solid fa-comment-dots';
});


// --- Add a message bubble to the screen ---

function addMessage(text, sender) {
    // sender is either "bot" or "user"

    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message', sender);

    if (sender === 'bot') {
        // bot messages have a small avatar icon
        messageDiv.innerHTML = `
            <div class="msg-avatar">
                <i class="fa-solid fa-robot"></i>
            </div>
            <div class="bubble">${text}</div>
        `;
    } else {
        // user messages, no avatar
        messageDiv.innerHTML = `
            <div class="bubble">${text}</div>
        `;
    }

    messagesDiv.appendChild(messageDiv);

    // auto scroll to the bottom so new messages are visible
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}


// --- Show a "typing..." animation while bot is thinking ---

function showTyping() {
    const typingDiv = document.createElement('div');
    typingDiv.classList.add('chat-message', 'bot');
    typingDiv.id = 'typing-indicator';

    typingDiv.innerHTML = `
        <div class="msg-avatar">
            <i class="fa-solid fa-robot"></i>
        </div>
        <div class="bubble">
            <div class="typing-dots">
                <span></span><span></span><span></span>
            </div>
        </div>
    `;

    messagesDiv.appendChild(typingDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function hideTyping() {
    const typingDiv = document.getElementById('typing-indicator');
    if (typingDiv) {
        typingDiv.remove();
    }
}


// --- Send a message ---

function sendMessage() {
    const userText = inputBox.value.trim();

    // don't send if box is empty
    if (userText === '') return;

    // show user's message
    addMessage(userText, 'user');

    // clear the input box
    inputBox.value = '';

    // show typing dots
    showTyping();

    // --- Call the Python/FastAPI chatbot backend ---
    // TODO: replace this URL with your actual backend URL when ready
    const backendURL = 'http://localhost:8000/chat';  

    fetch(backendURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userText })
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        hideTyping();
        // your FastAPI should return something like { reply: "..." }
        addMessage(data.reply, 'bot');
    })
    .catch(function(error) {
        // if backend is not running, show a fallback message
        hideTyping();
        addMessage("Oops! I can't connect to the server right now. Please try again later.", 'bot');
        console.log('Chatbot error:', error);
    });
}


// --- Send when user clicks the send button ---
sendBtn.addEventListener('click', sendMessage);


// --- Send when user presses Enter key ---
inputBox.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});


// --- Welcome message when page loads ---
// small delay so it feels natural
setTimeout(function() {
    addMessage("Assalam o Alaikum! 👋 I'm your Discover Pakistan guide. Ask me anything about destinations, food, or travel tips!", 'bot');
}, 800);
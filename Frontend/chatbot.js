const chatBtn     = document.getElementById('chatbot-btn');
const chatWindow  = document.getElementById('chatbot-window');
const closeBtn    = document.getElementById('chatbot-close');
const messagesDiv = document.getElementById('chatbot-messages');
const inputBox    = document.getElementById('chatbot-input');
const sendBtn     = document.getElementById('chatbot-send');
const historyBtn   = document.getElementById('chatbot-history-btn');
const historyPanel = document.getElementById('chatbot-history-panel');
const historyList  = document.getElementById('chatbot-history-list');
const historyBackBtn = document.getElementById('chatbot-history-back');

// --- Chat history storage ---
let allSessions = JSON.parse(localStorage.getItem('chatbotSessions') || '[]');
let currentSession = {
    id: Date.now(),
    startTime: new Date().toLocaleString(),
    messages: []
};

function saveSessions() {
    // save/update the current session inside the full list
    const existingIndex = allSessions.findIndex(s => s.id === currentSession.id);
    if (existingIndex === -1) {
        allSessions.push(currentSession);
    } else {
        allSessions[existingIndex] = currentSession;
    }
    localStorage.setItem('chatbotSessions', JSON.stringify(allSessions));
}

function renderHistoryList() {
    historyList.innerHTML = '';
    if (allSessions.length === 0) {
        historyList.innerHTML = '<p style="color:#aaa; font-size:13px;">No past conversations yet.</p>';
        return;
    }
    // show most recent first
    const sorted = allSessions.slice().reverse();
    sorted.forEach(function(session) {
        const item = document.createElement('div');
        item.className = 'history-item';
        const firstUserMsg = session.messages.find(m => m.sender === 'user');
        const preview = firstUserMsg ? firstUserMsg.text : '(no messages)';
        item.innerHTML = `
            <div class="history-date">${session.startTime}</div>
            <div class="history-preview">${preview.substring(0, 60)}</div>
        `;
        item.addEventListener('click', function() {
            showOldSession(session);
        });
        historyList.appendChild(item);
    });
}

function showOldSession(session) {
    messagesDiv.innerHTML = '';
    session.messages.forEach(function(m) {
        addMessageToDOM(m.text, m.sender);
    });
    historyPanel.classList.remove('open');
    inputBox.disabled = true;
    sendBtn.disabled = true;
}

function backToLiveChat() {
    messagesDiv.innerHTML = '';
    currentSession.messages.forEach(function(m) {
        addMessageToDOM(m.text, m.sender);
    });
    inputBox.disabled = false;
    sendBtn.disabled = false;
}

historyBtn.addEventListener('click', function() {
    renderHistoryList();
    historyPanel.classList.add('open');
});

historyBackBtn.addEventListener('click', function() {
    historyPanel.classList.remove('open');
    backToLiveChat();
});


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
    addMessageToDOM(text, sender);
    currentSession.messages.push({ text: text, sender: sender });
    saveSessions();
}

function addMessageToDOM(text, sender) {
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
    const backendURL = 'http://localhost:8000/chat/message';  

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

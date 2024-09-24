// Inject chat interface into the streaming platform
const chatBox = document.createElement('div');
chatBox.id = 'watchPartyChat';
document.body.appendChild(chatBox);

// Function to render a new chat message in the chatbox
function addChatMessage(username, text) {
  const chatMessage = document.createElement('p');
  chatMessage.textContent = `[${username}] ${text}`;
  chatBox.appendChild(chatMessage);
}

// Function to dynamically retrieve username and party code
function getUserDetails() {
  // Retrieve username and partyCode from localStorage or any other mechanism
  const username = localStorage.getItem('username') || prompt("Enter your username:");
  const partyCode = localStorage.getItem('partyCode') || prompt("Enter your party code:");

  // Store in localStorage if not already stored
  if (!localStorage.getItem('username')) {
    localStorage.setItem('username', username);
  }
  if (!localStorage.getItem('partyCode')) {
    localStorage.setItem('partyCode', partyCode);
  }

  return { username, partyCode };
}

// Function to fetch watch party chat messages using PartyApiService
async function fetchChatMessages(partyCode) {
  try {
    const response = await fetch(`http://localhost:3000/party/${partyCode}/chat`);
    if (response.ok) {
      const messages = await response.json();
      messages.forEach(msg => addChatMessage(msg.username, msg.text));
    } else {
      console.error('Failed to fetch chat messages:', response.statusText);
    }
  } catch (error) {
    console.error('Error fetching chat messages:', error);
  }
}

// Function to send chat message via PartyApiService
async function sendMessage(partyCode, username, text) {
  try {
    const response = await fetch(`http://localhost:3000/party/${partyCode}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        text: text,
      }),
    });
    if (!response.ok) {
      console.error('Failed to send message:', response.statusText);
    }
  } catch (error) {
    console.error('Error sending message:', error);
  }
}

// Optional: Add input fields for sending messages
const chatInput = document.createElement('input');
chatInput.type = 'text';
chatInput.placeholder = 'Type a message...';
document.body.appendChild(chatInput);

const sendButton = document.createElement('button');
sendButton.textContent = 'Send';
document.body.appendChild(sendButton);

// Event listener for the send button
sendButton.addEventListener('click', () => {
  const { username, partyCode } = getUserDetails();
  const text = chatInput.value;
  if (text) {
    sendMessage(partyCode, username, text);
    chatInput.value = '';  // Clear the input after sending
  }
});

// Fetch initial chat messages when the page loads
window.addEventListener('load', () => {
  const { partyCode } = getUserDetails();
  fetchChatMessages(partyCode);
});

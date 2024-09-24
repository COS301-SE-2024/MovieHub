// Inject chat interface into the streaming platform
const chatBox = document.createElement('div');
chatBox.id = 'watchPartyChat';
document.body.appendChild(chatBox);

// Initialize Firebase (ensure Firebase SDK is loaded and initialized elsewhere in your project)
import { getDatabase, ref, onChildAdded, push, set } from "firebase/database";

const db = getDatabase();
const chatRoomId = "your-chatroom-id";  // This should correspond to the roomId or partyCode

// Function to handle new incoming messages from Firebase
const chatRoomRef = ref(db, `rooms/${chatRoomId}/WatchPartyChat`);
onChildAdded(chatRoomRef, (snapshot) => {
  const message = snapshot.val();
  const chatMessage = document.createElement('p');
  chatMessage.textContent = `[${message.username}] ${message.text}`;
  chatBox.appendChild(chatMessage);
});

// Function to send a message to Firebase
function sendMessage(username, text) {
  const newMessageRef = push(chatRoomRef);
  set(newMessageRef, {
    username: username,
    text: text,
    timestamp: Date.now()
  });
}

// Optional: Add input fields for sending messages
const chatInput = document.createElement('input');
chatInput.type = 'text';
chatInput.placeholder = 'Type a message...';
document.body.appendChild(chatInput);

const sendButton = document.createElement('button');
sendButton.textContent = 'Send';
document.body.appendChild(sendButton);

sendButton.addEventListener('click', () => {
  const username = "your-username";  // Replace with the actual username
  const text = chatInput.value;
  if (text) {
    sendMessage(username, text);
    chatInput.value = '';  // Clear the input after sending
  }
});

// Optionally integrate WebRTC for audio capabilities
navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
  const audioElement = document.createElement('audio');
  audioElement.srcObject = stream;
  document.body.appendChild(audioElement);
  audioElement.play();
});

// // Create a link element for the CSS
// const link = document.createElement('link');
// link.href = chrome.runtime.getURL('css/styles.css'); // Path to the CSS file
// link.type = 'text/css';
// link.rel = 'stylesheet';

// // Inject the link into the document's head
// document.head.appendChild(link);

// // Now add the chat UI (as explained earlier)
// const chatDiv = document.createElement('div');
// chatDiv.id = 'watch-party-chat';
// chatDiv.innerHTML = `
//   <div id="chat-box"></div>
//   <input id="chat-input" type="text" placeholder="Enter message...">
// `;
// document.body.appendChild(chatDiv);

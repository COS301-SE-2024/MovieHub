// Inject chat interface into the streaming platform
const chatBox = document.createElement('div');
chatBox.id = 'watchPartyChat';
document.body.appendChild(chatBox);

// WebSocket or Firebase logic to handle chat
const chatRoomId = "your-chatroom-id";  // Based on party code
const socket = new WebSocket('wss://your-chat-server.com');

socket.onmessage = function (event) {
  const message = JSON.parse(event.data);
  const chatMessage = document.createElement('p');
  chatMessage.textContent = `[${message.username}] ${message.text}`;
  chatBox.appendChild(chatMessage);
};

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

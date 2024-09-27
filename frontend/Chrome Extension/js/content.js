let localStream;
let peerConnections = {};
const signalingSocket = new WebSocket('ws://localhost:3000');

let isMuted = false;
let isVideoMuted = false;

// Max number of users in the watch party
const MAX_USERS = 5;
let userCount = 0;


// Get user's audio stream
async function startAudioStream() {
  try {
    localStream = await navigator.mediaDevices.getUserMedia(
      { audio: true,
        video: true  // Add this to request video
       });
    localStream.getAudioTracks().forEach(track => track.enabled = !isMuted); // Initially, set the track to be enabled

    // You can now handle video tracks
    localStream.getVideoTracks().forEach(track => {
      // You can control video track's mute state similarly, if needed
      track.enabled = !isMuted
      console.log('Video track initialized');
    });

  } catch (error) {
    console.error('Error accessing microphone:', error);
  }
}

// Add the local video element to the DOM
function addLocalVideoElement() {
  const localVideo = document.createElement('video');
  localVideo.id = 'localVideo';
  localVideo.autoplay = true;
  localVideo.muted = true; // Mute local video
  localVideo.playsInline = true;

  // Set the source of the video element to the local stream
  localVideo.srcObject = localStream;

  // Style the video element to position it at the top of the screen
  Object.assign(localVideo.style, {
    position: 'fixed',
    top: '10px',
    left: '10px',
    width: '200px', // Adjust width as necessary
    height: '150px', // Adjust height as necessary
    borderRadius: '8px', // Rounded corners
    border: '2px solid #7e57c2', // Border color
    zIndex: '1000' // Ensure it's above other elements
  });

  document.body.appendChild(localVideo);
}

function addRemoteVideoElement(socketId, stream) {
  const remoteVideo = document.createElement('video');
  remoteVideo.id = `remoteVideo_${socketId}`;
  remoteVideo.srcObject = stream;
  remoteVideo.autoplay = true;
  remoteVideo.playsInline = true;

  // Style the remote video element
  Object.assign(remoteVideo.style, {
    position: 'fixed',
    top: '10px',
    right: `${userCount * 210}px`, // Space them out horizontally
    width: '200px',
    height: '150px',
    borderRadius: '8px',
    border: '2px solid #7e57c2',
    zIndex: '999',
  });

  document.body.appendChild(remoteVideo);
  userCount++;
}

// Remove remote video element for a user
function removeRemoteVideoElement(socketId) {
  const remoteVideo = document.getElementById(`remoteVideo_${socketId}`);
  if (remoteVideo) {
    remoteVideo.remove();
    userCount--;
  }
}

// Initialize WebRTC peer connection
function createPeerConnection(partyCode, targetSocketId) {
  const peerConnection = new RTCPeerConnection();

  // Add both audio and video tracks to the connection
  localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

  // Handle ICE candidates
  peerConnection.onicecandidate = event => {
    if (event.candidate) {
      signalingSocket.send(JSON.stringify({
        type: 'webrtc-ice-candidate',
        candidate: event.candidate,
        targetSocketId: targetSocketId,
        partyCode
      }));
    }
  };

  // Handle remote media streams (audio and video)
  // Handle remote media streams (audio and video)
  peerConnection.ontrack = event => {
    const remoteStream = event.streams[0];
    addRemoteVideoElement(targetSocketId, remoteStream);

    // Audio handling
    const remoteAudio = new Audio();
    remoteAudio.srcObject = remoteStream;
    remoteAudio.play();

    // Video handling
    const remoteVideo = document.createElement('video');
    remoteVideo.srcObject = remoteStream;
    remoteVideo.autoplay = true;
    remoteVideo.playsInline = true;
    document.body.appendChild(remoteVideo); // Add the video element to the DOM
  };

  return peerConnection;
}


// Handle incoming WebRTC signaling messages
signalingSocket.onmessage = async (event) => {
  const data = JSON.parse(event.data);

  if (data.type === 'webrtc-offer') {
    const peerConnection = createPeerConnection(data.partyCode, data.socketId);
    await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    signalingSocket.send(JSON.stringify({
      type: 'webrtc-answer',
      answer: answer,
      targetSocketId: data.socketId,
      partyCode: data.partyCode
    }));

    peerConnections[data.socketId] = peerConnection;
  } else if (data.type === 'webrtc-answer') {
    const peerConnection = peerConnections[data.socketId];
    await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
  } else if (data.type === 'webrtc-ice-candidate') {
    const peerConnection = peerConnections[data.socketId];
    if (peerConnection) {
      await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
    }
  }else if (data.type === 'user-disconnected') {
    removeRemoteVideoElement(data.socketId);
  }

};

// Mic Button to toggle mute/unmute
const micButton = document.createElement('button');
micButton.textContent = '🎤 Mute';
micButton.style.position = 'fixed';
micButton.style.bottom = '20px';
micButton.style.right = '320px';
micButton.style.zIndex = '10000';
micButton.style.backgroundColor = '#7e57c2';
micButton.style.color = 'white';
micButton.style.padding = '10px';
micButton.style.border = 'none';
micButton.style.borderRadius = '5px';
micButton.style.cursor = 'pointer';

document.body.appendChild(micButton);

// Toggle mute/unmute on mic button click
micButton.addEventListener('click', () => {
  isMuted = !isMuted;
  micButton.textContent = isMuted ? '🎤 Unmute' : '🎤 Mute';
  if (localStream) {
    localStream.getAudioTracks().forEach(track => {
      track.enabled = !isMuted;
      console.log('Track status:', track.enabled ? 'Unmuted' : 'Muted');
    });
  }
});

// Video Button to toggle video mute/unmute
const videoButton = document.createElement('button');
videoButton.textContent = '📹 Stop Video';
videoButton.style.position = 'fixed';
videoButton.style.bottom = '20px';
videoButton.style.right = '220px';
videoButton.style.zIndex = '10000';
videoButton.style.backgroundColor = '#7e57c2';
videoButton.style.color = 'white';
videoButton.style.padding = '10px';
videoButton.style.border = 'none';
videoButton.style.borderRadius = '5px';
videoButton.style.cursor = 'pointer';

document.body.appendChild(videoButton);

videoButton.addEventListener('click', () => {
  isVideoMuted = !isVideoMuted;
  localStream.getVideoTracks().forEach(track => track.enabled = !isVideoMuted);
  videoButton.textContent = isVideoMuted ? '📹 Start Video' : '📹 Stop Video';
});


// Inject chat interface into the streaming platform
const chatBox = document.createElement('div');
chatBox.id = 'watchPartyChat';
document.body.appendChild(chatBox);

// Apply styles to the chatBox
Object.assign(chatBox.style, {
  position: 'fixed',
  top: '0',
  right: '0',
  width: '300px', // Adjust width as necessary
  height: '100%', // Cover from top to bottom
  backgroundColor: '#f3f4f6', // Light background color
  color: 'black', // Text color
  overflowY: 'auto', // Scrollable if content overflows
  boxShadow: '-2px 0 10px rgba(0, 0, 0, 0.5)', // Shadow for better visibility
  padding: '20px', // Padding for spacing
  zIndex: '9999', // Ensure it appears above other elements
  borderLeft: '4px solid #7e57c2', // Left border in purple
});

// Add headings to the chatBox
const heading = createHeading('MovieHub', '24px', '10px');
const subHeading = createHeading('Watch Party', '18px', '20px');
chatBox.appendChild(heading);
chatBox.appendChild(subHeading);

// Function to create heading elements
function createHeading(text, fontSize, marginBottom) {
  const heading = document.createElement('h1');
  heading.textContent = text;
  heading.style.textAlign = 'center'; // Center the heading
  heading.style.color = '#7e57c2'; // Purple color for the heading
  heading.style.fontSize = fontSize; // Font size for the heading
  heading.style.marginBottom = marginBottom; // Margin for spacing
  return heading;
}

// Function to dynamically retrieve username and party code
function getUserDetails() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(['username', 'partyCode'], (data) => {
      let { username = null, partyCode = null } = data;

      // Prompt for username if missing
      if (!username) {
        username = prompt("Enter your username:");
        if (username) {
          chrome.storage.sync.set({ username });
        }
      }

      // Prompt for party code if missing
      if (!partyCode || !partyCode.trim()) {
        partyCode = prompt("Enter your valid party code:");
        if (partyCode && partyCode.trim()) {
          chrome.storage.sync.set({ partyCode: partyCode.trim() });
        }
      }

      // Check for valid details
      if (!username || !partyCode || !partyCode.trim()) {
        alert("Error: Both username and a valid party code are required!");
        return reject("Missing username or party code");
      }

      resolve({ username, partyCode });
    });
  });
}

// Function to fetch watch party chat messages
async function fetchChatMessages(username, partyCode) {
  try {
    const response = await fetch(`http://localhost:3000/party/${partyCode}/chat`);

    if (response.ok) {
      const data = await response.json();
      updateChatMessages(data.messages);
    } else {
     // console.error('Failed to fetch chat messages:', response.statusText);
      addChatMessage("System", "No chat messages yet.");
    }

    createChatInputContainer({username, partyCode});
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    addChatMessage("System", "An error occurred while fetching chat messages.");
  }
}

// Function to update chat messages in the chat box
function updateChatMessages(messages) {
  chatBox.innerHTML = ''; // Clear previous messages
  chatBox.appendChild(heading);
  chatBox.appendChild(subHeading);

  if (messages && messages.length > 0) {
    messages.forEach(msg => addChatMessage(msg.username, msg.text));
  } else {
    addChatMessage("System", "No Messages Yet", true); // Centered message
  }

  console.log("End of Update");
}

// Function to send chat message
async function sendMessage(partyCode, username, text) {
  try {
    const response = await fetch(`http://localhost:3000/party/${partyCode}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, text }),
    });
    if (!response.ok) {
      console.error('Failed to send message:', response.statusText);
    }
  } catch (error) {
    console.error('Error sending message:', error);
  }
}

// Function to render a new chat message
function addChatMessage(username, text, isCentered = false) {
  const chatMessage = document.createElement('p');
  chatMessage.textContent = `[${username}] ${text}`;
  chatMessage.style.textAlign = isCentered ? 'center' : 'left';
  chatMessage.style.marginBottom = '10px';
  chatMessage.style.padding = '5px';
  chatMessage.style.borderRadius = '5px';
  chatMessage.style.backgroundColor = isCentered ? '#7e57c2' : '#e1bee7';
  chatMessage.style.color = 'black';
  chatMessage.style.transition = 'background-color 0.3s';
  chatMessage.onmouseover = () => chatMessage.style.backgroundColor = '#9575cd';
  chatMessage.onmouseout = () => chatMessage.style.backgroundColor = isCentered ? '#7e57c2' : '#e1bee7';

  chatBox.appendChild(chatMessage);
}

// Initialize chat input container
function createChatInputContainer(userDetails) {
  const chatInputContainer = document.createElement('div');
  Object.assign(chatInputContainer.style, {
    display: 'flex',
    position: 'absolute',
    bottom: '20px',
    left: '0',
    right: '0',
    margin: '0 20px',
    zIndex: '10000',
  });

  const chatInput = createChatInput();
  const sendButton = createSendButton(chatInput, userDetails);

  chatInputContainer.appendChild(chatInput);
  chatInputContainer.appendChild(sendButton);
  chatBox.appendChild(chatInputContainer);
}

// Function to create chat input field
function createChatInput() {
  const chatInput = document.createElement('input');
  Object.assign(chatInput, {
    type: 'text',
    placeholder: 'Type a message...',
    style: `
            flex-grow: 1;
            border: 2px solid #7e57c2;
            background-color: #2c2c3d;
            color: white;
            padding: 10px;
            border-radius: 5px;
            margin-right: 10px;
            font-size: 16px;
        `,
  });
  return chatInput;
}

// Function to create send button
function createSendButton(chatInput, userDetails) {
  const sendButton = document.createElement('button');
  sendButton.textContent = 'Send';
  Object.assign(sendButton.style, {
    width: '80px',
    backgroundColor: '#7e57c2',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    padding: '10px',
    fontSize: '16px',
  });
  sendButton.onclick = () => {
    const messageText = chatInput.value.trim();
    if (messageText) {
      sendMessage(userDetails.partyCode, userDetails.username, messageText);
      addChatMessage(userDetails.username, messageText);
      chatInput.value = ''; // Clear input after sending
    }
  };
  return sendButton;
}



// Start WebRTC audio when party starts
async function startWatchParty() {
const userDetails = getUserDetails();
  await startAudioStream();
  addLocalVideoElement(); // Add the local video element
  console.log('Local Stream Tracks:', localStream.getTracks());


  signalingSocket.onopen = () => {
    signalingSocket.send(JSON.stringify({
      type: 'join-party',
      partyCode: `${userDetails.partyCode}`,
      username: `${userDetails.username}`
    }));
  };
}

// Main function to initialize the chat
async function initChat() {
  try {
    const userDetails = await getUserDetails();
    chatBox.style.display = 'block'; // Show chat box when user details are available
    console.log("fetch ");
    fetchChatMessages(userDetails.username, userDetails.partyCode); // Fetch initial chat messages
  //  createChatInputContainer(userDetails);
    console.log("Before Int");
    // // Set an interval to fetch chat messages every 5 seconds
    // setInterval(() => {
    //   fetchChatMessages(userDetails.username, userDetails.partyCode);
    //   //createChatInputContainer(userDetails);
    // }, 5000); // Adjust interval as necessary (5000ms = 5 seconds)
  } catch (error) {
    console.error('Initialization error:', error);
  }
}

// Start the chat interface
initChat();
startWatchParty();

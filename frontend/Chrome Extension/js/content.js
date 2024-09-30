
let remoteDescriptionSet = false;
let localStream;
let isHost = false;
let ws;
let peerConnections = {};
let isMuted = false;
let isVideoMuted = false;
let userCount = 0; // Initialize the user count
const MAX_USERS = 5;
let iceCandidateQueue = []; // Queue to store ICE candidates before WebSocket is open
let peerConnection;
// Queue to store ICE candidates that arrive before the remote description is set
const iceCandidateQueues = {};
let clientCount = 0; // Variable to keep track of connected clients

// ICE servers for the peer connection
const iceServers = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

// Function to get local media stream
async function getLocalStream() {
  try {
    localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    console.log("Local stream obtained:", localStream);

    // Add local video element to the DOM
    addLocalVideoElement();
    return localStream;
  } catch (error) {
    console.error("Error accessing media devices.", error);
  }
}

// Function to get user details and check if they are the host
function getUserDetails() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(['username', 'partyCode', 'roomId', 'isHost'], (data) => {
      let { username = null, partyCode = null, roomId = null, isHost = false } = data;

      // Store host status
      isHost = data.isHost;

      if (!username || !partyCode || !roomId) {
        alert("Error: Username, party code, and room ID are required!");
        return reject("Missing username, party code, or room ID");
      }

      resolve({ username, partyCode, roomId, isHost });
    });
  });
}

// Function to handle WebSocket open and offer creation
async function initializeWebSocket(roomId) {
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    console.log('No WebSocket connection found or not open. Initializing new connection.');
    ws = new WebSocket(`wss://moviehub-watchparty-extension.glitch.me?roomId=${roomId}`);
    const userDetails = await getUserDetails();

    // Initialize the WebSocket connection
    ws.onopen = async () => {
      console.log('WebSocket connection opened');
      clientCount++;
      console.log(`Client count updated: ${clientCount}`);

      // Notify other clients about the new connection
      sendWSMessage({
        type: 'client-count-update',
        count: clientCount,
        roomId: userDetails.roomId,
      });
    };

    // Handle WebSocket closure
    ws.onclose = () => {
      console.log('WebSocket connection closed');
      clientCount--; // Decrement the client count on disconnect
      console.log(`Client count updated: ${clientCount}`);
      chrome.storage.sync.remove('websocket');
    };

    // Handle WebSocket errors
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Handle WebSocket messages
    ws.onmessage = async (message) => {
      const data = JSON.parse(message.data);
      console.log("IN Message");

      // Update client count if a client count update message is received
      if (data.type === 'client-count-update') {
        clientCount = data.count; // Update the client count
        console.log(`Updated client count: ${clientCount}`);
        if (clientCount < 1){
          return;
        }
      }

        if (clientCount > 1 && userDetails.isHost) { // Only send offer if there's at least one other client
          if(!peerConnection){
          console.log('Creating peer connection and sending an offer.');
          const peerConnection = await createPeerConnection(userDetails.partyCode, userDetails.roomId);
           if (peerConnection) {
            if (peerConnection.signalingState === 'stable') {
            await createOffer(peerConnection, userDetails.partyCode, userDetails.roomId);
            }
            else if (peerConnection.signalingState === 'have-local-offer') {
              console.log('Handling incoming WebRTC answer:', data.answer);
              await handleIncomingAnswer(data.answer, peerConnection);
            }
           console.log("Out of creat if");
        }
      }
       
      } else if ((data.type === 'webrtc-answer' )  && userDetails.isHost) {
        console.log("Some answer??");
        const peerConnection = peerConnections[userDetails.roomId];
        if (peerConnection && peerConnection.signalingState !== 'closed') {
          console.log('Handling incoming WebRTC answer:', data.answer);
          await handleIncomingAnswer(data.answer, peerConnection);
        } else {
          console.error('PeerConnection is closed or undefined.');
        }
      }


      // if (clientCount > 1 && userDetails.isHost) { // Only send offer if there's at least one other client
      //   console.log('Creating peer connection and sending an offer.');
      //   const peerConnection = await createPeerConnection(userDetails.partyCode, userDetails.roomId);
      //   await createOffer(peerConnection, userDetails.partyCode, userDetails.roomId);
      // }
      
      if (data.type === 'webrtc-offer' && !userDetails.isHost) {
        console.log('Received offer:', data.offer);
        if (!peerConnection) {
        const newPeerConnection = await createPeerConnection(userDetails.partyCode, userDetails.roomId);
        if(newPeerConnection){
          await handleIncomingOffer(data.offer, newPeerConnection, userDetails.partyCode, userDetails.roomId);
        }
      }
        
      }
      // Handle ICE candidate messages
      else if (data.type === 'webrtc-ice-candidate') {
        const peerConnection = peerConnections[userDetails.roomId];
        
        if (peerConnection) {
          console.log("ICE peer Conn ", peerConnection);
          if (peerConnection.remoteDescription && peerConnection.remoteDescription.type) {
            await handleRemoteIceCandidate(data.candidate, peerConnection);
          } else {
            console.warn('Remote description not set yet. Queuing ICE candidate.');
            iceCandidateQueue.push(data.candidate);
          }
        }
      
      }
    };
  }
}


// Get user's audio stream
async function startAudioStream() {
  try {
    localStream = await navigator.mediaDevices.getUserMedia(
      {
        audio: true,
        video: true  // Add this to request video
      });
    localStream.getAudioTracks().forEach(track => track.enabled = !isMuted); // Initially, set the track to be enabled

    // You can now handle video tracks
    localStream.getVideoTracks().forEach(track => {
      // You can control video track's mute state similarly, if needed
      track.enabled = !isMuted
      console.log('Video track initialized');

      const audioTracks = localStream.getAudioTracks();
      const videoTracks = localStream.getVideoTracks();

      if (audioTracks.length > 0 && audioTracks[0].enabled) {
        console.log('Audio is being transmitted.');
      } else {
        console.warn('Audio is muted or not transmitted.');
      }

      if (videoTracks.length > 0 && videoTracks[0].enabled) {
        console.log('Video is being transmitted.');
      } else {
        console.warn('Video is muted or not transmitted.');
      }
    });

  } catch (error) {
    console.error('Error accessing microphone:', error);
  }
}


function addRemoteVideoElement(roomId, stream) {
  const remoteVideo = document.createElement('video');
  remoteVideo.id = `remoteVideo_${roomId}`;
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
function removeRemoteVideoElement(roomId) {
  const remoteVideo = document.getElementById(`remoteVideo_${roomId}`);
  if (remoteVideo) {
    remoteVideo.remove();
    userCount--;
  }
}

// Function to create or retrieve a peer connection
function getPeerConnection(roomId) {
  if (!peerConnections[roomId]) {
    console.log(`Creating new peer connection for room: ${roomId}`);
    const peerConnection = new RTCPeerConnection();

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('Sending ICE candidate');
        ws.send(JSON.stringify({
          type: 'webrtc-ice-candidate',
          candidate: event.candidate,
          roomId: roomId
        }));
      }
    };

    peerConnections[roomId] = peerConnection;
  }

  return peerConnections[roomId];
}


// Handle incoming offer for guests
async function handleIncomingOffer(offer, peerConnection, roomId, partyCode) {
  try{
  if (peerConnection.signalingState !== 'stable') {
    console.warn('Received offer but peer connection is not stable. Current signaling state:', peerConnection.signalingState);
    return; // Exit early if not in stable state
  }

  await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);

  sendWSMessage({
    type: 'webrtc-answer',
    answer,
    roomId,
    partyCode,
  });
  console.log('Answer sent:', answer);
    console.log("The peers state: ", peerConnection.signalingState);
  } catch (error) {
    console.error('Failed to handle incoming offer:', error);
  }
}


// Send WebSocket message
function sendWSMessage(message) {
  ws.send(JSON.stringify(message));
}
// Handle remote ICE candidate
async function handleRemoteIceCandidate(candidate, peerConnection) {
  try {
    // Check if the peer connection is in a stable state before adding the candidate
    if (peerConnection.signalingState === 'stable') {
      await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      console.log('Added remote ICE candidate:', candidate);
    } else {
      console.warn('Cannot add ICE candidate; peer connection is not stable. Current signaling state:', peerConnection.signalingState);
    }
  } catch (error) {
    console.error('Error adding remote ICE candidate:', error);
  }
}

// Handle incoming answer for the host
async function handleIncomingAnswer(answer, peerConnection) {
  try {
    // Ensure the peer connection is in a stable state
    if (peerConnection.signalingState !== 'have-local-offer') {
      console.warn('Received answer but peer connection is not in "have-local-offer" state. Current signaling state:', peerConnection.signalingState);
      return; // Exit early if the signaling state is not as expected
    }

    // Set the remote description using the received answer
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    console.log('Remote description set with answer:', answer);

    // Now that the remote description is set, process any queued ICE candidates
    if (iceCandidateQueue.length > 0) {
      console.log('Processing queued ICE candidates...');
      iceCandidateQueue.forEach(async (candidate) => {
        try {
          await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
          console.log('Queued ICE candidate added successfully:', candidate);
        } catch (error) {
          console.error('Error adding queued ICE candidate:', error);
        }
      });
      iceCandidateQueue = []; // Clear the queue after processing
    }
  } catch (error) {
    console.error('Failed to handle incoming answer:', error);
  }
}


// Function to add queued ICE candidates after the remote description is set
async function addQueuedIceCandidates(roomId) {
  const peerConnection = peerConnections[roomId];

  if (peerConnection && iceCandidateQueues[roomId]) {
    for (const candidate of iceCandidateQueues[roomId]) {
      try {
        await peerConnection.addIceCandidate(candidate);
        console.log('Queued ICE candidate added:', candidate);
      } catch (error) {
        console.error('Error adding queued ICE candidate:', error);
      }
    }
    // Clear the queue after adding all candidates
    iceCandidateQueues[roomId] = [];
  }
}

// Function to create a new peer connection
async function createPeerConnection(partyCode, targetroomId) {
  // Check if a peer connection already exists for the target room
  if (peerConnections[targetroomId]) {
    console.log('Peer connection already exists for room:', targetroomId);
    console.log("Check its state: ", peerConnections[targetroomId].signalingState)

    
    return peerConnections[targetroomId]; // Return the existing connection
  }
  // Create a new RTCPeerConnection
  const newPeerConnection = new RTCPeerConnection(iceServers);
  peerConnections[targetroomId] = newPeerConnection;

  console.log('Peer connection created for room:', targetroomId);

  // Set up ICE candidate handling
  newPeerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      sendWSMessage({
        type: 'webrtc-ice-candidate',
        candidate: event.candidate,
        roomId: targetroomId,
        partyCode,
      });
    }
  };

  // Handle the remote stream
  newPeerConnection.ontrack = (event) => {
    console.log('Received remote track:', event.streams[0]);
    addRemoteVideoElement(targetroomId, event.streams[0]); // Display the remote video
  };

  // Add local media tracks to the peer connection
  localStream.getTracks().forEach((track) => newPeerConnection.addTrack(track, localStream));

  console.log('Local tracks added to the new peer connection.');
  console.log("The new connections state: ", newPeerConnection.signalingState);
  return newPeerConnection; // Return the created peer connection
}

function updateAudioStatus(isTransmitting) {
  const audioStatusElement = document.createElement('audio'); // Make sure to use the correct ID
  audioStatusElement.id = 'audio-status';
  if (audioStatusElement) {
    audioStatusElement.textContent = isTransmitting ? 'Audio is being transmitted.' : 'No audio packets received.';
  } else {
    console.warn('Audio status element not found in the DOM.');
    // Optionally, create the element if needed
    const newAudioStatusElement = document.createElement('div');
    newAudioStatusElement.id = 'audio-status';
    newAudioStatusElement.textContent = isTransmitting ? 'Audio is being transmitted.' : 'No audio packets received.';
    document.body.appendChild(newAudioStatusElement); // Append to body or another container
  }}

async function createOffer(peerConnection, roomId, partyCode) {
  try {
    // Create the offer
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    // Send the offer via WebSocket or any other signaling method
    await sendWSMessage({
      type: 'webrtc-offer',
      offer: offer,
      roomId: roomId,
      partyCode: partyCode,
    });

    console.log('Offer created and sent:', offer);
  } catch (error) {
    console.error('Failed to create offer:', error);
  }
}
// Fetch roomId and WebSocket connection from storage
chrome.storage.sync.get(['roomId', 'websocket'], (result) => {
  const roomId = result.roomId;
  ws = result.websocket;

  if (!roomId) {
    console.error('No roomId found. WebSocket connection cannot be established.');
    return;
  }
});



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
    addChatMessage("System", "No Messages Yet", true); // Centered messag
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



// Start watch party for the host
async function startWatchParty() {
  const userDetails = await getUserDetails();
  await getLocalStream();
  await initializeWebSocket(userDetails.roomId);
  //console.log("Peer Conn", existingPeerConnection)
  console.log('Starting watch party as host.');
}

// Join watch party for guests
async function joinWatchParty() {
  const userDetails = await getUserDetails();
  await getLocalStream();
  await initializeWebSocket(userDetails.roomId);
  console.log('Joining watch party as guest.');
}

// Start or join the party based on user role (host/guest)
async function startOrJoinParty() {
  const { isHost } = await getUserDetails();
  if (isHost) {
    await startWatchParty();
  } else {
    await joinWatchParty();
  }
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
// Trigger the appropriate function based on user role
startOrJoinParty();

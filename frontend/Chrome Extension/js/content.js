
let remoteDescriptionSet = false;
let localStream;
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

// Function to dynamically retrieve username, party code, and room ID
function getUserDetails() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(['username', 'partyCode', 'roomId'], (data) => {
      let { username = null, partyCode = null, roomId = null } = data;

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

      // Prompt for room ID if missing
      if (!roomId) {
        roomId = prompt("Enter your room ID:");
        if (roomId) {
          chrome.storage.sync.set({ roomId });
        }
      }

      // Check for valid details
      if (!username || !partyCode || !partyCode.trim() || !roomId) {
        alert("Error: Username, valid party code, and room ID are required!");
        return reject("Missing username, party code, or room ID");
      }

      resolve({ username, partyCode, roomId });
    });
  });
}

// Function to handle WebSocket open and offer creation
async function initializeWebSocket(roomId) {
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    console.log('No WebSocket connection found or not open. Initializing new connection.');
    ws = new WebSocket(`wss://moviehub-watchparty-extension.glitch.me?roomId=${roomId}`);
    const userDetails = await getUserDetails();
    ws.onopen = () => {
      console.log('WebSocket connection opened');

      // Once WebSocket is open, create and send the offer
      createAndSendOffer(userDetails.partyCode, userDetails.roomId);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
      chrome.storage.sync.remove('websocket');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onmessage = async (message) => {
      const data = JSON.parse(message.data);
      const peerConnection = peerConnections[userDetails.roomId];

      if (data.type === 'webrtc-offer') {
        console.log('Received offer:', data.offer);
       await handleIncomingOffer(data.offer, userDetails.partyCode, userDetails.roomId)
      }else if (data.type === 'webrtc-answer') {
        console.log("Answer??? => " + JSON.stringify(data));
        console.log("peerConnection??", peerConnection);
        if (peerConnection) {
          peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer))
            .then(() => {
              // Now it's safe to send queued ICE candidates
              iceCandidateQueue.forEach(candidate => {
                peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
                  .catch(error => {
                    console.error('Error adding ICE candidate:', error);
                  });
              });
              iceCandidateQueue = []; // Clear the queue after sending
              console.log('All queued ICE candidates added after setting remote description');
            });
          console.log('Received and set remote answer');
        }
      } else if (data.type === 'webrtc-ice-candidate') {
        console.log("can DATA ??? => " + data);
        const peerConnection = peerConnections[userDetails.roomId];
        console.log("spmethingggg", userDetails.roomId);
        console.log("peerConnection??", peerConnection);
        if (peerConnection) {
          peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate))
            .then(() => {
              console.log('Added remote ICE candidate');
            })
            .catch(error => {
              console.error('Error adding remote ICE candidate:', error);
            });
        }
      }
    };

  } else {
    console.log('Using existing WebSocket connection');
    // Create and send the offer immediately if the WebSocket is already open
    const userDetails = await getUserDetails();
    //createAndSendOffer(userDetails.partyCode, userDetails.roomId);

    ws.onmessage = async (message) => {
      const data = JSON.parse(message.data);
      const peerConnection = peerConnections[userDetails.roomId];

      if (data.type === 'webrtc-offer') {
        console.log('Received offer:', data.offer);
      await handleIncomingOffer(data.offer, userDetails.partyCode, userDetails.roomId)
      }
       else if(data.type === 'webrtc-answer') {
        console.log("Answer??? => " + JSON.stringify(data));
        console.log("spmethingggg", userDetails.roomId);
        console.log("peerConnection??", peerConnection);
        if (peerConnection) {
          peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer))
            .then(() => {
              // Now it's safe to send queued ICE candidates
              iceCandidateQueue.forEach(candidate => {
                peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
                  .catch(error => {
                    console.error('Error adding ICE candidate:', error);
                  });
              });
              iceCandidateQueue = []; // Clear the queue after sending
              console.log('All queued ICE candidates added after setting remote description');
            });
          console.log('Received and set remote answer');
        }
      } else if (data.type === 'webrtc-ice-candidate') {
        console.log("can DATA ??? => " + data);
        const peerConnection = peerConnections[userDetails.roomId];
        console.log("spmethingggg", userDetails.roomId);
        console.log("peerConnection??", peerConnection);
        if (peerConnection) {
          peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate))
            .then(() => {
              console.log('Added remote ICE candidate');
            })
            .catch(error => {
              console.error('Error adding remote ICE candidate:', error);
            });
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
async function handleIncomingOffer(offer, partyCode, roomId) {
  // Check if offer is valid
  if (!offer || !offer.sdp || !offer.type) {
    console.error('Invalid offer received:', offer);
    return;
  }

  const peerConnection = createPeerConnection(partyCode, roomId);

  try {
    // Set the remote description using the valid offer
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

    // Create and send an answer
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    ws.send(JSON.stringify({
      type: 'webrtc-answer',
      answer: answer,
      targetroomId: roomId,
      partyCode: partyCode
    }));

    console.log('Answer sent back to the server:', answer);

    processIceCandidates(peerConnection); // Process queued ICE candidates if any

  } catch (error) {
    console.error('Error setting remote description or creating answer:', error);
  }
}


// Function to process queued ICE candidates
function processIceCandidates(peerConnection) {
  iceCandidateQueue.forEach(candidate => {
    peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
      .catch(error => console.error('Error adding ICE candidate:', error));
  });
  iceCandidateQueue = []; // Clear the queue after adding candidates
}

// Function to initialize WebRTC peer connection
function createPeerConnection(partyCode, targetroomId) {
  // Check if peer connection already exists
  if (peerConnections[targetroomId]) {
    return peerConnections[targetroomId]; // Reuse existing connection
  }
  
  const peerConnection = new RTCPeerConnection();
  peerConnections[targetroomId] = peerConnection;

console.log(`createPeerConnection: ${partyCode}`)
  // Add local stream tracks to the peer connection
  if (localStream) {
    localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));
  } else {
    console.error("Local stream is not available.");
  }

  // Handle ICE Candidate event
  peerConnection.onicecandidate = function (event) {
    if (event.candidate) {
      // Queue ICE candidate until the WebSocket connection is open and the offer has been sent
      iceCandidateQueue.push(event.candidate); 
      console.log('Queued ICE candidate:', event.candidate);
    }
  };
console.log("Done with candidate");

  // peerConnection.iceconnectionstatechange = () => {
  //   console.log('Connection state:', peerConnection.connectionState);
  //   if (peerConnection.connectionState === 'connected') {
  //     console.log('Connected to peer!');
  //   } else if (peerConnection.connectionState === 'disconnected') {
  //     console.error('Disconnected from peer.');
  //   }
  // };

  const connectionSate = peerConnection.connectionState;
  console.log("The peers connect state=> ", connectionSate)

  // peerConnection.oniceconnectionstatechange = () => {
  //   console.log('ICE connection state:', peerConnection.iceConnectionState);
  //   if (peerConnection.iceConnectionState === 'failed') {
  //     console.error('ICE connection failed.');
  //   }
  // };
  // Handle remote media streams
  peerConnection.ontrack = (event) => {
    const remoteStream = event.streams[0];
    addRemoteVideoElement(targetroomId, remoteStream);
    console.log('Received remote stream:', remoteStream);
  };

  setInterval(async () => {
    if (peerConnection) {
      const stats = await peerConnection.getStats();
      stats.forEach(report => {
       // console.log("Check Stats ", report); // Log all reports to inspect
        // Check for inbound RTP reports
        if (report.type === 'inbound-rtp' && report.kind === 'audio') {
          console.log("Packets Recieved ", report.packetsReceived)
          if (report.packetsReceived > 0) {
            console.log('Audio is being transmitted.');
            // Optionally, update UI to indicate successful transmission
            updateAudioStatus(report.packetsReceived > 0);
          } else {
            console.warn('No audio packets received!');
            // Optionally, update UI to indicate issues
            updateAudioStatus(report.packetsReceived < 0);
          }
        }
      });
    }
  }, 10000); // Adjust the interval as necessary


  return peerConnection;
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

// Add this function to create and send the WebRTC offer
async function createAndSendOffer(partyCode, targetroomId) {
  const userDetails = await getUserDetails();

  console.log("About to send offer to ", userDetails.partyCode);
  const peerConnection = createPeerConnection(userDetails.partyCode, userDetails.targetroomId);
  // Handle ICE candidate gathering
  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      console.log('Sending ICE candidate:', event.candidate);

      // Queue the ICE candidate if WebSocket is not open
      if (ws.readyState !== WebSocket.OPEN) {
        iceCandidateQueue.push(event.candidate);
        console.warn('WebSocket is not open. ICE candidate queued.');
        return;
      }

      // Send ICE candidate to WebSocket server
      ws.send(JSON.stringify({
        type: 'webrtc-ice-candidate',
        candidate: event.candidate,
        targetroomId: targetroomId,
        partyCode: partyCode
      }));

      console.log('ICE candidate sent to server:', event.candidate);
    }
  };
  console.log("Innn create Offer");
  try {
    // Create an offer
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    // Only attempt to send once WebSocket is open
    if (ws.readyState === WebSocket.OPEN) {
    // Send the offer to the server
    ws.send(JSON.stringify({
      type: 'webrtc-offer',
      offer: offer,
      targetroomId: targetroomId,
      partyCode: partyCode
    }));
      console.log('Offer sent to the server:', offer);

      // Send queued ICE candidates once the offer is sent
      if (iceCandidateQueue.length > 0) {
        iceCandidateQueue.forEach(candidate => {
          ws.send(JSON.stringify({
            type: 'webrtc-ice-candidate',
            candidate: candidate,
            targetroomId: targetroomId,
            partyCode: partyCode
          }));
          console.log('Queued ICE candidate sent to server:', candidate);
        });
        iceCandidateQueue = []; // Clear the queue after sending
      }

      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      // Send queued ICE candidates once the offer is sent
      // Create an answer and send it back to the server
   
    // } else {
    //   console.warn('WebSocket is not open. ICE candidates will not be sent.');
    
    }

    console.log("Out of createAndSendOffer");
  } catch (error) {
    console.error('Error creating and sending offer:', error);
  }
}


let ws;
let peerConnections = {};
let isMuted = false;
let isVideoMuted = false;
let userCount = 0; // Initialize the user count
const MAX_USERS = 5;
let iceCandidateQueue = []; // Queue to store ICE candidates before WebSocket is open

// Fetch roomId and WebSocket connection from storage
chrome.storage.sync.get(['roomId', 'websocket'], (result) => {
  const roomId = result.roomId;
  ws = result.websocket;

  if (!roomId) {
    console.error('No roomId found. WebSocket connection cannot be established.');
    return;
  }
  // Start getting local stream and initialize WebSocket
  getLocalStream().then(() => {
    initializeWebSocket(roomId);
  });
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



// Start WebRTC audio when party starts
async function startWatchParty() {
const userDetails = await getUserDetails();
  await startAudioStream();
  addLocalVideoElement(); // Add the local video element
  console.log('Local Stream Tracks:', localStream.getTracks());

console.log("Code??? ",userDetails.partyCode);
  
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

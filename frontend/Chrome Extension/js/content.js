//styling related
function addFontAwesome() {
  const link = document.createElement("link");
  link.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css";
  link.rel = "stylesheet";
  document.head.appendChild(link);
}

// Call this function to add Font Awesome
addFontAwesome();
function injectStyles() {
  const styles = `
        #localVideo, .remoteVideo {
            position: fixed;
            top: 10px;
            width: 200px;
            height: 150px;
            border-radius: 8px;
            border: 2px solid #7e57c2;
            z-index: 1000;
        }

        .remoteVideo {
            right: 10px;
            z-index: 999;
        }

        .micButton, .videoButton {
            position: fixed;
            bottom: 20px;
            z-index: 10000;
            background-color: #7e57c2;
            color: white;
            padding: 10px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }

        .micButton {
            right: 320px;
        }

        .videoButton {
            right: 220px;
        }

        #watchPartyChat {
            position: fixed;
            top: 0;
            right: 0;
            width: 300px;
            height: 100vh;
            background-color: #f3f4f6;
            color: black;
            overflow-y: none; /* Allow scrolling if content overflows */
            box-shadow: -2px 0 10px rgba(0, 0, 0, 0.5);
            padding: 20px;
            z-index: 9999;
            border-left: 4px solid #4a42c0;
            display: none;
        }

        .heading-container {
            border-bottom: 2px solid #4a42c0;
        }

        h1 {
            text-align: center;
            color: #4a42c0;
            font-family: Poppins, sans-serif;
        }

        .subHeading {
            text-align: center;
            color: #4a42c0;
            margin-bottom: 10px;
            font-family: Poppins, sans-serif;
        }

        p.chat-message {
            margin-bottom: 10px;
            padding: 5px;
            border-radius: 5px;
            background-color: #e1bee7;
            color: black;
            transition: background-color 0.3s;
        }

        p.chat-message:hover {
            background-color: #9575cd;
        }

        .input-container {
            position: absolute;
            bottom: 50px;
            width: 85%;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 10px;
        }

        .chat-input {
            flex: 1;
            border: 2px solid #4a42c0;
            border-radius: 20px;
            padding: 10px;
            outline: none;
            font-size: 16px;
            margin-right: 10px;
        }

        .send-button {
            background-color: #4a42c0;
            color: white;
            padding: 10px 10px;
            border: none;
            border-radius: 50%;
            cursor: pointer;
        }

        .send-button:hover {
            background-color: #7e57c2;
        }

        .control-buttons {
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
        }

        .control-button {
            background-color: #4a42c0;
            color: white;
            padding: 10px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        
        .control-button:hover {
            background-color: #7e57c2;
        }
        
        .chat-message {
            margin-bottom: 10px;
            padding: 5px;
            border-radius: 5px;
            color: black;
            transition: background-color 0.3s;
        }

        .chat-message:hover {
            background-color: #9575cd; /* Change background on hover */
        }

        /* User message styles */
        .chat-message.user {
            background-color: #a5d6a7; /* Light green for user's messages */
        }

        .chat-message.user:hover {
            background-color: #81c784; /* Darker green on hover */
        }

        /* Other messages styles */
        .chat-message.other {
            background-color: #e1bee7; /* Light purple for other messages */
        }

        .chat-message.other:hover {
            background-color: #9575cd; /* Change background on hover */
        }

        .error-message {
            font-family: Poppins, sans-serif;
            text-align: center;
        }

        .error-image {
            display: flex;
            width: 100%;
            justify-content: center;
            transform: scale(0.r);
            margin-bottom: 10px;
            padding-top: 20px;
        }
    `;

  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
  console.log("Styles injected");
}

// Call this function when you need to apply the styles
injectStyles();

// CHATBOX & CONTROLS

const chatBox = document.createElement("div");
function createChatBox() {
  chatBox.id = "watchPartyChat";

  // Create heading and subHeading elements
  const heading = document.createElement("h1");
  heading.className = "heading";
  heading.textContent = "MovieHub";

  const subHeading = document.createElement("h3");
  subHeading.className = "subHeading";
  subHeading.textContent = "Watch Party";

  chatBox.innerHTML = `
        <div class="heading-container">
            <h1 class="heading">MovieHub</h1>
            <h3 class="subHeading">Watch Party</h3>
        </div>
        <div id="messages"></div>
        <div class="input-container">
            <input type="text" class="chat-input" placeholder="Type a message..." />
            <button class="send-button">
                <i class="fa fa-paper-plane"></i>
            </button>
        </div>
        <div class="control-buttons">
        <button class="control-button micButton" id="muteButton" aria-pressed="false">
        <i class="fa fa-microphone" id="micIcon"></i> 
            </button>
            <button class="control-button videoButton" id="videoButton" aria-pressed="false">
                <i class="fa fa-video" id="videoIcon"></i>
            </button>
        </div>
    `;


  // // Append headings to the heading container==No need??
  // const headingContainer = chatBox.querySelector(".heading-container");
  // headingContainer.appendChild(heading);
  // headingContainer.appendChild(subHeading);

  document.body.appendChild(chatBox);

  // Reference to the input and send button
  const chatInput = chatBox.querySelector(".chat-input");
  const sendButton = chatBox.querySelector(".send-button");

  // Mute/Unmute toggle functionality
  const muteButton = document.getElementById("muteButton");
  const micIcon = document.getElementById("micIcon");

  muteButton.addEventListener("click", () => {
    const isMuted = muteButton.getAttribute("aria-pressed") === "true";
    muteButton.setAttribute("aria-pressed", !isMuted);
    !isMuted ? (localStream.getAudioTracks()[0].enabled = false) : (localStream.getAudioTracks()[0].enabled = true);
    micIcon.className = isMuted ? "fa fa-microphone" : "fa fa-microphone-slash";
  });

  // Start/Stop Video toggle functionality
  const videoButton = document.getElementById("videoButton");
  const videoIcon = document.getElementById("videoIcon");

  videoButton.addEventListener("click", () => {
    const isVideoStopped = videoButton.getAttribute("aria-pressed") === "true";
    videoButton.setAttribute("aria-pressed", !isVideoStopped);
    !isVideoStopped ? (localStream.getVideoTracks()[0].enabled = false) : (localStream.getVideoTracks()[0].enabled = true);
    videoIcon.className = isVideoStopped ? "fa fa-video" : "fa fa-video-slash";
  });

  // Add click event to send button
  // sendButton.addEventListener("click", () => {
  //   const messageText = chatInput.value.trim();
  //   if (messageText) {
  //     addChatMessage("User", messageText, true); // Pass true to indicate it's the user's message
  //     chatInput.value = ""; // Clear input after sending
  //   }
  // });
}



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
let lastMessageId = null; // Track the last message ID to detect new messages

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

  // Get the local video element
  const localVideo = document.getElementById('localVideo');

  if (localVideo) {
    // Get the position of the local video
    const localVideoRect = localVideo.getBoundingClientRect();

    // Style the remote video element to be positioned next to the local video
    Object.assign(remoteVideo.style, {
      position: 'fixed',
      top: `${localVideoRect.top}px`, // Align the top with the local video
      left: `${localVideoRect.right + 10}px`, // Position 10px to the right of the local video
      width: '200px',
      height: '150px',
      borderRadius: '8px',
      border: '2px solid #7e57c2',
      zIndex: '999',
    });
  } else {
    // If local video doesn't exist, fall back to a default position
    Object.assign(remoteVideo.style, {
      position: 'fixed',
      top: '10px',
      right: `${userCount * 210}px`, // Space them out horizontally if needed
      width: '200px',
      height: '150px',
      borderRadius: '8px',
      border: '2px solid #7e57c2',
      zIndex: '999',
    });
  }

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




// Function to fetch watch party chat messages
async function fetchChatMessages(username, partyCode) {
  try {
    const response = await fetch(`http://localhost:3000/party/${partyCode}/chat`);

    const data = await response.json();
    console.log(data);
    console.log("Res, " + response)
    if (data.error) {
      // create error message on the screen
      const errorMessage = document.createElement("p");
      errorMessage.textContent = data.error;
      errorMessage.className = "error-message";
      chatBox.appendChild(errorMessage);

      if (data.error.includes("watch party")) {
        // additional error message
        const subErrorMessage = document.createElement("p");
        subErrorMessage.textContent = "Either the party code you entered is invalid or the watch party has ended. Please try again.";
        subErrorMessage.className = "error-message sub-error-message";
        chatBox.appendChild(subErrorMessage);
        // add an image to the screen
        const image = document.createElement("img");
        image.src = "./icons/undraw_Not_found_re_bh2e.svg";
        image.className = "error-image";
        chatBox.appendChild(image);
      }
    }

    if (response.ok) {
      if (data.messages && data.messages.length > 0) {
        const latestMessage = data.messages[data.messages.length - 1];

        if (latestMessage.id !== lastMessageId) { // Only update if new message
          lastMessageId = latestMessage.id;
          updateChatMessages(data.messages, username);
        }
      }
    } 
    // else if (data.message == "No messages available in the chat room.") {
    //   addChatMessage("System", "An error occurred while fetching chat messages.");
    // }
    else {
      // console.log("Error fetching chat messages:", error);
      // hide input container and show error message
      const inputContainer = document.querySelector(".input-container");
      if (inputContainer) {
        inputContainer.style.display = "none";
      }
      
    }
   
    // createChatInputContainer({ username, partyCode });
  } catch (error) {
    console.log("Error fetching chat messages:", error);
    // hide input container and show error message
    const inputContainer = document.querySelector(".input-container");
    if (inputContainer) {
      inputContainer.style.display = "none";
    }
    addChatMessage("System", "An error occurred while fetching chat messages.", true);
  }
}


// Function to update chat messages in the chat box
function updateChatMessages(messages, currentUsername) {
  const messagesContainer = chatBox.querySelector("#messages");
  console.log("Any messages? ", messages);
  messagesContainer.innerHTML = ''; // Clear previous messages

  if (messages && messages.length > 0) {
    console.log("There should be a message");
    messages.forEach(msg => {
      const isUser = msg.username === currentUsername; // Check if the message is from the current user
      addChatMessage(msg.username, msg.text, isUser, msg.timestamp); // Pass isUser to addChatMessage for styling
    });
  } else {
    addChatMessage("System", "No Messages Yet", true); // Centered message
  }

  console.log("Any messages? ", messages);
  console.log("End of Update");
}

// Function to generate a unique message ID
function generateMessageId() {
  const timestamp = new Date().getTime();
  const randomNum = Math.floor(Math.random() * 100000); // Generate a random number
  return `${timestamp}-${randomNum}`;
}

// Function to send chat message
async function sendMessage(partyCode, username, text) {
  const messageId = generateMessageId(); // Generate unique message ID
  isUser = true;
  try {
    const response = await fetch(`http://localhost:3000/party/${partyCode}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: messageId, username, text }), // Include messageId in the request
    });
    if (!response.ok) {
      console.error('Failed to send message:', response.statusText);
    }
  } catch (error) {
    console.error('Error sending message:', error);
  }
}


// Function to add chat message to the chat box
function addChatMessage(username, text, isUser, timestamp) {
  const chatMessage = document.createElement("p");

  // Format the timestamp
  const formattedTime = new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  chatMessage.textContent = `[${username}] ${text} - ${formattedTime}`; // Append the timestamp to the message
  chatMessage.className = "chat-message"; // Assign the base chat-message class

  // Add user-specific class for different styling
  if (isUser) {
    chatMessage.classList.add("user"); // Add class for user messages
  } else {
    chatMessage.classList.add("other"); // Add class for other messages
  }

  const messagesContainer = document.getElementById("messages");
  if (messagesContainer) {
    messagesContainer.appendChild(chatMessage);
  }
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
    // Call this function to create the chat box

    //chatBox.style.display = 'block'; // Show chat box when user details are available

    console.log("fetch ");
    fetchChatMessages(userDetails.username, userDetails.partyCode); // Fetch initial chat messages
    console.log("create chat box");
    createChatBox();
  //  createChatInputContainer(userDetails);
    console.log("Before Int");
    chatBox.style.display = 'block';
    const chatInput = chatBox.querySelector(".chat-input");
    const sendButton = chatBox.querySelector(".send-button");
    // Add click event to send button
    sendButton.addEventListener("click", async () => {
      const messageText = chatInput.value.trim();
      if (messageText) {
        await sendMessage(userDetails.partyCode, userDetails.username, messageText); // Call sendMessage to send the message to the server
        addChatMessage(userDetails.username, messageText, true); // Display the user's message in the chat
        chatInput.value = ""; // Clear input after sending
      }
    });
    // Set an interval to fetch chat messages every 5 seconds
    setInterval(() => {
      fetchChatMessages(userDetails.username, userDetails.partyCode);
      //createChatInputContainer(userDetails);
    }, 5000); // Adjust interval as necessary (5000ms = 5 seconds)
  } catch (error) {
    console.error('Initialization error:', error);
  }
}

// Start the chat interface
initChat();
// Trigger the appropriate function based on user role
startOrJoinParty();

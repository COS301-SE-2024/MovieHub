var localStream;
let peerConnections = {};
const signalingSocket = new WebSocket("ws://localhost:3000");

let isMuted = false;
let isVideoMuted = false;

// Max number of users in the watch party
const MAX_USERS = 5;
let userCount = 0;

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

// Function to dynamically retrieve username and party code
function getUserDetails() {
    return new Promise((resolve, reject) => {
        const isChrome = typeof chrome !== 'undefined' && typeof chrome.storage !== 'undefined';
        const storage = isChrome ? chrome.storage.sync : localStorage;

        // Retrieve stored data
        const username = storage.getItem('username') || null;
        const partyCode = storage.getItem('partyCode') || null;

        // Prompt for username if missing
        let newUsername = username;
        if (!newUsername) {
            newUsername = prompt("Enter your username:");
            if (newUsername) {
                storage.setItem('username', newUsername);
            }
        }

        // Prompt for party code if missing
        let newPartyCode = partyCode;
        if (!newPartyCode || !newPartyCode.trim()) {
            newPartyCode = prompt("Enter your valid party code:");
            if (newPartyCode && newPartyCode.trim()) {
                storage.setItem('partyCode', newPartyCode.trim());
            }
        }

        // Check for valid details
        if (!newUsername || !newPartyCode || !newPartyCode.trim()) {
            return reject("Missing username or party code");
        }

        resolve({ username: newUsername, partyCode: newPartyCode });
    });
}


// CHATBOX & CONTROLS

const chatBox = document.createElement("div");
function createChatBox() {
    chatBox.id = "watchPartyChat";

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
    sendButton.addEventListener("click", () => {
        const messageText = chatInput.value.trim();
        if (messageText) {
            addChatMessage("User", messageText, true); // Pass true to indicate it's the user's message
            chatInput.value = ""; // Clear input after sending
        }
    });
}

// Call this function to create the chat box
createChatBox();

// Function to add chat message to the chat box
function addChatMessage(username, text, isUser = false) {
    const chatMessage = document.createElement("p");
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); // Format the time as HH:MM
    chatMessage.textContent = `[${username}] ${text} - ${timestamp}`; // Append the timestamp to the message
    chatMessage.className = "chat-message"; // Assign the base chat-message class

    // Add user-specific class for different styling
    if (isUser) {
        chatMessage.classList.add("user"); // Add class for user messages
    } else {
        chatMessage.classList.add("other"); // Add class for other messages
    }

    const messagesContainer = document.getElementById("messages");
    messagesContainer.appendChild(chatMessage);
}

// Function to send chat message
async function sendMessage(partyCode, username, text) {
    try {
        const response = await fetch(`http://localhost:3000/party/${partyCode}/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, text }),
        });
        if (!response.ok) {
            console.error("Failed to send message:", response.statusText);
        }
    } catch (error) {
        console.error("Error sending message:", error);
    }
}

// Function to fetch watch party chat messages
async function fetchChatMessages(username, partyCode) {
    try {
        const response = await fetch(`http://localhost:3000/party/${partyCode}/chat`);
        
        const data = await response.json();
        console.log(data);
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
            updateChatMessages(data.messages);
        } else {
            console.log("Error fetching chat messages:", error);
            // hide input container and show error message
            const inputContainer = document.querySelector(".input-container");
            inputContainer.style.display = "none";
        }

        // createChatInputContainer({ username, partyCode });
    } catch (error) {
        console.log("Error fetching chat messages:", error);
        // hide input container and show error message
        const inputContainer = document.querySelector(".input-container");
        inputContainer.style.display = "none";

        addChatMessage("System", "An error occurred while fetching chat messages.");
    }
}

// Function to update chat messages in the chat box
function updateChatMessages(messages) {
    chatBox.innerHTML = ""; // Clear previous messages
    // chatBox.appendChild(heading);
    // chatBox.appendChild(subHeading);

    if (messages && messages.length > 0) {
        messages.forEach((msg) => addChatMessage(msg.username, msg.text));
    } 
    else {
        addChatMessage("System", "No Messages Yet", true); // Centered message
    }

    // if no messages yet display an invte to chat
    if (messages.length === 0) {
        const chatMessage = document.createElement("p");
        chatMessage.textContent = "No messages yet. Invite your friends to chat.";
        chatBox.appendChild(chatMessage);
    }

    console.log("End of Update");
}

// VIDEO & AUDIO

async function addLocalVideoElement() {
    // localStream = await navigator.mediaDevices.getUserMedia({ video: true });
    const localVideo = document.createElement("video");
    localVideo.id = "localVideo";
    localVideo.autoplay = true;
    localVideo.srcObject = localStream;
    // mirror the video
    localVideo.style.transform = "scaleX(-1)";

    document.body.appendChild(localVideo);
}

function addRemoteVideoElement(socketId, stream) {
    const remoteVideo = document.createElement("video");
    remoteVideo.id = `remoteVideo_${socketId}`;
    remoteVideo.srcObject = stream;
    remoteVideo.autoplay = true;
    remoteVideo.playsInline = true;

    // Apply the remote video class for styling
    remoteVideo.className = "remoteVideo";
    remoteVideo.style.right = `${userCount * 210}px`; // Space them out horizontally

    document.body.appendChild(remoteVideo);
    userCount++;
}

async function startAudioStream() {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true, // Add this to request video
        });
        localStream.getAudioTracks().forEach((track) => (track.enabled = !isMuted)); // Initially, set the track to be enabled

        // You can now handle video tracks
        localStream.getVideoTracks().forEach((track) => {
            // You can control video track's mute state similarly, if needed
            track.enabled = !isMuted;
            console.log("Video track initialized");
        });
    } catch (error) {
        console.error("Error accessing microphone:", error);
    }
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
    localStream.getTracks().forEach((track) => peerConnection.addTrack(track, localStream));

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            signalingSocket.send(
                JSON.stringify({
                    type: "webrtc-ice-candidate",
                    candidate: event.candidate,
                    targetSocketId: targetSocketId,
                    partyCode,
                })
            );
        }
    };

    // Handle remote media streams (audio and video)
    peerConnection.ontrack = (event) => {
        const remoteStream = event.streams[0];
        addRemoteVideoElement(targetSocketId, remoteStream);

        // Audio handling
        const remoteAudio = new Audio();
        remoteAudio.srcObject = remoteStream;
        remoteAudio.play();

        // Video handling
        const remoteVideo = document.createElement("video");
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

    if (data.type === "webrtc-offer") {
        const peerConnection = createPeerConnection(data.partyCode, data.socketId);
        await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);

        signalingSocket.send(
            JSON.stringify({
                type: "webrtc-answer",
                answer: answer,
                targetSocketId: data.socketId,
                partyCode: data.partyCode,
            })
        );

        peerConnections[data.socketId] = peerConnection;
    } else if (data.type === "webrtc-answer") {
        const peerConnection = peerConnections[data.socketId];
        await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
    } else if (data.type === "webrtc-ice-candidate") {
        const peerConnection = peerConnections[data.socketId];
        if (peerConnection) {
            await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
        }
    } else if (data.type === "user-disconnected") {
        removeRemoteVideoElement(data.socketId);
    }
};

async function startWatchParty() {
    try {
        await startAudioStream();
    } catch (error) {
        console.error("Error accessing microphone:", error);
    }

    addLocalVideoElement();
    console.log("Local Stream Tracks:", localStream.getTracks());

    signalingSocket.onopen = () => {
        signalingSocket.send(
            JSON.stringify({
                type: "join-party",
                partyCode: `${userDetails.partyCode}`,
                username: `${userDetails.username}`,
            })
        );
    };
}

async function initialiseChat() {
    try {
        const userDetails = await getUserDetails();
        chatBox.style.display = "block"; // Show chat box when user details are available
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
        console.error("Initialization error:", error);
    }
}

initialiseChat();
startWatchParty();
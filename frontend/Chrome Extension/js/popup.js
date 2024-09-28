let ws; // Global WebSocket variable
function generateUniqueId() {
    return Math.random().toString(36).substr(2, 9); // Example ID generation
}
// Function to establish WebSocket connection
function connectWebSocket(roomId, user, party) {
    if (ws && ws.readyState === WebSocket.OPEN) {
        console.log('WebSocket already connected.');
        return ws; // Return existing connection if already open
    }

    ws = new WebSocket(`wss://moviehub-watchparty-extension.glitch.me?roomId=${roomId}`);

    ws.onopen = () => {
        console.log('WebSocket connection established', w.id);
        ws.send(JSON.stringify({
            type: 'join-party',
            partyCode: party,
            username: user,
            roomId : roomId
        }));
    };

    ws.onmessage = (event) => {
        console.log('Received:', event.data);
    };

    ws.onclose = () => {
        console.log('WebSocket connection closed');
        // Try to reconnect if disconnected
        setTimeout(() => connectWebSocket(roomId, user, party), 5000); // Reconnect after 5 seconds
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        alert('WebSocket connection error occurred.');
    };

    // Store WebSocket connection and roomId in chrome.storage.sync
    chrome.storage.sync.set({ roomId: roomId }, () => {
        console.log('Stored roomId:', roomId);
    });

    return ws;
}

document.getElementById("startPartyBtn").addEventListener("click", async () => {
    // Generate a unique party code
    const partyCode = Math.random().toString(36).substr(2, 6).toUpperCase();
    const roomShortCode = document.getElementById("roomShortCode").value;
    const username = document.getElementById("username").value;

    // Ensure both fields are filled
    if (!roomShortCode) {
        alert("Please enter the room's code.");
        return;
    }

    if (!username) {
        alert("Please enter your username.");
        return;
    }

    // Logic to start the watch party with the room short code
    document.getElementById("partyCode").innerText = `Party Code: ${partyCode}`;

    // Send the code to the backend and broadcast to the chatroom
    const response = await fetch('http://localhost:3000/party/start', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, roomShortCode, partyCode }),
    });

    const data = await response.json();
    console.log("The watch party data: ", data);

    if (response.ok) {
        alert("Watch party started!");

        // Store username, partyCode, and roomId in chrome.storage.sync
        chrome.storage.sync.set({ username, partyCode, roomId: data.roomId }, () => {
            console.log("Stored username, partyCode, and roomId in chrome.storage.sync:", { username, partyCode, roomId: data.roomId });
        });

        // Connect WebSocket with roomId
        connectWebSocket(data.roomId, username, partyCode);
    } else {
        alert("Error starting the watch party.");
    }
});

document.getElementById("joinPartyBtn").addEventListener("click", async () => {
    const username = document.getElementById("username2").value;
    const joinCode = document.getElementById("joinCode").value;

    // Ensure both fields are filled
    if (!username) {
        alert("Please enter your username.");
        return;
    }

    if (!joinCode) {
        alert("Please enter a valid watch party code.");
        return;
    }

    // Backend API endpoint for joining the watch party
    const joinPartyApiUrl = 'http://localhost:3000/party/join';

    try {
        // Send request to join the party with the username and party code
        const response = await fetch(joinPartyApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                partyCode: joinCode
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Joined watch party!");

            // Store username, partyCode, and roomId in chrome.storage.sync
            chrome.storage.sync.set({ username, partyCode: joinCode, roomId: data.roomId }, () => {
                console.log("Stored username, partyCode, and roomId in chrome.storage.sync:", { username, partyCode: joinCode, roomId: data.roomId });
            });

            // Connect WebSocket with roomId
            connectWebSocket(data.roomId, username, joinCode);

        } else {
            alert(`Failed to join party: ${data.message}`);
        }
    } catch (error) {
        console.error('Error joining the watch party:', error);
        alert('An error occurred while trying to join the watch party. Please try again.');
    }
});

// Handle audio stream for WebRTC
navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    // Use this stream in your WebRTC connection
    stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
}).catch(error => {
    console.error('Error accessing audio devices:', error);
});

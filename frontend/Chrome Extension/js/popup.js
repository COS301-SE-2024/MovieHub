document.getElementById("startPartyBtn").addEventListener("click", async () => {
    // Generate a unique party code
    const partyCode = Math.random().toString(36).substr(2, 6).toUpperCase();
    const roomShortCode = document.getElementById("roomShortCode").value;
    // Ensure both fields are filled
    if (!roomShortCode) {
        alert("Please enter the room's code.");
        return;
    }
    // Logic to start the watch party with the room short code
    document.getElementById("partyCode").innerText = `Party Code: ${partyCode}`;

    // Send the code to the backend and broadcast to the chatroom
    const response = await fetch('https://localhost:3000/party/start', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roomShortCode, partyCode }),
    });

    const data = await response.json();

    if (response.ok) {
        alert("Watch party started!");

        // Initialize WebSocket connection with the roomId from the response
        const ws = new WebSocket(`ws://localhost:8080?roomId=${data.roomId}`);

        ws.onmessage = (event) => {
            console.log('Received:', event.data);
        };
    } else {
        alert("Error starting the watch party.");
    }
});

document.getElementById("joinPartyBtn").addEventListener("click", async () => {
    const username = document.getElementById("username").value;
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
    const joinPartyApiUrl = 'https://localhost:3000/party/join';

    try {
        // Send request to join the party with the username and party code
        const response = await fetch(joinPartyApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username, // Include username instead of userId
                partyCode: joinCode
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Joined watch party!");

            // Initialize WebSocket connection with the roomId from the response
            const ws = new WebSocket(`ws://localhost:8080?roomId=${data.roomId}`);

            ws.onmessage = (event) => {
                console.log('Received:', event.data);
            };
        } else {
            alert(`Failed to join party: ${data.message}`);
        }
    } catch (error) {
        console.error('Error joining the watch party:', error);
        alert('An error occurred while trying to join the watch party. Please try again.');
    }
});

// retrieved roomId from the server in the start/join logic
ws.onopen = () => {
    console.log('WebSocket connection established');
};

ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    // Handle incoming WebSocket messages (e.g., playback controls)
    console.log('Message received:', message);
};

ws.onclose = () => {
    console.log('WebSocket connection closed');
};

ws.onerror = (error) => {
    console.error('WebSocket error:', error);
};

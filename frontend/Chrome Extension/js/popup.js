document.getElementById("startPartyBtn").addEventListener("click", async () => {
    // Generate a unique party code
    let ws;
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

        // Store username and partyCode in chrome.storage.sync
        chrome.storage.sync.set({ username, partyCode }, () => {
            console.log("Stored username and partyCode in chrome.storage.sync:", { username, partyCode });
        });

        // Initialize WebSocket connection with the roomId from the response
        ws = new WebSocket(`ws://localhost:3000?roomId=${data.roomId}`);

        ws.onopen = () => {
            console.log('WebSocket connection established');
        };

        ws.onmessage = (event) => {
            console.log('Received:', event.data);
        };

        ws.onclose = () => {
            console.log('WebSocket connection closed');
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
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
    const joinPartyApiUrl = 'http://localhost:3000/party/join';

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

            // Store username and partyCode in chrome.storage.sync
            chrome.storage.sync.set({ username, partyCode: joinCode }, () => {
                console.log("Stored username and partyCode in chrome.storage.sync:", { username, partyCode: joinCode });
            });

            // Initialize WebSocket connection with the roomId from the response
            ws = new WebSocket(`ws://localhost:3000?roomId=${data.roomId}`);

            ws.onopen = () => {
                console.log('WebSocket connection established');
            };

            ws.onmessage = (event) => {
                console.log('Received:', event.data);
            };

            ws.onclose = () => {
                console.log('WebSocket connection closed');
            };

            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
            };
        } else {
            alert(`Failed to join party: ${data.message}`);
        }
    } catch (error) {
        console.error('Error joining the watch party:', error);
        alert('An error occurred while trying to join the watch party. Please try again.');
    }
});

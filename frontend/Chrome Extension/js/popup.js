document.getElementById("startPartyBtn").addEventListener("click", async () => {
    // Generate a unique party code
    const partyCode = Math.random().toString(36).substr(2, 6).toUpperCase();
    const roomShortCode = document.getElementById("roomShortCode").value;
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

    if (response.ok) {
        alert("Watch party started! Share the code with others to join.");
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

        // Handle success response
        if (response.ok && data.success) {
            alert(`Successfully joined the watch party for room: ${data.roomId}`);
            // Optionally, redirect or open the watch party in a new tab
            chrome.tabs.create({ url: `https://your-watchparty-url.com/room/${data.roomId}` });
        } else {
            alert(`Failed to join the watch party: ${data.message}`);
        }
    } catch (error) {
        console.error('Error joining the watch party:', error);
        alert('An error occurred while trying to join the watch party. Please try again.');
    }
});


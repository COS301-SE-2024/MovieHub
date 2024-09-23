document.getElementById("startPartyBtn").addEventListener("click", async () => {
    // Generate a unique party code
    const partyCode = Math.random().toString(36).substr(2, 6).toUpperCase();
    document.getElementById("partyCode").innerText = `Party Code: ${partyCode}`;

    // Send the code to the backend and broadcast to the chatroom
    const response = await fetch('https://your-backend-api.com/start-watchparty', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ partyCode }),
    });

    if (response.ok) {
        alert("Watch party started! Share the code with others to join.");
    }
});

document.getElementById("joinPartyBtn").addEventListener("click", () => {
    const joinCode = document.getElementById("joinCode").value;
    // Implement logic to join the watch party with the entered code
});

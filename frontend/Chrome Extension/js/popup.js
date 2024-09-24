

document.getElementById("startPartyBtn").addEventListener("click", async () => {
    // Generate a unique party code
    let ws;//////////////////////////////// = new WebSocket("ws://localhost:3000?roomId=${roomId}");
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

        // Store username and partyCode in localStorage
        localStorage.setItem('username', username);
        localStorage.setItem('partyCode', partyCode);


        // Initialize WebSocket connection with the roomId from the response
        ws = new WebSocket(`ws://localhost:3000?roomId=${data.roomId}`);
        // retrieved roomId from the server in the start/join logic
        ws.onopen = () => {
            console.log('WebSocket connection established');
        };

        // // Listen for incoming messages
        // ws.onmessage = function (event) {
        //     const message = JSON.parse(event.data);
        //     if (message.type === 'chat') {
        //         const chatMessage = document.createElement('p');
        //         chatMessage.textContent = `[${message.username}] ${message.text}`;
        //         document.getElementById('messages').appendChild(chatMessage);
        //     }
        // };

        // // Send message on button click
        // document.getElementById('sendMessage').onclick = function () {
        //     const input = document.getElementById('messageInput');
        //     const message = {
        //         type: 'chat',
        //         username: 'User', // Replace with actual username
        //         text: input.value
        //     };
        //     ws.send(JSON.stringify(message));
        //     input.value = ''; // Clear input
        // };
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
            // Store username and partyCode in localStorage
            localStorage.setItem('username', username);
            localStorage.setItem('partyCode', partyCode);


            // Initialize WebSocket connection with the roomId from the response
             ws = new WebSocket(`ws://localhost:3000?roomId=${data.roomId}`);
            // retrieved roomId from the server in the start/join logic
            ws.onopen = () => {
                console.log('WebSocket connection established');
            };

            // Listen for incoming messages
            // ws.onmessage = function (event) {
            //     const message = JSON.parse(event.data);
            //     if (message.type === 'chat') {
            //         const chatMessage = document.createElement('p');
            //         chatMessage.textContent = `[${message.username}] ${message.text}`;
            //         document.getElementById('messages').appendChild(chatMessage);
            //     }
            // };

            // // Send message on button click
            // document.getElementById('sendMessage').onclick = function () {
            //     const input = document.getElementById('messageInput');
            //     const message = {
            //         type: 'chat',
            //         username: 'User', // Replace with actual username
            //         text: input.value
            //     };
            //     ws.send(JSON.stringify(message));
            //     input.value = ''; // Clear input
            // };

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



// ws.onmessage = (event) => {
//     const message = JSON.parse(event.data);
//     // Handle incoming WebSocket messages (e.g., playback controls)
//     console.log('Message received:', message);
// };



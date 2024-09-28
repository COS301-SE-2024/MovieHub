const socket = new WebSocket("wss:///moviehub-watchparty-extension.glitch.me?roomId=${roomId}"); // Replace with production WebSocket server

socket.addEventListener("message", (event) => {
    const data = JSON.parse(event.data);
    console.log(data);
    // Handle incoming messages (e.g., display in the chat UI)
});

function sendMessageToServer(message) {
    socket.send(JSON.stringify({ type: "message", text: message }));
}

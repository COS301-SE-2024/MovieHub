// Inject chat interface into the streaming platform
const chatBox = document.createElement('div');
chatBox.id = 'watchPartyChat';
document.body.appendChild(chatBox);



// Function to dynamically retrieve username and party code, ensuring partyCode is valid
function getUserDetails() {
  // Retrieve username and partyCode from localStorage or prompt the user
  //let username = localStorage.getItem('username');
  //let partyCode = localStorage.getItem('partyCode');
  let username;
  chrome.storage.sync.get('username', (data) => {
    username = data.username || null;
    console.log("Retrieved Party Code from chrome.storage:", username);
  });


  let partyCode;
  chrome.storage.sync.get('partyCode', (data) => {
    partyCode = data.partyCode || null;
    console.log("Retrieved Party Code from chrome.storage:", partyCode);

  });

  // Prompt the user if the values are missing
  if (!username) {
    username = prompt("Enter your username:");
    if (username) {
      localStorage.setItem('username', username);
      console.log("Stored username in localStorage:", username);
    }
  }

  // Validate and prompt for partyCode if it's missing or invalid
  if (!partyCode || !partyCode.trim()) {
    partyCode = prompt("Enter your valid party code:");
    if (partyCode && partyCode.trim()) {
      localStorage.setItem('partyCode', partyCode.trim());
      console.log("Stored partyCode in localStorage:", partyCode);
    }
  }

  // Log to check if partyCode and username are being retrieved
  console.log("Retrieved username:", username);
  console.log("Retrieved partyCode:", partyCode);

  // Ensure both username and partyCode are available
  if (!username || !partyCode || !partyCode.trim()) {
    alert("Error: Both username and a valid party code are required!");
    return null;
  }

  return { username, partyCode };
}

// Function to fetch watch party chat messages using PartyApiService
async function fetchChatMessages(partyCode) {
  try {
    console.log("Content.js partyCode ->", partyCode);
    const response = await fetch(`http://localhost:3000/party/${partyCode}/chat`);

    if (response.ok) {
      const data = await response.json();

      // Check if there are any messages
      if (data.messages && data.messages.length > 0) {
        data.messages.forEach(msg => addChatMessage(msg.username, msg.text));
      } else {
        // Handle the case where no messages are available
        console.log('No messages found in the chat room.');
        addChatMessage("System", "No messages available in the chat room."); // You can also choose to display this message in the chat
      }
    } else {
      console.error('Failed to fetch chat messages:', response.statusText);
      addChatMessage("System", "Error fetching chat messages."); // Display error message in chat
    }
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    addChatMessage("System", "An error occurred while fetching chat messages."); // Display error message in chat
  }
}


// Function to send chat message via PartyApiService
async function sendMessage(partyCode, username, text) {
  try {
    console.log("Sending message - partyCode:", partyCode, "username:", username, "text:", text);
    const response = await fetch(`http://localhost:3000/party/${partyCode}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        text: text,
      }),
    });
    if (!response.ok) {
      console.error('Failed to send message:', response.statusText);
    }
  } catch (error) {
    console.error('Error sending message:', error);
  }
}

// Function to render a new chat message in the chatbox
function addChatMessage(username, text) {
  const chatMessage = document.createElement('p');
  chatMessage.textContent = `[${username}] ${text}`;
  chatBox.appendChild(chatMessage);
}

// Optional: Add input fields for sending messages
const chatInput = document.createElement('input');
chatInput.type = 'text';
chatInput.placeholder = 'Type a message...';
document.body.appendChild(chatInput);

const sendButton = document.createElement('button');
sendButton.textContent = 'Send';
document.body.appendChild(sendButton);

// Event listener for the send button
sendButton.addEventListener('click', () => {
  const userDetails = getUserDetails();
  if (!userDetails) return; // Ensure valid user details
  const { username, partyCode } = userDetails;

  const text = chatInput.value;
  if (text) {
    sendMessage(partyCode, username, text);
    chatInput.value = '';  // Clear the input after sending
  }
});

// Fetch initial chat messages when the page loads
console.log("Before Load");
window.addEventListener('load', () => {
  const userDetails = getUserDetails();
  if (!userDetails) return; // Ensure valid user details before fetching
  console.log("User Detsss ", userDetails);
  const { partyCode } = userDetails;
  console.log("Fetching chat messages for partyCode:", partyCode);
  fetchChatMessages(partyCode);
});

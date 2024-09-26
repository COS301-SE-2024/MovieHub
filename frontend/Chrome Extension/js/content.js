// Inject chat interface into the streaming platform
const chatBox = document.createElement('div');
chatBox.id = 'watchPartyChat';
document.body.appendChild(chatBox);

// Apply styles to the chatBox
chatBox.style.position = 'fixed';
chatBox.style.top = '0';
chatBox.style.right = '0';
chatBox.style.width = '300px'; // Adjust width as necessary
chatBox.style.height = '100%'; // Cover from top to bottom
chatBox.style.backgroundColor = '#f3f4f6'; // Light background color
chatBox.style.color = 'black'; // Text color
chatBox.style.overflowY = 'auto'; // Scrollable if content overflows
chatBox.style.boxShadow = '-2px 0 10px rgba(0, 0, 0, 0.5)'; // Shadow for better visibility
chatBox.style.padding = '20px'; // Padding for spacing
chatBox.style.zIndex = '9999'; // Ensure it appears above other elements
chatBox.style.display = 'none'; // Initially hidden
chatBox.style.borderLeft = '4px solid #7e57c2'; // Left border in purple

// Add headings to the chatBox
const heading = document.createElement('h1');
heading.textContent = 'MovieHub';
heading.style.textAlign = 'center'; // Center the heading
heading.style.color = '#7e57c2'; // Purple color for the heading
heading.style.fontSize = '24px'; // Font size for the heading
heading.style.marginBottom = '10px'; // Margin for spacing

chatBox.appendChild(heading);

const subHeading = document.createElement('h2');
subHeading.textContent = 'Watch Party';
subHeading.style.textAlign = 'center'; // Center the subheading
subHeading.style.color = '#7e57c2'; // Purple color for the subheading
subHeading.style.fontSize = '18px'; // Font size for the subheading
subHeading.style.marginBottom = '20px'; // Margin for spacing

chatBox.appendChild(subHeading);

// Function to dynamically retrieve username and party code, ensuring partyCode is valid
function getUserDetails() {
  let username = null;
  let partyCode = null;

  // Retrieve username from chrome.storage
  chrome.storage.sync.get('username', (data) => {
    username = data.username || null;
    console.log("Retrieved Username from chrome.storage:", username);

    // After retrieving username, check if we need to prompt for it
    if (!username) {
      username = prompt("Enter your username:");
      if (username) {
        chrome.storage.sync.set({ username: username }); // Store in chrome.storage
        console.log("Stored username in chrome.storage:", username);
      }
    }

    // After handling username, now retrieve party code
    chrome.storage.sync.get('partyCode', (data) => {
      partyCode = data.partyCode || null;
      console.log("Retrieved Party Code from chrome.storage:", partyCode);

      // Prompt for party code if it's missing or invalid
      if (!partyCode || !partyCode.trim()) {
        partyCode = prompt("Enter your valid party code:");
        if (partyCode && partyCode.trim()) {
          chrome.storage.sync.set({ partyCode: partyCode.trim() }); // Store in chrome.storage
          console.log("Stored partyCode in chrome.storage:", partyCode);
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

      // Return user details only after both values have been set
      chatBox.style.display = 'block'; // Show chat box when details are available
      fetchChatMessages(partyCode); // Fetch initial chat messages
      return { username, partyCode };
    });
  });
}


// Function to fetch watch party chat messages using PartyApiService
async function fetchChatMessages(partyCode) {
  try {
    console.log("Content.js partyCode ->", partyCode);
    const response = await fetch(`http://localhost:3000/party/${partyCode}/chat`);

    if (response.ok) {
      const data = await response.json();

      // Clear chatBox before rendering messages
      chatBox.innerHTML = '';
      chatBox.appendChild(heading);  // Re-add heading after clearing
      chatBox.appendChild(subHeading); // Re-add subheading after clearing

      // Check if there are any messages
      if (data.messages && data.messages.length > 0) {
        chatBox.style.display = 'block'; // Show chat box when messages are received
        data.messages.forEach(msg => addChatMessage(msg.username, msg.text));
      } else {
        // Display placeholder message if no messages are available
        console.log('No messages found in the chat room.');
        addChatMessage("System", "No Messages Yet", true); // Centered message
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
function addChatMessage(username, text, isCentered = false) {
  const chatMessage = document.createElement('p');
  chatMessage.textContent = `[${username}] ${text}`;
  chatMessage.style.textAlign = isCentered ? 'center' : 'left'; // Center or left-align the message
  chatMessage.style.marginBottom = '10px'; // Margin for spacing
  chatMessage.style.padding = '5px'; // Padding for chat messages
  chatMessage.style.borderRadius = '5px'; // Rounded corners for messages

  // Alternate message background color
  chatMessage.style.backgroundColor = isCentered ? '#7e57c2' : '#e1bee7'; // Light purple for user messages
  chatMessage.style.color = 'black'; // Text color
  chatMessage.style.transition = 'background-color 0.3s'; // Smooth background color transition
  chatMessage.onmouseover = () => chatMessage.style.backgroundColor = '#9575cd'; // Darker purple on hover
  chatMessage.onmouseout = () => chatMessage.style.backgroundColor = isCentered ? '#7e57c2' : '#e1bee7'; // Reset on mouse out

  chatBox.appendChild(chatMessage);
}

// Optional: Add input fields for sending messages
const chatInputContainer = document.createElement('div');
chatInputContainer.style.display = 'flex'; // Flex container for input and button
chatInputContainer.style.marginTop = '10px'; // Margin for spacing

const chatInput = document.createElement('input');
chatInput.type = 'text';
chatInput.placeholder = 'Type a message...';
chatInput.style.flexGrow = '1'; // Allow input to grow
chatInput.style.border = '2px solid #7e57c2'; // Input border color
chatInput.style.backgroundColor = '#2c2c3d'; // Input background color
chatInput.style.color = 'white'; // Input text color
chatInput.style.padding = '10px'; // Padding for input
chatInput.style.borderRadius = '5px'; // Rounded corners for input
chatInput.style.marginRight = '10px'; // Space between input and button

chatInputContainer.appendChild(chatInput);

const sendButton = document.createElement('button');
sendButton.textContent = 'Send';
sendButton.style.width = '70px'; // Set width for the button
sendButton.style.backgroundColor = '#7e57c2'; // Button background color
sendButton.style.color = 'black'; // Button text color
sendButton.style.border = 'none'; // Remove border
sendButton.style.borderRadius = '5px'; // Rounded corners for button
sendButton.style.cursor = 'pointer'; // Pointer cursor on hover
sendButton.style.padding = '10px'; // Padding for button
sendButton.style.transition = 'background-color 0.3s'; // Smooth transition for button
sendButton.onmouseover = () => sendButton.style.backgroundColor = '#9575cd'; // Darker purple on hover
sendButton.onmouseout = () => sendButton.style.backgroundColor = '#7e57c2'; // Reset on mouse out

chatInputContainer.appendChild(sendButton);
document.body.appendChild(chatInputContainer);

// Event listener for the send button
sendButton.addEventListener('click', () => {
  const userDetails = getUserDetails();
  if (!userDetails) return; // Ensure valid user details
  const { username, partyCode } = userDetails;

  const text = chatInput.value;
  if (text) {
    sendMessage(partyCode, username, text);
    addChatMessage(username, text); // Display sent message in chat
    chatInput.value = ''; // Clear input field
  } else {
    alert("Message cannot be empty."); // Alert for empty message
  }
});


// Show chat box when ready
const userDetails = getUserDetails();
if (userDetails) {
  chatBox.style.display = 'block'; // Show chat box when user details are available
  fetchChatMessages(userDetails.partyCode); // Fetch initial chat messages
}

// Set up interval to fetch chat messages periodically
setInterval(() => {
  const userDetails = getUserDetails();
  if (userDetails) {
    fetchChatMessages(userDetails.partyCode);
  }
}, 5000); // Fetch messages every 5 seconds

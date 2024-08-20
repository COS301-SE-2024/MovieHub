import * as SecureStore from 'expo-secure-store';
import firebase from 'firebase/app';
import 'firebase/database'; // Import the Firebase Realtime Database


//const API_URL = process.env.REACT_APP_ROOMS_API_URL || 'http://192.168.225.19:3000/rooms'; // Update with your correct API URL
const API_URL = 'http://localhost:3000/rooms'

// Helper function to get the token from SecureStore
const getToken = async () => {
    const token = await SecureStore.getItemAsync('userToken');
    if (!token) {
        throw new Error('No token found');
    }
    return token;
};

// Middleware function for verifying Firebase token
const verifyToken = async () => {
    const authHeader = 'Bearer ' + await getToken();
    return {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
    };
};

// Create a new room
export const createRoom = async (userId, roomData) => {
    console.log("Check the body: ", roomData);
    const headers = await verifyToken();
    // Add Content-Type header to ensure the body is treated as JSON
    headers['Content-Type'] = 'application/json';
    const response = await fetch(`${API_URL}/create/${userId}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(roomData),
    });
    console.log("Check the body after res: ", roomData);
    if (!response.ok) {
        throw new Error('Failed to create room');
    }

    const data = await response.json();
    return data;
};

// Function to get all rooms a user has created
export const getUserCreatedRooms = async (userId) => {
    const headers = await verifyToken();
    const response = await fetch(`${API_URL}/created/${userId}`, {
        method: 'GET',
        headers,
    });

    if (!response.ok) {
        throw new Error('Failed to fetch created rooms');
    }

    const data = await response.json();
    return data;
};

// Function to get all rooms a user is participating in
export const getUserParticipatedRooms = async (userId) => {
    const headers = await verifyToken();
    const response = await fetch(`${API_URL}/participated/${userId}`, {
        method: 'GET',
        headers,
    });

    if (!response.ok) {
        throw new Error('Failed to fetch participated rooms');
    }

    const data = await response.json();
    return data;
};

// Get public rooms
export const getPublicRooms = async () => {
    const headers = await verifyToken();
    const response = await fetch(`${API_URL}/public-rooms`, {
        method: 'GET',
        headers,
    });

    if (!response.ok) {
        throw new Error('Failed to fetch public rooms');
    }

    const data = await response.json();
    return data;
};

// Get the participant count of a room
export const getRoomParticipantCount = async (roomId) => {
    const headers = await verifyToken();
    const response = await fetch(`${API_URL}/${roomId}/participant-count`, {
        method: 'GET',
        headers,
    });

    if (!response.ok) {
        throw new Error('Failed to fetch room participant count');
    }

    const data = await response.json();
    return data;
};

// Join an existing room
export const joinRoom = async (code, userId) => {
    const headers = await verifyToken();
    const response = await fetch(`${API_URL}/join`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ code, userId }),
    });

    console.log("RoomApiService joinRoom response: " + JSON.stringify(response));

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to join room');
    }

    const data = await response.json();
    return data;
};

// Get room details
export const getRoomDetails = async (roomIdentifier) => {
    const headers = await verifyToken();
    const response = await fetch(`${API_URL}/${roomIdentifier}`, {
        method: 'GET',
        headers,
    });

    if (!response.ok) {
        throw new Error('Failed to fetch room details');
    }

    const data = await response.json();
    return data;
};


// Invite a user to the room
export const inviteUserToRoom = async (adminId, userId, roomId) => {
    const headers = await verifyToken();
    const response = await fetch(`${API_URL}/invite`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ adminId, userId, roomId }),
    });

    if (!response.ok) {
        throw new Error('Failed to invite user to room');
    }

    const data = await response.json();
    return data;
};

// Decline a room invite
export const declineRoomInvite = async (userId, roomId) => {
    const headers = await verifyToken();
    const response = await fetch(`${API_URL}/decline`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ userId, roomId }),
    });

    if (!response.ok) {
        throw new Error('Failed to decline room invite');
    }

    const data = await response.json();
    return data;
};

// Leave a room
export const leaveRoom = async (roomId, userId) => {
    const headers = await verifyToken();
    const response = await fetch(`${API_URL}/leave`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ roomId, userId }),
    });

    if (!response.ok) {
        throw new Error('Failed to leave room');
    }

    const data = await response.json();
    return data;
};

// Kick a user from the room
export const kickUserFromRoom = async (roomId, adminId, userId) => {
    const headers = await verifyToken();
    const response = await fetch(`${API_URL}/kick`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ roomId, adminId, userId }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to kick user from room');
    }

    const data = await response.json();
    return data;
};

// Add a message to a room
export const addMessageToRoom = async (roomId, userId, message) => {
    const headers = await verifyToken();
    const response = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ roomId, userId, message }),
    });

    if (!response.ok) {
        throw new Error('Failed to send message');
    }

    const data = await response.json();
    return data;
};

// Get messages from a room
export const getMessagesFromRoom = async (roomId) => {
    const headers = await verifyToken();
    const response = await fetch(`${API_URL}/${roomId}/messages`, {
        headers,
    });

    if (!response.ok) {
        throw new Error('Failed to fetch messages');
    }

    const data = await response.json();
    return data;
};

export const listenForMessages = async (roomId, onMessageReceived) => {
    try {
        // Reference to the messages node in the Firebase Realtime Database
        const messagesRef = firebase.database().ref(`rooms/${roomId}/messages`);

        // Set up a listener to detect new messages
        messagesRef.on('child_added', (snapshot) => {
            const newMessage = snapshot.val();

            // Call the callback function to handle the new message
            onMessageReceived(newMessage);
        });

    } catch (error) {
        console.error('Error setting up message listener:', error);
        throw new Error('Failed to listen for messages');
    }
};
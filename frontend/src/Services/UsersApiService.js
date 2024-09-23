// src/services/UsersApiService.js
import * as SecureStore from 'expo-secure-store';

//const API_URL =  'http://10.0.28.189:3000/users';// enter what url your expo is running on + our port 3000
// const API_URL = 'http://localhost:3000/users';
import { getLocalIP } from './getLocalIP';

const localIP = getLocalIP();
const API_URL = `http://${localIP}:3000/users`;


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

export const getUserProfile = async (userId) => {
    //const token = await getToken();
    const headers = await verifyToken();
    const response = await fetch(`${API_URL}/${userId}`, {

        // headers: {
        //     'Authorization': `Bearer ${token}`,
        //     'Content-Type': 'application/json'
        // }
        headers,
    });

    // console.log("Here is the API res  ",response);
    if (!response.ok) {
        throw new Error('Failed to fetch user profile');
    }

    const textData = await response.text();
        // console.log('Response text:', textData);
        const data = JSON.parse(textData);
        // console.log('Parsed data:', data);


    return data;
};


export const updateUserProfile = async (userId, updatedData) => {
   // const token = await getToken();
    const headers = await verifyToken();
    const response = await fetch(`${API_URL}/${userId}`, {

        method: 'PATCH',
        headers: {
            // 'Authorization': `Bearer ${token}`,
            // 'Content-Type': 'application/json',
            ...headers,
        },
        body: JSON.stringify(updatedData),
    });
    if (!response.ok) {
        throw new Error('Failed to update user profile');
    }
    const data = await response.json();
    return data;
};


export const deleteUserProfile = async (userId) => {
    try {
        //const token = await getToken();
        const headers = await verifyToken();
        const response = await fetch(`${API_URL}/${userId}`, {

            method: 'DELETE',
            headers: {
                // 'Authorization': `Bearer ${token}`,
                // 'Content-Type': 'application/json'
                ...headers,
            }
            
        });
        if (!response.ok) {
            throw new Error('Failed to delete user profile');
        }
        const data = await response.json();
        return { success: true, message: data.message };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

// API service to change mode
export const changeMode = async (userId, mode) => {
    const headers = await verifyToken();
    const response = await fetch(`${API_URL}/${userId}/mode`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
        body: JSON.stringify({ mode }),
    });
    if (!response.ok) {
        throw new Error('Failed to change mode');
    }
    const data = await response.json();
    return data;
};

// API service to get the current mode
export const getMode = async (userId) => {
    const headers = await verifyToken();
    const response = await fetch(`${API_URL}/${userId}/mode`, {
        headers,
    });
    if (!response.ok) {
        throw new Error('Failed to fetch mode');
    }
    const data = await response.json();
    return data;
};

// export const deleteUserProfile = async (userId) => {
//     try {
//         const response = await fetch(`${API_URL}${userId}`, {
//             method: 'DELETE',
//         });

//         if (!response.success) {
//             let errorMessage = 'Failed to delete user profile';

//             // Attempt to extract error message from response body
//             try {
//                 const responseBody = await response.json();
//                 if (responseBody && responseBody.error) {
//                     errorMessage = responseBody.error;
//                 }
//             } catch (error) {
//                 // Ignore errors when parsing response body
//             }

//             throw new Error(errorMessage);
//         }
//     } catch (error) {
//         throw new Error(error.message);
//     }
// };

// get a user's watchlists
export const getUserWatchlists = async (userId) => {
    const token = await getToken();
    const response = await fetch(`${API_URL}/${userId}/watchlists`,{

        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch user watchlists');
    }

    const data = await response.json();
    return data;
};

// funtion get get user's posts
export const getUserPosts = async (userId) => {
    const token = await getToken();
    const response = await fetch(`${API_URL}/${userId}/posts`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        console.log(response)
        throw new Error("Failed to fetch user posts");
    } 
    
    const data = await response.json();
    // console.log("data", data);
    return data;
};

// funtion get get user's liked posts
// export const getUserLikedPosts = async (userId) => {
//     const response = await fetch(`http://localhost:3000/like/${userId}/likes`);
//     if (!response.ok) {
//         console.log(response)
//         throw new Error("Failed to fetch user posts");
//     } 
    
//     const data = await response.json();
//     console.log("data", data);
//     return data;
// };

export const getCommentsOfUser = async (userId) => {
    const response = await fetch(`http://localhost:3000/post/user/${userId}/comments`);
    if (!response.ok) {
        throw new Error('Failed to fetch movie posts');
    }

    const textData = await response.text();
        console.log('Response text:', textData);
        const data = JSON.parse(textData);
        console.log('Parsed data:', data);
    return data;
};

export const getReviewsOfUser = async (userId) => {
    const response = await fetch(`http://localhost:3000/post/user/${userId}/reviews`);
    if (!response.ok) {
        throw new Error('Failed to fetch movie posts');
    }

    const textData = await response.text();
        console.log('Response text:', textData);
        const data = JSON.parse(textData);
        console.log('Parsed data:', data);
    return data;
};

//User Peer Interaction:
export const followUser = async (userId, targetUserId) => {
    const headers = await verifyToken();
    const response = await fetch(`${API_URL}/follow`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            followerId: userId,
            followeeId: targetUserId,
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to follow user');
    }

    const data = await response.json();
    return data;
};

export const unfollowUser = async (userId, targetUserId) => {
    const headers = await verifyToken();
    const response = await fetch(`${API_URL}/unfollow`, {
        method: 'DELETE',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            followerId: userId,
            followeeId: targetUserId,
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to unfollow user');
    }

    const data = await response.json();
    return data;
};
// Function to get friends
export const getFriends = async (userId) => {
    const headers = await verifyToken();
    const response = await fetch(`${API_URL}/${userId}/friends`, {
        headers,
    });

    if (!response.ok) {
        throw new Error('Failed to get friends');
    }

    const data = await response.json();
    return data;
};

export const getFollowers = async (userId) => {
    const headers = await verifyToken();
    const response = await fetch(`${API_URL}/${userId}/followers`, {
        headers,
    });

    if (!response.ok) {
        throw new Error('Failed to get followers');
    }

    const data = await response.json();
    return data;
};

export const getFollowing = async (userId) => {
    const headers = await verifyToken();
    const response = await fetch(`${API_URL}/${userId}/following`, {
        headers,
    });

    if (!response.ok) {
        throw new Error('Failed to get following');
    }

    const data = await response.json();
    return data;
};

// return whether user is followed by targetUserId
export const isFollowed = async (userId, targetUserId) => {
    const headers = await verifyToken();
    const response = await fetch(`${API_URL}/${userId}/follows/${targetUserId}`, {
        headers,
        method: 'GET',
    });

    if (!response.ok) {
        throw new Error('Failed to check if user is followed');
    }

    const data = await response.json();
    return data;
};

export const searchUser = async (searchName) => {
    const token = await getToken();
    const response = await fetch(`${API_URL}/search/${encodeURIComponent(searchName)}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to search for users');
    }

    const data = await response.json();
    return data;
};

export const getFollowersCount = async (userId) => {
    const headers = await verifyToken();
    const response = await fetch(`${API_URL}/${userId}/followers/count`, {
        headers,
    });

    if (!response.ok) {
        throw new Error('Failed to get followers count');
    }

    const data = await response.json();
    return data;
};

export const getFollowingCount = async (userId) => {
    const headers = await verifyToken();
    const response = await fetch(`${API_URL}/${userId}/following/count`, {
        headers,
    });

    if (!response.ok) {
        throw new Error('Failed to get following count');
    }

    const data = await response.json();
    return data;
};

// Function to get a user's notifications
export const getUserNotifications = async (userId) => {
    const headers = await verifyToken();
    const response = await fetch(`${API_URL}/${userId}/notifications`, {
        headers,
    }); 
 
    if (!response.ok) {
        throw new Error('Failed to fetch user notifications');
    }

    const data = await response.json();
    return data;
};

export const getUnreadNotifications = async (userId) => {
    try {
        const headers = await verifyToken();
        const response = await fetch(`${API_URL}/${userId}/notifications/unread`, {
            headers,
        });

        if (!response.ok) {
            throw new Error('Failed to fetch unread notifications');
        }

        const data = await response.json();
        return data; // Assumes response has a property 'unreadCount'
    } catch (error) {
        console.error("Failed to fetch unread notifications:", error);
        throw error; // Ensure errors are handled by the calling code
    }
};
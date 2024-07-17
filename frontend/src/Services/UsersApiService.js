// src/services/UsersApiService.js
import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.REACT_APP_USERS_API_URL || 'http://192.168.0.123:3000/users';// enter what url your expo is running on + our port 3000

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

// New function to get a user's watchlists
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
    console.log("data", data);
    return data;
};

// funtion get get user's liked posts
export const getUserLikedPosts = async (userId) => {
    const token = await getToken();
    const response = await fetch(`http://localhost:3000/like/${userId}/likes`,{
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        console.log(response)
        throw new Error("Failed to fetch user liked posts");
    } 
    
    const data = await response.json();
    console.log("data", data);
    return data;
};

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
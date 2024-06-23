// src/services/UsersApiService.js


const API_URL = process.env.REACT_APP_USERS_API_URL || 'http://10.0.0.107:3000/users/';// enter what url your expo is running on + our port 3000


export const getUserProfile = async (userId) => {
    const response = await fetch(`http://localhost:3000/users/${userId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch user profile');
    }

    const textData = await response.text();
        console.log('Response text:', textData);
        const data = JSON.parse(textData);
        console.log('Parsed data:', data);


    return data;
};
export const updateUserProfile = async (userId, updatedData) => {
    const response = await fetch(`http://localhost:3000/users/${userId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
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
        const response = await fetch(`http://localhost:3000/users/${userId}`, {
            method: 'DELETE',
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
//         const response = await fetch(`http://localhost:3000/users/${userId}`, {
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
    const response = await fetch(`http://localhost:3000/users/${userId}/watchlists`);
    if (!response.ok) {
        throw new Error('Failed to fetch user watchlists');
    }

    const data = await response.json();
    return data;
};

// funtion get get user's posts
export const getUserPosts = async (userId) => {
    const response = await fetch(`http://localhost:3000/post/user/${userId}/posts`);
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
    const response = await fetch(`http://localhost:3000/like/${userId}/likes`);
    if (!response.ok) {
        console.log(response)
        throw new Error("Failed to fetch user posts");
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
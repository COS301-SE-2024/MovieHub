// src/services/UsersApiService.js

const API_URL = process.env.REACT_APP_API_URL || 'http://10.0.0.109:3000/users/';// enter what url your expo is running on + our port 3000

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

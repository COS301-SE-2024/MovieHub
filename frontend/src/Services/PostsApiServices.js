// src/services/PostsApiService.js

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
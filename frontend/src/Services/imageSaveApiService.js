// import * as SecureStore from 'expo-secure-store';
// const API_URL = process.env.REACT_APP_AUTH_API_URL || 'http://192.168.3.218:3000/saveImage/'; // Update to your Expo URL

// const getToken = async () => {
//     const token = await SecureStore.getItemAsync('userToken');
//     if (!token) {
//         throw new Error('No token found');
//     }
//     return token;
// };

// // Middleware function for verifying Firebase token
// const verifyToken = async () => {
//     const authHeader = 'Bearer ' + await getToken();
//     return {
//         'Authorization': authHeader,
//         'Content-Type': 'application/json'
//     };
// };

// const fetchWithAuth = async (url, options = {}) => {
//     const headers = await verifyToken();
//     options.headers = { ...options.headers, ...headers };
//     const response = await fetch(url, options);
//     if (!response.ok) {
//         const errorMessage = await response.text();
//         throw new Error(errorMessage || 'Request failed');
//     }
//     return response.json();
// };

// export const uploadImage = async (imageFile) => {
//     if(imageFile == null){
//         return null;
//     }
//     try {
//         const response = await fetchWithAuth(`${API_URL}/saveImage`, {
//             method: 'POST',
//             body: JSON.stringify(imageFile),
//         });
//         return response;
//     } catch (error) {
//         throw new Error('Failed to add post: ' + error.message);
//     }
// };

// const dotenv = require("dotenv")
// dotenv.config()
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://smpxgyiogmxexcsfkkuz.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtcHhneWlvZ214ZXhjc2Zra3V6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjAzNzQ0MDksImV4cCI6MjAzNTk1MDQwOX0.gnVUUMsFOHHTukiq2jJNZjtJtkDYePSBKvsswrv_r-I";
const supabase = createClient(supabaseUrl, supabaseKey);


exports.uploadImage = async (file,folderPath) =>{
    console.log("Uploading file function :" + file);
    console.log(file);
    const fileName = `${Date.now()}-${file.fileName}` // Create a unique file name
    console.log(fileName);
    const filePath = `${folderPath}/${fileName}` // Combine folder path and file name
    console.log(filePath);
    const { data, error } = await supabase
        .storage
        .from('images')
        .upload(filePath, file.file)
    console.log("------------------------------------------------------------------------");

    if (error) {
        console.error('Error uploading file:', error)
        return null
    }
    console.log("------------------------------------------------------------------------");
    // Step 4: Return the URL of the uploaded image
    const { publicURL, error: urlError } = supabase
        .storage
        .from('images')
        .getPublicUrl(filePath)

    if (urlError) {
        console.error('Error getting public URL:', urlError)
        return null
    }

    return publicURL
};


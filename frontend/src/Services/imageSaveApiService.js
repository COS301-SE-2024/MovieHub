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

// import { S3Client } from '@aws-sdk/client-s3';

// const client = new S3Client({
//   forcePathStyle: true,
//   region: 'us-east-1',
//   endpoint: 'https://smpxgyiogmxexcsfkkuz.supabase.co/storage/v1/s3',
//   credentials: {
//     accessKeyId: 'fbda5559291f4be546669f46015e4b31',
//     secretAccessKey: '68dde53943a8167782c2184b963d75e6db754e45e10cb33399d75061b3368c13',
//   }
// })


// const file = fs.createReadStream('path/to/file')

// const uploadCommand = new PutObjectCommand({
//   Bucket: 'bucket-name',
//   Key: 'path/to/file',
//   Body: file,
//   ContentType: 'image/jpeg',
// })

// await s3Client.send(uploadCommand)


const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://smpxgyiogmxexcsfkkuz.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtcHhneWlvZ214ZXhjc2Zra3V6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjAzNzQ0MDksImV4cCI6MjAzNTk1MDQwOX0.gnVUUMsFOHHTukiq2jJNZjtJtkDYePSBKvsswrv_r-I";
const supabase = createClient(supabaseUrl, supabaseKey);


exports.uploadImage = async (file,folderPath) =>{

    console.log("Uploading");

    const fileName = `${Date.now()}-${file.fileName}` // Create a unique file name

    console.log(fileName);

    const type = file.type; // Get the file type

    console.log(type);

    const uri = file.uri;

    console.log(uri);

    try {

      const response = await fetch(uri);

        console.log("response: ");
        console.log(response);

        const blob = await response.blob();

        console.log("__________________");
        console.log(blob);
        console.log("__________________");

        const filePath = `${folderPath}/${fileName}`; // Specify the subfolder path

        console.log(filePath);

        const { data, error } = await supabase.storage
          .from('images') // Replace with your bucket name
          .upload(filePath, blob, {
            cacheControl: 'no-store, no-cache, must-revalidate', // Prevent caching at all levels
            upsert: false, 
        });


          console.log("__________________");
        if (error) {
          console.log('Error uploading image:', error.message);
          return null;
        }
    
        console.log('Image uploaded successfully:', data.Key);
        return data.Key;
      } catch (error) {
        console.log('Error:', error.message);
        return null;
      }
    };

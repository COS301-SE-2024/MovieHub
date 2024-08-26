// utils/getLocalIP.js
export const getLocalIP = () => {
    // Replace this with the actual URL you get from Expo CLI
    const expoURL = 'exp://10.0.26.63:8082';

    // Extract the IP address from the URL
    const urlMatch = expoURL.match(/exp:\/\/([^:]+):\d+/);
    if (urlMatch && urlMatch[1]) {
        return urlMatch[1];
    }
    return 'localhost'; // Fallback value
};
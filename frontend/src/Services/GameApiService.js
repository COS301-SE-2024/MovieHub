import { getLocalIP } from "./getLocalIP";
import { uploadImage } from "./imageUtils";

const localIP = getLocalIP();
const API_URL = `http://${localIP}:3000`;

export const getGameDataByGenre = async (genre) => {
    try {
        const response = await fetch(`${API_URL}${genre}`);
        console.log("Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching game data:", error);
        throw error;
    }
}
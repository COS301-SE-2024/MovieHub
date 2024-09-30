import { getLocalIP } from "./getLocalIP";
import { uploadImage } from "./imageUtils";

const localIP = getLocalIP();
const API_URL = `http://${localIP}:3000/games/`;


export const getGameData = async (genre) => {
    try {
        const response = await fetch(`${API_URL}${genre}`);
        // console.log("Responserrrrr:", response);

        const data = await response.json();
        // console.log("Response2:", data);

        return data;
    } catch (error) {
        console.error("Error fetching game data:", error);
        throw error;
    }
}


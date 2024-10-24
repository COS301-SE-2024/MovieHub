import axios from "axios";
import { getLocalIP } from "./getLocalIP";

const localIP = getLocalIP();

export const getRecommendedMovies = async (movieId, userId) => {
    try {
        const response = await axios.get(`http://${localIP}:3000/recommend/${movieId}/${userId}`);
        console.log("Data: " + JSON.stringify(response.data));
        return response.data; // Ensure the backend returns an array of recommended movies
    } catch (error) {
        console.error("Error fetching recommended movies:", error);
        throw error;
    }
};

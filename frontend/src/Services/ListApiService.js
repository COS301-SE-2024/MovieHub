//const API_URL = process.env.REACT_APP_AUTH_API_URL || 'http://192.168.3.218:3000/list/'; // Update to your Expo URL
// const API_URL = 'http://localhost:3000/list/';
import { getLocalIP } from "./getLocalIP";
import { uploadImage } from "./imageUtils";

const localIP = getLocalIP();
const API_URL = `http://${localIP}:3000/list/`;

export const createWatchlist = async (userId, watchlistData) => {
    // collabUserIds is the array that contaions all the user IDs that collabarate

    if (watchlistData.img) {
        if (watchlistData.img === null) {
            watchlistData.img = "https://picsum.photos/seed/picsum/20/300";
        } else {
            watchlistData.img = await uploadImage(watchlistData.img, "lists");
        }
    }

    //also the array is stored in the wathclist details
    try {
        const response = await fetch(`${API_URL}${userId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(watchlistData),
        });

        if (!response.ok) {
            throw new Error("Failed to create watchlist.");
        }

        return await response.json();
    } catch (error) {
        console.error("Error creating watchlist:", error);
        throw new Error("Failed to create watchlist.");
    }
};

export const modifyWatchlist = async (watchlistId, updatedData) => {
    try {
        const response = await fetch(`${API_URL}${watchlistId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedData),
        });

        if (!response.ok) {
            throw new Error("Failed to modify watchlist.");
        }

        return await response.json();
    } catch (error) {
        console.error("Error modifying watchlist:", error);
        throw new Error("Failed to modify watchlist.");
    }
};

export const getWatchlistDetails = async (watchlistId) => {
    try {
        const response = await fetch(`${API_URL}${watchlistId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        console.log("+++++++++");
        if (!response.ok) {
            throw new Error("Failed to fetch watchlist details.");
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching watchlist details:", error);
        throw new Error("Failed to fetch watchlist details.");
    }
};

export const getCollaborators = async (watchlistId) => {
    const token = await getToken(); // Assuming there's a function to get the token
    const response = await fetch(`${API_URL}/${encodeURIComponent(watchlistId)}/collaborators`, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch collaborators");
    }

    const data = await response.json();
    return data.collaborators;
};

export const deleteWatchlist = async (watchlistId) => {
    try {
        const response = await fetch(`${API_URL}${watchlistId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to delete watchlist.");
        }
    } catch (error) {
        console.error("Error deleting watchlist:", error);
        throw new Error("Failed to delete watchlist.");
    }
};

export const getFollowedUsersWatchlists = async (userId) => {
    try {
        const response = await fetch(`${API_URL}${userId}/followed-watchlists`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        console.log("Watclists -services", response);

        if (!response.ok) {
            throw new Error("Failed to fetch followed users watchlists.");
        }

        const data = await response.json();

        console.log("Watclists -services/data", data);
        return data; // Assuming the API returns an array of watchlists
    } catch (error) {
        console.error("Error fetching followed users watchlists:", error);
        throw new Error("Failed to fetch followed users watchlists.");
    }
};

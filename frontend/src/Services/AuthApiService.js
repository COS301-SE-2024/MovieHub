import * as SecureStore from "expo-secure-store";
import { getLocalIP } from "./getLocalIP";
//const API_URL = 'http://192.168.3.218:3000/auth'; //// enter what url your expo is running on + our port 3000
// const API_URL = 'http://localhost:3000/auth';
const localIP = getLocalIP();
const API_URL = `http://${localIP}:3000/auth`;

export const registerUser = async (email, password, username) => {
    console.log("Inside AuthApi Service");

    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, username }),
    });
    console.log("*********");
    console.log(response);
    if (!response.ok) {
        throw new Error("This email is already being used");
    }

    console.log("+++++++");
    const data = await response.json();
    console.log("--------------");
    console.log("Heres the data: " + JSON.stringify(data));
    if (!data.data || !data.data.token) {
        throw new Error("Token not found in response");
    }

    // Store the token securely
    await SecureStore.setItemAsync("userToken", data.data.token);
    return data;
};

export const loginUser = async (email, password) => {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    console.log("AuthServices: Let's go in");
    // console.log(response);
    // console.log("Response status:", response.status);
    // console.log("Response headers:", response.headers);
    const textData = await response.text();
    console.log("Check the text dataaa\n", textData);

    if (!response.ok) {
        // console.error("Response not OK:", textData);
        throw { status: response.status, message: textData };
    }

    let data;
    try {
        data = JSON.parse(textData);
    } catch (e) {
        // console.error("Error parsing JSON:", e);
        throw new Error(`Invalid JSON response: ${textData}`);
    }

    console.log("Parsed data:", data);

    // Store the token securely using Expo SecureStore
    await SecureStore.setItemAsync("userToken", data.data.token);
    return data;
};

export const logoutUser = async () => {
    const response = await fetch(`${API_URL}/logout`, {
        method: "POST",
    });

    if (!response.ok) {
        throw new Error("Failed to logout user");
    }

    const data = await response.json();
    return data;
};

export const checkEmailVerification = async () => {
    const response = await fetch(`${API_URL}/verify-email`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Failed to check email verification");
    }

    const data = await response.json();
    return data.emailVerified;
};

export const isUserVerified = async () => {
    try {
        // const token = await getAuth().currentUser.getIdToken(true);

        const response = await fetch(`${API_URL}/is-verified`, {
            method: "GET",
            headers: {
                // 'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        const textData = await response.text();
        const data = JSON.parse(textData);

        return data.isVerified;
    } catch (error) {
        console.error("Error checking user verification: ", error);
        return false;
    }
};

export const sendPasswordResetEmail = async (email) => {
    try {
        const response = await fetch(`${API_URL}/reset-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        const responseText = await response.json();
        console.log("Raw Response:", responseText);

        if (response.success === false) {
            return { success: false, error: responseText.message };
        }

        return { success: true, message: responseText.message };
    } catch (error) {
        console.error("Error sending password reset email:", error);
        return { success: false, error: error.message };
    }
};

export const updateUserPassword = async (currPassword, newPassword) => {
    try {
        const response = await fetch(`${API_URL}/update-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ currPassword, newPassword }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error updating password:", errorData);
            throw new Error(errorData.message || 'Failed to update password');
        }

        const data = await response.json();
        console.log("Password Update Service:", data);
        return { success: true, message: data.message };
    } catch (error) {
        console.error("Error updating password!!!", error);
        return { success: false, error: error.message,  };
    }
};

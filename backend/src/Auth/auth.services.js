// src/Auth/auth.services.js
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendEmailVerification, sendPasswordResetEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import firebaseApp from "../Firebase/firebaseConnection";
import { firebase } from "../Firebase/firebaseConnection";
import { createUserNode } from "../Users/users.services";
import { updateProfile } from "firebase/auth";

const auth = getAuth();

exports.registerUser = async (email, password, username) => {
    try {
        console.log("In auth register service");

        // Create a user in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        console.log("Here's the user: ", user.uid);

        // Set display name
        await updateProfile(user, { displayName: username });

        // Send email verification
        await sendEmailVerification(user);

        console.log("Here's the user: ", user);

        const userId = user.uid;

        if (userId) {
            // Create a new user node in Neo4j
            try {
                await createUserNode(userId, username);
            } catch (error) {
                // If Neo4j user creation fails, delete the created Firebase user
                await auth.deleteUser(userId);
                throw new Error("Failed to create user in Neo4j: " + error.message);
            }
        } else {
            console.log("Oops! Something went wrong in auth.services");
        }

        // Generate a custom token for the user
        const customToken = await firebase.auth().createCustomToken(userId);
        const userRecord = user;
        // sen dover user in var called userRecord
        return { userRecord, customToken };
    } catch (error) {
        throw error;
    }
};

exports.loginUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (!user) {
            throw new Error("User login failed");
        }

        // Generate a custom token for the user
        const customToken = await firebase.auth().createCustomToken(user.uid);

        return { user, customToken };
    } catch (error) {
        throw error;
    }
};

exports.logoutUser = async () => {
    try {
        await signOut(auth);
        return true;
    } catch (error) {
        throw error;
    }
};

exports.checkEmailVerification = async () => {
    console.log("In checkEmailVerification service");
    try {
        const user = auth.currentUser;
        if (user) {
            console.log("User email verified: ", user.emailVerified);
            await user.reload(); // Reload user data from Firebase
            return user.emailVerified;
        } else {
            console.log("No user is currently signed in.");
            throw new Error("No user is currently signed in.");
        }
    } catch (error) {
        console.error("Error checking email verification: ", error);
        throw error;
    }
};

exports.isUserVerified = async () => {
    const user = auth.currentUser;
    console.log("Auth services: User email verified: ", user.emailVerified);
    if (user) {
        return user.emailVerified;
    } else {
        return false;
    }
}

exports.sendPasswordResetEmail = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email); // from firebase auth
        const result = { message: 'Password reset email sent successfully', success: true };
        return result;
    } catch (error) {
        // console.error("Errorrrr:", error);
        throw error;
    }
}
exports.updatePassword = async (currPassword, newPassword) => {
    try {
        const user = auth.currentUser;
        if (user) {
            // Verify the current password
            const credential = EmailAuthProvider.credential(user.email, currPassword);
            await reauthenticateWithCredential(user, credential);
            console.log("reauthenticated auth services");

            // Update the password
            await updatePassword(user, newPassword);
            return { success: true, message: 'Password updated successfully' };
        } else {
            throw new Error("No user is currently signed in.");
        }
    } catch (error) {
        console.error("Error updating password: ", error);
        if (error.code === 'auth/wrong-password') {
            // Handle wrong current password error without logging the user out
            return { success: false, error: "The current password is incorrect.", code: error.code };
        } else {
            // Handle other errors normally
            return { success: false, error: error.message, };
        }
    }
};

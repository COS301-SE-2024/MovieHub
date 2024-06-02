// authService.js
import { createUserWithEmailAndPassword } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase.config";
import { collection, doc, updateDoc, getDocs, setDoc, query, where } from "firebase/firestore";

// Sign up function
async function signUp(email, password, username) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Add user information to Firestore
        await setDoc(doc(db, "users", user.uid), {
            username,
            email,
        });

        console.log("User signed up:", user);
        return user;
    } catch (error) {
        console.error("Error signing up:", error);
        throw error;
    }
}

async function signIn(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("User signed in:", user);
        return user;
    } catch (error) {
        console.error("Error signing in:", error);
        throw error;
    }
}

async function getUserProfile(email) {
    try {
        // Construct the query to find the user document by username
        const q = query(collection(db, "users"), where("email", "==", email));

        // Execute the query
        const querySnapshot = await getDocs(q);

        // Check if the query returned any documents
        if (!querySnapshot.empty) {
            // Extract user data from the first document (assuming username is unique)
            const userData = querySnapshot.docs[0].data();
            return userData;
        } else {
            throw new Error("User with the provided email not found");
        }
    } catch (error) {
        console.error("Error getting user data by email:", error);
        throw error;
    }
}

const updateUsername = async (uid, newUsername) => {
    try {
        const userDocRef = doc(db, "users", uid);
        await updateDoc(userDocRef, { username: newUsername });
        console.log("Username updated successfully");
    } catch (error) {
        console.error("Error updatinggg username:", error);
        throw error;
    }
};

const updateBio = async (uid, newBio) => {
    try {
        const userDocRef = doc(db, "users", uid);
        await updateDoc(userDocRef, { bio: newBio });
        console.log("Bio updated successfully");
    } catch (error) {
        console.error("Error updating bio:", error);
        throw error;
    }
};

const updateFullName = async (uid, newFullName) => {
    try {
        const userDocRef = doc(db, "users", uid);
        await updateDoc(userDocRef, { fullName: newFullName });
        console.log("Full name updated successfully");
    } catch (error) {
        console.error("Error updating full name:", error);
        throw error;
    }
};

export { signUp, signIn, getUserProfile, updateUsername, updateBio, updateFullName };

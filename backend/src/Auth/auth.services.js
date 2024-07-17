// src/Auth/auth.services.js
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import firebaseApp from '../Firebase/firebaseConnection';
import { firebase } from '../Firebase/firebaseConnection';
//import admin from '../Firebase/firebase.config.js'
//import { getFirestore } from 'firebase-admin/firestore';
import { createUserNode } from '../Users/users.services';


// Initialize Firebase Admin SDK
// admin.initializeApp({
//   credential: admin.credential.applicationDefault(),
//   databaseURL: "moviehub-3ebc8.firebaseapp.com"
// });
//const admin = firebase();

const auth = getAuth();

exports.registerUser = async (email, password, username) => {
  try {
    console.log("In auth register service ");

    // Create a user in Firebase Authentication
    const userRecord = await firebase.auth().createUser({
      email,
      password,
      displayName: username
      // Additional fields should be added as needed
    });

    console.log("Here's the user: ", userRecord);

    const userId = userRecord.uid;

    if (userId) {
      // Create a new user node in Neo4j
      try {
        await createUserNode(userId, username);
      } catch (error) {
        // If Neo4j user creation fails, delete the created Firebase user
        await firebase.auth().deleteUser(userId);
        throw new Error('Failed to create user in Neo4j: ' + error.message);
      }
    } else {
      console.log("Oops! Something went wrong in auth.services");
    }

    // Generate a custom token for the user
    const customToken = await firebase.auth().createCustomToken(userId);

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
      throw new Error('User login failed');
    }

    // Generate a custom token for the user
    const customToken = await firebase.auth().createCustomToken(user.uid);

    return { user, customToken };
  } catch (error) {
    throw error;
  }
  // try {
  //   const userCredential = await signInWithEmailAndPassword(auth, email, password);
  //   const idToken = await userCredential.user.getIdToken();

  //   // Create session cookie
  //   const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
  //   const sessionCookie = await firebase.auth().createSessionCookie(idToken, { expiresIn });

  //   return { user: userCredential.user, sessionCookie };
  // } catch (error) {
  //   throw error;
  // }
};

exports.logoutUser = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    throw error;
  }
};
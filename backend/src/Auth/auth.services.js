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
    console.log("In auth register service ")
    //const userCredential = await firebase.auth().createUserWithEmailAndPassword(auth, email, password);
    //const user = userCredential.user;
    const userRecord = await firebase.auth().createUser({
      email,
      password,
      displayName: username
      // Additional fields should be added as needed
    });

   //const user = userRecord.user;
    console.log("Heres the user: ", userRecord);
    
    const userId = userRecord.uid;
    //console.log("Heres the user's Id:  ", userId)
    // Create a new user node in Neo4j
    if(userId !== undefined){
      await createUserNode(userId, username);
    }
    else{
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
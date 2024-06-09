// src/Auth/auth.services.js
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup, 
  OAuthProvider 
} from 'firebase/auth';
import firebaseApp from '../Firebase/firebaseConnection';

const neo4j = require('neo4j-driver');
require('dotenv').config();

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);

const auth = getAuth(firebaseApp);

const saveUserToNeo4j = async (email, username) => {
  const session = driver.session();
  try {
    await session.run(
      'CREATE (u:User {email: $email, username: $username})',
      { email, username }
    );
  } finally {
    await session.close();
  }
};

exports.registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await saveUserToNeo4j(user.email, user.displayName || '');
    return user;
  } catch (error) {
    throw error;
  }
};

exports.loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
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

exports.signUpWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;
    await saveUserToNeo4j(user.email, user.displayName || '');
    return user;
  } catch (error) {
    throw error;
  }
};

exports.loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;
    return user;
  } catch (error) {
    throw error;
  }
};

exports.signUpWithApple = async () => {
  try {
    const provider = new OAuthProvider('apple.com');
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;
    await saveUserToNeo4j(user.email, user.displayName || '');
    return user;
  } catch (error) {
    throw error;
  }
};

exports.loginWithApple = async () => {
  try {
    const provider = new OAuthProvider('apple.com');
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;
    return user;
  } catch (error) {
    throw error;
  }
};

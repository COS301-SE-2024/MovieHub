import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import firebaseApp from "../Firebase/firebaseConnection";

const auth = getAuth(firebaseApp);

exports.registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
}


exports.loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
}

// exports.verifyToken = async (token) => {
//   try {
//     const decodedToken = await admin.auth().verifyIdToken(token);
//     return decodedToken;
//   } catch (error) {
//     throw new Error(`Error verifying token: ${error.message}`);
//   }
// }


exports.logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
}





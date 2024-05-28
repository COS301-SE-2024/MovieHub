// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCR1DdCie3_-NR9L9hl5Yh7qQHAiamkVGg",
  authDomain: "moviehub-3ebc8.firebaseapp.com",
  databaseURL: "https://moviehub-3ebc8-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "moviehub-3ebc8",
  storageBucket: "moviehub-3ebc8.appspot.com",
  messagingSenderId: "610731676085",
  appId: "1:610731676085:web:8e670cd6f51f92e17d89fc",
  measurementId: "G-FNMTL54L6R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getDatabase(app);

export { app, analytics, auth, db };
import admin from "firebase-admin";
require('dotenv').config();

const config = {
  credential: admin.credential.cert({
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Replace escaped newlines
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CERT_URL,
    universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN
  }),
};

export const firebase = admin.apps.length
  ? admin.app()
  : admin.initializeApp(config);


//MAKING USE OF THIS FILE FOR ADMIN SDK

// // Import the functions you need from the SDKs you need
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';

// const firebaseConfig = {
//   apiKey: "AIzaSyCR1DdCie3_-NR9L9hl5Yh7qQHAiamkVGg",
//   authDomain: "moviehub-3ebc8.firebaseapp.com",
//   databaseURL: "https://moviehub-3ebc8-default-rtdb.europe-west1.firebasedatabase.app",
//   projectId: "moviehub-3ebc8",
//   storageBucket: "moviehub-3ebc8.appspot.com",
//   messagingSenderId: "610731676085",
//   appId: "1:610731676085:web:8e670cd6f51f92e17d89fc",
//   measurementId: "G-FNMTL54L6R"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// const auth = getAuth(app);
// const db = getFirestore(app);

// export { auth, db };
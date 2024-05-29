import firebase from "../Firebase/firebaseConnection";

exports.signUp = async(email, password) =>{
    firebase.auth.createUserWithEmailAndPassword( email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log('User signed up:', user);
        return user;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Error signing up:', errorCode, errorMessage);
      });
  }
  
  exports.logIn = async (email, password)  =>{
    firebase.auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log('User logged in:', user);
        return user;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Error logging in:', errorCode, errorMessage);
      });
  }


  exports.logOut = async ()  =>{
    firebase.auth.signOut().then((logoutStatus) => {
      // Sign-out successful.
      console.log('User logged out');
      return logoutStatus;
    }).catch((error) => {
      console.error('Error logging out:', error);
    });
  }
  
  

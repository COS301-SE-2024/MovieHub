
function signUp(email, password) {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log('User signed up:', user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Error signing up:', errorCode, errorMessage);
      });
  }
  
  function logIn(email, password) {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log('User logged in:', user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Error logging in:', errorCode, errorMessage);
      });
  }


  function logOut() {
    signOut(auth).then(() => {
      // Sign-out successful.
      console.log('User logged out');
    }).catch((error) => {
      console.error('Error logging out:', error);
    });
  }
  
  

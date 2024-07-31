import { getStorage , ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from "../../../backend/src/Firebase/firebaseConnection";


exports.uploadImage = async (file, name) => {
  console.log(file);
  console.log(name);
 
  if (!file) {
      
      console.error('No file provided');
      return;
    }
    try {
      const storage = getStorage();
      const imgRef =  app.storage.ref(storage, `posts/blue`);
      const snapshot = await uploadBytes(imgRef, file);
      const url = await getDownloadURL(snapshot.ref);
  
      console.log('File available at', url);
      return url;
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }
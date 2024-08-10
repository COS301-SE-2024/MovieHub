import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../backend/src/Firebase/firebase.config';
exports.uploadImage = async (file) => {
    if (!file) {
      console.error('No file provided');
      return;
    }
    try {
      // Create a storage reference
      const storageRef = ref(storage, 'images/' + file.name);
  
      // Upload the file
      const snapshot = await uploadBytes(storageRef, file);
  
      // Get the file's URL
      const url = await getDownloadURL(snapshot.ref);
  
      console.log('File available at', url);
      return url;
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }
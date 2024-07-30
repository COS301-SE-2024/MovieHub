import {getStorage, ref, uploadBytesResumble, getDownloadURL } from 'firebase/storage';
//import { initializeApp } from 'firebase/app';
import multer from 'multer';
import { storage, app } from "../../../backend/src/Firebase/firebase.config";




exports.uploadImage = async (file) => {
  console.log('in the file fisrts_________________________________________________________________');
 console.log(file.fileName);
 console.log('in the file second_________________________________________________________________');

  if (!file) {
      
      console.error('No file provided');
      return;
    }
    try {

      const upload = multer({storage: multer.memoryStorage() });


      
      console.log('in the file 1_________________________________________________________________');

      c
      // Create a storage reference
      // const storageRef = ref(storage, file.fileName);
      const storageRefImage = ref(storage, 'Posts/' + file.fileName);
      // console.log('in the file 3_________________________________________________________________');

      const metadata = {
        contentType:file.mimeType,
      };

      // // Upload the file
      const snapshot = await uploadBytesResumble(storageRef, file, metadata);
      // console.log('in the file 4_________________________________________________________________');
  
      // // Get the file's URL
      const url = await getDownloadURL(snapshot.ref);
      // console.log('in the file 5________________________________________________________________');
      console.log('File available at', url);
      return url;
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }
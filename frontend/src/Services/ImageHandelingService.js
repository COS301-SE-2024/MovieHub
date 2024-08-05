import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from "../../../backend/src/Firebase/firebase.config";

console.log('Firebase Storage Object:', storage);
console.log('Bucket:', storage._bucket);
console.log('Path:', storage._bucket.path_);

export const uploadImage = async (file) => {
	console.log("in Upload File", file);
    if (!file) {
		console.error('No file provided');
		return null; // Return null to indicate failure
    }
    try {
		const fname = file.assets[0].fileName;
		console.log("Filename:", fname);
		
		console.log("Path:", storage._bucket.path_);
		const storageRef = ref(storage, `ProfilePictures/${fname}`);
		console.log("storageRef", storageRef);

		const response = await fetch(file.assets[0].uri);
        const blob = await response.blob();

		const snapshot = await uploadBytes(storageRef, blob);
        console.log("snapshot", snapshot);

		const url = await getDownloadURL(snapshot.ref);
        console.log('File available at', url);
		// // Upload the file
		// const snapshot = await uploadBytes(storageRef, file);
		// console.log("snapshot", snapshot);
		// // Get the file's URL
		// const url = await getDownloadURL(snapshot.ref);
		
		// console.log('File available at', url);
		
		return url; //have to then send this url into db storage
    } catch (error) {
		console.error('Error uploading file:', error);
		return null; // Return null to indicate failure
    }
}

export const downloadImage = async => {
	getDownloadURL(profilePicRef, "spiderman_point.webp")
	.then((url) => {
		const xhr = new XMLHttpRequest();
		xhr.responseType = 'blob';
		xhr.onload = (event) => {
			const blob = xhr.response;
            const file = new File([blob], 'spiderman_point.webp', { type: 'image/jpeg' });
            console.log('File downloaded successfully:', file);
        };
		xhr.open('GET', url);
		xhr.send();
	});
}

//   {"assets": 
// 	[{
// 		"assetId": null, 
// 		"base64": null, 
// 		"duration": null, 
// 		"exif": null, 
// 		"fileName": "989d102e-02c1-4b7a-a61d-fa647e432d81.jpeg", 
// 		"fileSize": 6652474, "height": 2604, 
// 		"mimeType": "image/jpeg", 
// 		"rotation": null, "type": 
// 		"image", 
// 		"uri": "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252FMovieHub-3fc26583-b8e4-4d99-9a14-8eef4dc27304/ImagePicker/989d102e-02c1-4b7a-a61d-fa647e432d81.jpeg", "width": 2604
// 	}], 
// 	"canceled": false}


/*
{
	"_appCheckProvider": {
		"component": null, 
		"container": {
			"name": "[DEFAULT]", 
			"providers": [Map]}, 
			"instances": Map {}, 
			"instancesDeferred": Map {}, 
			"instancesOptions": Map {}, 
			"name": "app-check-internal", 
			"onInitCallbacks": Map {}}, 
			"_appId": null, 
			"_authProvider": {
				"component": {
					"instanceFactory": [Function anonymous], 
					"instantiationMode": "EXPLICIT", 
					"multipleInstances": false, 
					"name": "auth-internal", 
					"onInstanceCreated": null, 
					"serviceProps": [Object], 
					"type": "PRIVATE"}, 
					"container": {
						"name": "[DEFAULT]", 
						"providers": [Map]
					}, 
					"instances": Map {
						"[DEFAULT]" => [AuthInterop]
					}, 
					"instancesDeferred": Map {}, 
					"instancesOptions": Map {
						"[DEFAULT]" => [Object]
					}, 
					"name": "auth-internal", 
					"onInitCallbacks": Map {}}, 
					"_bucket": {
						"bucket": "moviehub-3ebc8.appspot.com", 
						"path_": ""
					}, 
					"_deleted": false, 
					"_firebaseVersion": "9.23.0", 
					"_host": "firebasestorage.googleapis.com", 
					"_maxOperationRetryTime": 120000, 
					"_maxUploadRetryTime": 600000, 
					"_protocol": "https", 
					"_requests": Set {}, 
					"_url": undefined, 
					"app": {"_automaticDataCollectionEnabled": false, "_config": {"automaticDataCollectionEnabled": false, "name": "[DEFAULT]"}, "_container": {"name": "[DEFAULT]", "providers": [Map]}, "_isDeleted": false, "_name": "[DEFAULT]", "_options": {"apiKey": "AIzaSyCR1DdCie3_-NR9L9hl5Yh7qQHAiamkVGg", "appId": "1:610731676085:web:8e670cd6f51f92e17d89fc", "authDomain": "moviehub-3ebc8.firebaseapp.com", "databaseURL": "https://moviehub-3ebc8-default-rtdb.europe-west1.firebasedatabase.app", "measurementId": "G-FNMTL54L6R", "messagingSenderId": "610731676085", "projectId": "moviehub-3ebc8", 

	"storageBucket": "moviehub-3ebc8.appspot.com"}}}

*/
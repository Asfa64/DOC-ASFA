import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCJrqe1sCqu9WokGb2ZwPZY1ypeO8KM4rw",
  authDomain: "asfa1-db.firebaseapp.com",
  projectId: "asfa1-db",
  storageBucket: "asfa1-db.firebasestorage.app",
  messagingSenderId: "5578288757",
  appId: "1:5578288757:web:7c0735ac341694d385d23c",
  measurementId: "G-1RFJ51D96Z"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.log('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.log('The current browser doesn\'t support persistence.');
    }
  });
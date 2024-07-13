// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAlr4-Qsl6mbopwWewTkOR3Mdi67wZgUPg",
  authDomain: "itp-project-830a8.firebaseapp.com",
  projectId: "itp-project-830a8",
  storageBucket: "itp-project-830a8.appspot.com",
  messagingSenderId: "931685001702",
  appId: "1:931685001702:web:45eb906c662318c6b90e27",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export default storage;

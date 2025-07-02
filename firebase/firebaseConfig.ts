import { initializeApp } from "firebase/app";
import { ENV } from "../enums/enums";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey:import.meta.env[ENV.VITE_APIKEY] ,
  authDomain:import.meta.env[ENV.VITE_AUTHDOMAIN],
  projectId:import.meta.env[ENV.VITE_PROJECTID],
  storageBucket:import.meta.env[ENV.VITE_STORAGEBUCKET],
  messagingSenderId: import.meta.env[ENV.VITE_MESSAGESENDERID],
  appId: import.meta.env[ENV.VITE_APPID]
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth =  getAuth();
export const db = getFirestore(app);

export default app;

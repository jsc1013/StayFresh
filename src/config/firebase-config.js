import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firebaseConfig from "./firebase.json";

// Firebase APP
export const firebaseApp = initializeApp(firebaseConfig);

// Firebase auth service
export const auth = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Firestore service
export const firestoreDB = getFirestore(firebaseApp);

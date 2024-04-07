import { firestoreDB } from "../config/firebase-config";
import { collection, query, getDoc, doc, setDoc } from "firebase/firestore";

export const getUserData = async (id) => {
  try {
    let userDoc = await getDoc(doc(firestoreDB, "users", id));
    return userDoc.data();
  } catch (e) {
    return;
  }
};

export const createUserProfile = async (id) => {
  try {
    await setDoc(doc(firestoreDB, "users", id), {
      homes: [],
    });
    return true;
  } catch (e) {
    return false;
  }
};

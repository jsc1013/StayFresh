import { firestoreDB } from "../config/firebase-config";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

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

export const updateUserHomes = async (id, updatedHomes) => {
  try {
    await updateDoc(doc(firestoreDB, "users", id), {
      homes: updatedHomes,
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

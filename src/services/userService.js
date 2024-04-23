import { firestoreDB } from "../config/firebase-config";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export async function getUserData(id) {
  try {
    let userDoc = await getDoc(doc(firestoreDB, "users", id));
    return userDoc.data();
  } catch (e) {
    return undefined;
  }
}

export async function createUserProfile(id) {
  try {
    await setDoc(doc(firestoreDB, "users", id), {
      homes: [],
      onboardingDone: false,
    });
    return true;
  } catch (e) {
    return false;
  }
}

export async function updateUserHomes(id, updatedHomes) {
  try {
    await updateDoc(doc(firestoreDB, "users", id), {
      homes: updatedHomes,
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

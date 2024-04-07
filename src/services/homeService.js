import { firestoreDB } from "../config/firebase-config";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export const getHomeStorages = async (homeId) => {
  try {
    let homeData = await getDoc(doc(firestoreDB, "homes", homeId));
    if (homeData.exists()) {
      return homeData.data().storage;
    } else {
      return [];
    }
  } catch (e) {
    return [];
  }
};

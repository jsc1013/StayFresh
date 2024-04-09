import { update } from "firebase/database";
import { firestoreDB } from "../config/firebase-config";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export async function updateStorages(homeId, newStorages) {
  try {
    await update(doc(firestoreDB, "homes", homeId), {
      storages: newStorages,
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function getStorages(homeId) {
  try {
    docStorages = await getDoc(doc(firestoreDB, "homes", homeId));
    let tempStorages = [];
    docStorages.data().storage.forEach((element) => {
      tempStorages.push(element);
    });
    return tempStorages;
  } catch (e) {
    console.log(e);
    return [];
  }
}

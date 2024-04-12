import { firestoreDB } from "../config/firebase-config";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export async function updateStorages(homeId, newStorages) {
  try {
    await updateDoc(doc(firestoreDB, "homes", homeId), {
      storage: newStorages,
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

import { firestoreDB } from "../config/firebase-config";
import {
  collection,
  doc,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

export async function getHomeStorages(homeId) {
  try {
    let homeData = await getDoc(doc(firestoreDB, "homes", homeId));
    if (homeData.exists()) {
      return homeData.data().storage;
    } else {
      return [];
    }
  } catch (e) {
    console.log(e);
    return [];
  }
}

export async function deleteHome(homeId) {
  try {
    await deleteDoc(doc(firestoreDB, "homes", homeId));
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function getHomeData(homeId) {
  try {
    homeData = await getDoc(doc(firestoreDB, "homes", homeId));
    if (homeData.exists()) {
      let data = await homeData.data();
      return data;
    } else {
      return undefined;
    }
  } catch (e) {
    console.log(e);
    return undefined;
  }
}

export async function updateHomeUsers(homeId, updatedUsers) {
  try {
    await update(doc(firestoreDB, "homes", homeId), {
      users: updatedUsers,
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function checkHomeIdExists(homeId) {
  try {
    let home = await getDoc(doc(firestoreDB, "homes", homeId));
    if (home.exists()) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.log(e);
    return e;
  }
}

export async function addNewHome(newHome) {
  try {
    const insertedDoc = await addDoc(collection(firestoreDB, "homes"), newHome);
    return insertedDoc.id;
  } catch (e) {
    console.log(e);
    return undefined;
  }
}

import { firestoreDB } from "../config/firebase-config";
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";

export const getHomeStorages = async (homeId) => {
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
};

export const deleteHome = async (homeId) => {
  try {
    await deleteDoc(doc(firestoreDB, "homes", homeId));
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const getHomeData = async (homeId) => {
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
};

export const updateHomeUsers = async (homeId, updatedUsers) => {
  try {
    await update(doc(firestoreDB, "homes", homeId), {
      users: updatedUsers,
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const checkHomeIdExists = async (homeId) => {
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
};

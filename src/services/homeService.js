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

export async function updateHomes(userId, updatedHomes) {
  try {
    await updateDoc(doc(firestoreDB, "users", userId), {
      homes: updatedHomes,
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

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
      return homeData.data();
    } else {
      return {};
    }
  } catch (e) {
    console.log(e);
    return {};
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

import { firestoreDB } from "../config/firebase-config";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { addNewHome } from "./homeService";

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
    const newHome = {
      addedDate: new Date().getTime(),
      storage: ["default"],
      users: [id],
    };

    let homeid = await addNewHome(newHome);
    await setDoc(doc(firestoreDB, "users", id), {
      homes: [
        {
          default: true,
          id: homeid,
          name: "defaultHome",
          previewDays: 7,
        },
      ],
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

export async function updateUserOnboarding(id) {
  try {
    await updateDoc(doc(firestoreDB, "users", id), {
      onboardingDone: true,
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

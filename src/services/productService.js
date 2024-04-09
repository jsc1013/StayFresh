import { firestoreDB } from "../config/firebase-config";
import {
  collection,
  query,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  where,
} from "firebase/firestore";
import { myColors } from "../constants/Colors";
import i18next from "../services/i18next";

const milisecondsInDay = 86400000;
const rangeOne = 3;
const rangeTwo = 7;
const timeStamp = Date.now();

// Gets the products from firebase in a range
export async function getUserProductsPreviewDate(home, previewDate) {
  const productQuery = query(
    collection(firestoreDB, "products"),
    where("expirationDate", "<=", previewDate),
    where("home", "==", home),
    where("consumed", "==", false)
  );

  docs = await getDocs(productQuery);
  let products = [];
  docs.forEach((docProduct) => {
    let product = docProduct.data();
    product.id = docProduct.id;
    product.key = docProduct.id;
    product = calculateProductProperties(product);
    products.push(product);
  });
  products.sort(
    (firstItem, secondItem) => firstItem.expiracy - secondItem.expiracy
  );
  return products;
}

function calculateProductProperties(product) {
  product.remainingTime = Math.round(
    (product.expirationDate - timeStamp) / milisecondsInDay
  );

  if (product.remainingTime >= rangeTwo) {
    product.remainingTime = Math.floor(product.remainingTime / 7);
    product.remainingTimeCharacter = i18next.t("general.shortWeeks");
    product.color = myColors.goodCondition;
  } else if (product.remainingTime >= rangeOne) {
    product.remainingTimeCharacter = i18next.t("general.shortDays");
    product.color = myColors.midCodition;
  } else if (product.remainingTime >= 0) {
    product.remainingTimeCharacter = i18next.t("general.shortDays");
    product.color = myColors.badCondition;
  } else {
    product.remainingTimeCharacter = "d";
    product.color = myColors.noConsumeCondition;
  }
  return product;
}

export async function updateProductQuantity(productId, quantity) {
  try {
    await updateDoc(doc(firestoreDB, "products", productId), {
      quantity: parseInt(quantity),
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function consumeProduct(productId) {
  try {
    await updateDoc(doc(firestoreDB, "products", productId), {
      consumed: true,
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function getAllProductsPeriod(homeId, fetchPeriod) {
  tempItemsStorage = [];
  const q = query(
    collection(firestoreDB, "products"),
    (where("home", "==", homeId), where("addedDate", ">=", fetchPeriod))
  );

  tempArray = [];
  docs = await getDocs(q);

  docs.forEach((doc) => {
    product = doc.data();
    product.id = doc.id;
    tempArray.push(product);
  });

  const filteredArray = tempArray.filter(
    (obj, index) =>
      tempArray.findIndex((item) => item.barcode === obj.barcode) === index
  );

  return filteredArray;
}

export async function addProduct(doc) {
  try {
    await addDoc(collection(firestoreDB, "products"), doc);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function getAllNotConsumed(home) {
  const productQuery = query(
    collection(firestoreDB, "products"),
    where("home", "==", home),
    where("consumed", "==", false)
  );

  docs = await getDocs(productQuery);
  let products = [];
  docs.forEach((docProduct) => {
    let product = docProduct.data();
    product.id = docProduct.id;
    products.push(product);
  });
  return products;
}

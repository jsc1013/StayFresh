import { firestoreDB } from "../config/firebase-config";
import { collection, query, getDocs, where } from "firebase/firestore";
import { myColors } from "../constants/Colors";
import i18next from "../services/i18next";

const defaultPreviewDate = 15 * 86400000 + new Date().getTime();
const milisecondsInDay = 86400000;
const rangeOne = 3;
const rangeTwo = 7;
const timeStamp = Date.now();

// Gets the products from firebase in a range
export const getUserProductsPreviewDate = async (
  home,
  previewDate = defaultPreviewDate
) => {
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
    product = calculateProductProperties(product);
    products.push(product);
  });
  products.sort(
    (firstItem, secondItem) => firstItem.expiracy - secondItem.expiracy
  );
  return products;
};

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

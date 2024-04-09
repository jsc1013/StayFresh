import { myColors } from "../constants/Colors";

const milisecondsInDay = 86400000;
const rangeOne = 3;
const rangeTwo = 7;
const timeStamp = Date.now();

export function calculateProduct(expirationDate) {
  let remainingTime = Math.round(
    (expirationDate - timeStamp) / milisecondsInDay
  );
  if (remainingTime >= rangeTwo) {
    return {
      color: myColors.goodCondition,
      remainingTime: remainingTime,
      range: 1,
    };
  } else if (remainingTime >= rangeOne) {
    return {
      color: myColors.midCodition,
      remainingTime: remainingTime,
      range: 2,
      icon: { name: "exclamation-thick", color: myColors.midCodition },
    };
  } else if (remainingTime >= 0) {
    return {
      color: myColors.badCondition,
      remainingTime: remainingTime,
      range: 3,
      icon: { name: "alert-outline", color: myColors.badCondition },
    };
  } else {
    return {
      color: myColors.badCondition,
      remainingTime: remainingTime,
      range: 4,
      icon: { name: "skull-crossbones", color: myColors.badCondition },
    };
  }
}

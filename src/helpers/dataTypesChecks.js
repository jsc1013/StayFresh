// Checks if value is an integer
export function isInt(value) {
  return (
    !isNaN(value) &&
    parseInt(Number(value)) == value &&
    !isNaN(parseInt(value, 10))
  );
}

// Checks if value is positive
export function isPositive(number) {
  if (number > 0) {
    return true;
  } else {
    return false;
  }
}

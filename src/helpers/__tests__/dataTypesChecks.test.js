import { isInt, isPositive } from "../dataTypesChecks";

describe("isInt", () => {
  test("debería retornar true para números enteros", () => {
    expect(isInt(1)).toBe(true);
    expect(isInt(-100)).toBe(true);
    expect(isInt(0)).toBe(true);
  });

  test("debería retornar false para números no enteros", () => {
    expect(isInt(1.5)).toBe(false);
    expect(isInt(-2.99)).toBe(false);
  });

  test("debería retornar false para valores que no son números", () => {
    expect(isInt("texto")).toBe(false);
    expect(isInt({})).toBe(false);
    expect(isInt([])).toBe(false);
    expect(isInt(null)).toBe(false);
    expect(isInt(undefined)).toBe(false);
    expect(isInt(true)).toBe(false);
  });
});

describe("isPositive", () => {
  test("debe retornar true para números positivos", () => {
    expect(isPositive(1)).toBe(true);
    expect(isPositive(20)).toBe(true);
    expect(isPositive(0.1)).toBe(true);
  });

  test("debe retornar false para cero", () => {
    expect(isPositive(0)).toBe(false);
  });

  test("debe retornar false para números negativos", () => {
    expect(isPositive(-1)).toBe(false);
    expect(isPositive(-20)).toBe(false);
    expect(isPositive(-0.1)).toBe(false);
  });
});

import { isInt } from "../dataTypesChecks";

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

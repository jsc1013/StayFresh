import en from "../en.json";
import es from "../es.json";

describe("Validación de formato JSON del módulo en", () => {
  test("debe contener las propiedades esperadas", () => {
    expect(en).toHaveProperty("components");
    expect(en).toHaveProperty("components.login");
    expect(en).toHaveProperty("components.home");
    expect(en).toHaveProperty("components.addProduct");
    expect(en).toHaveProperty("components.modal");
    expect(en).toHaveProperty("components.homeManagement");
    expect(en).toHaveProperty("components.consumeProduct");
    expect(en).toHaveProperty("components.storage");
    expect(en).toHaveProperty("components.onboarding");
    expect(en).toHaveProperty("general");
  });

  test("debe ser un objeto no vacío", () => {
    expect(en).not.toEqual({});
  });
});

describe("Validación de formato JSON del módulo es", () => {
  test("debe contener las propiedades esperadas", () => {
    expect(es).toHaveProperty("components");
    expect(es).toHaveProperty("components.login");
    expect(es).toHaveProperty("components.home");
    expect(es).toHaveProperty("components.addProduct");
    expect(es).toHaveProperty("components.modal");
    expect(es).toHaveProperty("components.homeManagement");
    expect(es).toHaveProperty("components.consumeProduct");
    expect(es).toHaveProperty("components.storage");
    expect(es).toHaveProperty("components.onboarding");
    expect(es).toHaveProperty("general");
  });

  test("debe ser un objeto no vacío", () => {
    expect(es).not.toEqual({});
  });
});

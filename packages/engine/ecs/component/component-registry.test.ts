import { expect, test } from "vitest";
import { ComponentRegistry } from "./component-registry";

test("register", () => {
  const componentRegistry = new ComponentRegistry();
  const component0 = componentRegistry.register("@scatter/test");
  expect(component0).toEqual(0);

  const component1 = componentRegistry.register("@scatter/test");
  expect(component1).toEqual(1);
});

test("has", () => {
  const componentRegistry = new ComponentRegistry();
  const component0 = componentRegistry.register("@scatter/test");
  expect(componentRegistry.has(component0)).toEqual(true);
});

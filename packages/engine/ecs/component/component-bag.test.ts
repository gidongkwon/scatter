import { expect, test } from "vitest";
import { EntityRegistry } from "../entity/entity-registry";
import { ComponentBag } from "./component-bag";

test("add/has", () => {
  const entityRegistry = new EntityRegistry();
  const bag = new ComponentBag(0);

  const entity0 = entityRegistry.create("");
  const entity1 = entityRegistry.create("");

  bag.add(entity0, { x: 0 });

  expect(bag.has(entity0)).toBe(true);
  expect(bag.has(entity1)).toBe(false);

  bag.add(entity1, { x: 0 });

  expect(bag.has(entity0)).toBe(true);
  expect(bag.has(entity1)).toBe(true);
});

test("add/remove", () => {
  const bag = new ComponentBag(0);

  for (let i = 0; i < 100; i++) {
    bag.add(i, 0);
  }

  for (let i = 0; i < 100; i++) {
    bag.remove(i);
  }

  expect(bag.length).toBe(0);
});

test("remove/get/length", () => {
  const entityRegistry = new EntityRegistry();
  const bag = new ComponentBag(0);

  const entity0 = entityRegistry.create("");
  const entity1 = entityRegistry.create("");

  bag.add(entity0, { x: 0 });

  expect(bag.has(entity0)).toBe(true);
  expect(bag.length).toBe(1);
  expect(bag.get(entity0)).toEqual({ x: 0 });

  bag.add(entity1, { x: 5 });

  expect(bag.length).toBe(2);
  expect(bag.get(entity0)).toEqual({ x: 0 });
  expect(bag.get(entity1)).toEqual({ x: 5 });

  bag.remove(entity0);

  expect(bag.get(entity0)).toBeNull();
  expect(bag.get(entity1)).toEqual({ x: 5 });
  expect(bag.has(entity0)).toBe(false);
  expect(bag.length).toBe(1);
});

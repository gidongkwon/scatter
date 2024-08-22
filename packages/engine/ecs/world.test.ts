import { expect, test } from "vitest";
import { EngineSignals } from "../signal/engine-signals";
import { World } from "./world";

test("addSystem/hasSystem", () => {
  const world = new World(new EngineSignals());
  let count = 0;
  const system = () => {
    count++;
  };
  expect(world.hasSystem("update", system)).toBe(false);
  world.addSystem("update", system);
  expect(world.hasSystem("update", system)).toBe(true);
});

test("removeSystem", () => {
  const world = new World(new EngineSignals());
  const system = () => {};
  expect(world.hasSystem("update", system)).toBe(false);
  world.addSystem("update", system);
  expect(world.hasSystem("update", system)).toBe(true);
  world.removeSystem("update", system);
  expect(world.hasSystem("update", system)).toBe(false);
});

test("update", () => {
  const world = new World(new EngineSignals());
  let count = 0;
  const system = () => {
    count++;
  };

  world.addSystem("update", system);
  world.callInitSystems();

  world.update(0);
  world.update(0);
  world.update(0);
  world.update(0);
  world.update(0);
  expect(count).toBe(5);
});

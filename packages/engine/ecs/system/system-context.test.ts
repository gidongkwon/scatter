import { read } from "ecs/component/component-access-descriptor";
import { EngineSignals } from "signal/engine-signals";
import { expect, test } from "vitest";
import { World } from "../world";
import { SystemContext } from "./system-context";

test("each", () => {
  const world = new World(new EngineSignals());
  const systemContext = world.context;
  const entity0 = world.addEntity("Entity");
  const entity1 = world.addEntity("Entity");
  const entity2 = world.addEntity("Entity");
  const A = world.registerComponent("@test/A");
  const B = world.registerComponent("@test/B");
  const C = world.registerComponent("@test/C");
  const D = world.registerComponent("@test/D");

  world.addComponent(entity0, A, {});
  world.addComponent(entity0, B, {});

  world.addComponent(entity1, A, {});
  world.addComponent(entity1, B, {});
  world.addComponent(entity1, C, {});

  world.addComponent(entity2, B, {});
  world.addComponent(entity2, C, {});

  let executedEntities: number[] = [];
  systemContext.each([read(D)], (entity) => {
    executedEntities.push(entity);
  });
  expect(executedEntities).toEqual([]);

  executedEntities = [];
  systemContext.each([read(A), read(B), read(C)], (entity) => {
    executedEntities.push(entity);
  });
  expect(executedEntities).toEqual([entity1]);

  executedEntities = [];
  systemContext.each([read(A), read(B)], (entity) => {
    executedEntities.push(entity);
  });
  expect(executedEntities).toEqual([entity0, entity1]);
});

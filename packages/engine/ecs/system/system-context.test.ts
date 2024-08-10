import { expect, test } from "vitest";
import { World } from "../world";
import { SystemContext } from "./system-context";

test("each", () => {
  const world = new World();
  const systemContext = new SystemContext(world);
  const entity0 = world.addEntity();
  const entity1 = world.addEntity();
  const entity2 = world.addEntity();
  const A = world.registerComponent();
  const B = world.registerComponent();
  const C = world.registerComponent();
  const D = world.registerComponent();

  world.addComponent(entity0, A, {});
  world.addComponent(entity0, B, {});

  world.addComponent(entity1, A, {});
  world.addComponent(entity1, B, {});
  world.addComponent(entity1, C, {});

  world.addComponent(entity2, B, {});
  world.addComponent(entity2, C, {});

  let executedEntities: number[] = [];
  systemContext.each([D], (entity) => {
    executedEntities.push(entity);
  });
  expect(executedEntities).toEqual([]);

  executedEntities = [];
  systemContext.each([A, B, C], (entity) => {
    executedEntities.push(entity);
  });
  expect(executedEntities).toEqual([entity1]);

  executedEntities = [];
  systemContext.each([A, B], (entity) => {
    executedEntities.push(entity);
  });
  expect(executedEntities).toEqual([entity0, entity1]);
});

import * as World from './World.gen';
import { test, expect } from 'vitest';

function getWorld() {
  return World.make();
}

test('startup', () => {
  const world = getWorld();
  let a = 1;
  World.registerSystem(world, "Startup", () => a += 1);

  World.startup(world);
  World.update(world, 0);
  World.render(world);

  expect(a).toEqual(2)
})

test('update', () => {
  const world = getWorld();
  let a = 1;
  World.registerSystem(world, "Update", (world) => a += world.dt);
  
  World.startup(world);
  World.update(world, 1);
  World.update(world, 1);
  World.render(world);

  expect(a).toEqual(3)
})

test('render', () => {
  const world = getWorld();
  let a = 1;
  World.registerSystem(world, "Render", () => a += 1);
  
  World.startup(world);
  World.update(world, 0);
  World.render(world);

  expect(a).toEqual(2)
})
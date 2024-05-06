import * as World from './World.gen';
import * as Query from './Query.gen';
import { test, expect } from 'vitest';

test('has entity', () => {
  const world = World.make();
  const entity = World.makeEntity(world)
  expect(World.hasEntity(world, entity)).toBe(true)
})

test('has ')
import * as World from './World.gen';
import * as Query from './Query.gen';
import { test, expect } from 'vitest';

function getWorld() {
  return World.make();
}

test('query one component', () => {
  const world = getWorld();

  const position = World.defineComponent(world)
  const entity = World.makeEntity(world)
  // World.addComponent(world, entity, position);
  const query = Query.make([position]);

})
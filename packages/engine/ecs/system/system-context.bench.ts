import { bench, describe } from "vitest";
import { World } from "../world";
import { SystemContext } from "./system-context";

const world = new World();
const systemContext = new SystemContext(world);
const A = world.registerComponent();
const B = world.registerComponent();
const C = world.registerComponent();
const D = world.registerComponent();
const E = world.registerComponent();
for (let i = 0; i < 100000; i++) {
  const entity = world.addEntity();
  const componentTypes = [A, B, C, D, E].filter(() => Math.random() > 0.3);

  for (const componentId of componentTypes) {
    world.addComponent(entity, componentId, {
      x: Math.random() * 500,
      y: Math.random() * 500,
    });
  }
}

describe("single system", () => {
  bench(
    "each",
    () => {
      type Comp = { x: number; y: number };
      systemContext.each(
        [A, B, C],
        (entity, [componentA, componentB, componentC]) => {
          const a = componentA as Comp;
          const b = componentB as Comp;
          const c = componentC as Comp;
          c.x = a.x + b.x;
          c.y = a.y + b.y;
        },
      );
    },
    {
      iterations: 1000,
    },
  );
});

describe("multiple system", () => {
  bench(
    "each",
    () => {
      type Comp = { x: number; y: number };
      systemContext.each(
        [A, B, C],
        (entity, [componentA, componentB, componentC]) => {
          const a = componentA as Comp;
          const b = componentB as Comp;
          const c = componentC as Comp;
          c.x = a.x + b.x;
          c.y = a.y + b.y;
        },
      );

      systemContext.each(
        [A, D, E],
        (entity, [componentA, componentD, componentE]) => {
          const a = componentA as Comp;
          const d = componentD as Comp;
          const e = componentE as Comp;
          e.x = a.x * d.x;
          e.y = a.y * d.y;
        },
      );
    },
    {
      iterations: 1000,
    },
  );
});

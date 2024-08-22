import { bench, describe } from "vitest";
import { EngineSignals } from "../../signal/engine-signals";
import { read, write } from "../component/component-access-descriptor";
import { World } from "../world";

const world = new World(new EngineSignals());
const systemContext = world.context;
const A = world.registerComponent("@scatter/test");
const B = world.registerComponent("@scatter/test");
const C = world.registerComponent("@scatter/test");
const D = world.registerComponent("@scatter/test");
const E = world.registerComponent("@scatter/test");
for (let i = 0; i < 100000; i++) {
  const entity = world.addEntity("");
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
        [read(A), read(B), write(C)],
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
        [read(A), read(B), write(C)],
        (entity, [componentA, componentB, componentC]) => {
          const a = componentA as Comp;
          const b = componentB as Comp;
          const c = componentC as Comp;
          c.x = a.x + b.x;
          c.y = a.y + b.y;
        },
      );

      systemContext.each(
        [read(A), read(D), write(E)],
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

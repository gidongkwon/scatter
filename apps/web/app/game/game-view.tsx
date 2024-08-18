import type { Sprite } from "@scatter/engine/2d/sprite";
import type { Transform } from "@scatter/engine/2d/transform";
import { useRef } from "react";
import { useEngine } from "./use-engine";
import type { System } from "@scatter/engine";
import { Timer } from "@scatter/engine/timer/timer";

export function GameView() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engine = useEngine(canvasRef, (engine) => {
    const textures = [
      engine.assets.loadImage("/shooter/playerShip1_blue.png"),
      engine.assets.loadImage("/shooter/playerShip2_green.png"),
      engine.assets.loadImage("/shooter/playerShip3_red.png"),
    ];

    // TODO: implement proper id management system or better component design
    const TransformId = 0;
    const SpriteId = 1;
    const PlayerId = engine.world.registerComponent();
    const EnemyId = engine.world.registerComponent();

    engine.world.addSystem("init", (context) => {
      context.spawn([
        [
          TransformId,
          {
            position: {
              x: 100,
              y: 100,
            },
            scale: {
              x: 1,
              y: 1,
            },
          } satisfies Transform,
        ],
        [
          SpriteId,
          { textureInfo: textures[0], width: 1, height: 1 } satisfies Sprite,
        ],
        [PlayerId, true],
      ]);
    });

    const playerMoveSystem: System = (context) => {
      context.each(
        [TransformId, SpriteId, PlayerId],
        (entity, rawComponents) => {
          const [transform, sprite] = rawComponents as unknown as [
            Transform,
            Sprite,
          ];

          console.log(entity, rawComponents);

          const speed = 300;
          if (context.keyboard.isPressed("ArrowLeft")) {
            transform.position.x -= speed * context.deltaTime;
          }
          if (context.keyboard.isPressed("ArrowRight")) {
            transform.position.x += speed * context.deltaTime;
          }
          if (context.keyboard.isPressed("ArrowUp")) {
            transform.position.y -= speed * context.deltaTime;
          }
          if (context.keyboard.isPressed("ArrowDown")) {
            transform.position.y += speed * context.deltaTime;
          }
        },
      );
    };

    const timer = new Timer(3, { type: "infinite" });
    const enemySpawnSystem: System = (context) => {
      timer.tick(context.deltaTime);
      if (timer.segmentFinished) {
        context.spawn([
          [
            TransformId,
            {
              position: {
                x: 100,
                y: 100,
              },
              scale: {
                x: 1,
                y: 1,
              },
            } satisfies Transform,
          ],
          [
            SpriteId,
            { textureInfo: textures[1], width: 1, height: 1 } satisfies Sprite,
          ],
          [EnemyId, true],
        ]);
      }
    };

    engine.world.addSystem("update", playerMoveSystem);
    engine.world.addSystem("update", enemySpawnSystem);
  });

  return (
    <canvas ref={canvasRef} className="flex-1 min-w-0">
      No canvas support.
    </canvas>
  );
}

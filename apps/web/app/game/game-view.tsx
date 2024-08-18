import type { Sprite } from "@scatter/engine/2d/sprite";
import type { Transform } from "@scatter/engine/2d/transform";
import { useRef } from "react";
import { useEngine } from "./use-engine";
import type { System } from "@scatter/engine";
import { Timer } from "@scatter/engine/timer/timer";

export function GameView() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engine = useEngine(canvasRef, (engine) => {
    const playerTexture = engine.assets.loadImage(
      "/shooter/playerShip1_blue.png",
    );
    const enemyTexture = engine.assets.loadImage(
      "/shooter/playerShip3_red.png",
    );
    const playerBulletTexture = engine.assets.loadImage(
      "/shooter/Lasers/laserBlue01.png",
    );

    // TODO: implement proper id management system or better component design
    const TransformId = 0;
    const SpriteId = 1;
    const VelocityId = engine.world.registerComponent();
    interface Velocity {
      x: number;
      y: number;
    }

    const PlayerId = engine.world.registerComponent();
    interface Player {
      score: number;
    }

    const EnemyId = engine.world.registerComponent();

    const BulletShooterId = engine.world.registerComponent();
    interface BulletShooter {
      delayTimer: Timer;
    }

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
          { textureInfo: playerTexture, width: 1, height: 1 } satisfies Sprite,
        ],
        [PlayerId, { score: 0 } satisfies Player],
        [
          BulletShooterId,
          {
            delayTimer: new Timer(0.1, { type: "once" }),
          } satisfies BulletShooter,
        ],
      ]);
    });

    const playerMoveSystem: System = (context) => {
      context.each([TransformId, SpriteId, PlayerId], (_, rawComponents) => {
        const [transform] = rawComponents as unknown as [Transform];

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
      });
    };

    const playerShooterSystem: System = (context) => {
      context.each(
        [TransformId, BulletShooterId, PlayerId],
        (_, rawComponents) => {
          const [playerTransform, bulletShooter] = rawComponents as unknown as [
            Transform,
            BulletShooter,
          ];
          bulletShooter.delayTimer.tick(context.deltaTime);
          if (!bulletShooter.delayTimer.finished) {
            return;
          }

          if (context.keyboard.isPressed("KeyZ")) {
            context.spawn([
              [
                SpriteId,
                {
                  textureInfo: playerBulletTexture,
                  width: 1,
                  height: 1,
                } satisfies Sprite,
              ],
              [
                TransformId,
                {
                  position: {
                    x: playerTransform.position.x,
                    y: playerTransform.position.y,
                  },
                  scale: {
                    x: 1,
                    y: 1,
                  },
                } satisfies Transform,
              ],
              [
                VelocityId,
                {
                  x: 500,
                  y: 0,
                } satisfies Velocity,
              ],
            ]);
          }
        },
      );
    };

    const timer = new Timer(1, { type: "infinite" });
    const enemySpawnSystem: System = (context) => {
      timer.tick(context.deltaTime);
      if (timer.segmentFinished) {
        context.spawn([
          [
            TransformId,
            {
              position: {
                x: Math.random() * context.stageWidth,
                y: Math.random() * context.stageHeight,
              },
              scale: {
                x: 1,
                y: 1,
              },
            } satisfies Transform,
          ],
          [
            SpriteId,
            { textureInfo: enemyTexture, width: 1, height: 1 } satisfies Sprite,
          ],
          [EnemyId, true],
          [
            BulletShooterId,
            {
              delayTimer: new Timer(0.5, { type: "once" }),
            } satisfies BulletShooter,
          ],
        ]);
      }
    };

    const velocitySystem: System = (context) => {
      context.each([VelocityId, TransformId], (_, rawComponents) => {
        const [velocity, transform] = rawComponents as unknown as [
          Velocity,
          Transform,
        ];
        transform.position.x += velocity.x * context.deltaTime;
        transform.position.y += velocity.y * context.deltaTime;
      });
    };

    engine.world.addSystem("update", playerMoveSystem);
    engine.world.addSystem("update", playerShooterSystem);
    engine.world.addSystem("update", enemySpawnSystem);
    engine.world.addSystem("update", velocitySystem);
  });

  return (
    <canvas ref={canvasRef} className="flex-1 min-w-0">
      No canvas support.
    </canvas>
  );
}

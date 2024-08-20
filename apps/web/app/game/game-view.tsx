import type { System } from "@scatter/engine";
import type { Sprite } from "@scatter/engine/2d/sprite";
import type { Transform } from "@scatter/engine/2d/transform";
import {
  type BoundsWithData,
  Quadtree,
} from "@scatter/engine/collections/quadtree";
import type { Component } from "@scatter/engine/ecs/component/component";
import {
  read,
  write,
} from "@scatter/engine/ecs/component/component-access-descriptor";
import type { Entity } from "@scatter/engine/ecs/entity/entity";
import { ScatterEvent } from "@scatter/engine/ecs/event/event";
import { toRadian } from "@scatter/engine/math/math";
import { Timer } from "@scatter/engine/timer/timer";
import { assert } from "@scatter/engine/utils/assert";
import { useRef, useState } from "react";
import { ComponentView } from "~/inspector/component-view";
import { useEngine } from "./use-engine";

export function GameView() {
  const [selectedEntity, setSelectedEntity] = useState({});
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engine = useEngine(canvasRef, (engine) => {
    engine.signals.entityComponentChanged.register(0, (data) => {
      setSelectedEntity((before) => ({
        ...before,
        [data.componentId]: data.component,
      }));
    });

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
    const BulletId = engine.world.registerComponent();
    interface Bullet {
      owner: Entity;
    }
    const BulletShooterId = engine.world.registerComponent();
    interface BulletShooter {
      delayTimer: Timer;
      offset: {
        x: number;
        y: number;
      };
    }
    const RemoveOnOutsideId = engine.world.registerComponent();
    const ColliderId = engine.world.registerComponent();
    interface Collider extends BoundsWithData<Entity> {}

    engine.world.registerEvent("collision");
    class CollisionEvent extends ScatterEvent {
      name = "collision";
      constructor(
        public a: Entity,
        public b: Entity,
      ) {
        super();
      }
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
            rotation: toRadian(180),
            scale: {
              x: 0.5,
              y: 0.5,
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
            offset: {
              x: playerTexture.width / 2,
              y: playerTexture.height / 2 / 2,
            },
          } satisfies BulletShooter,
        ],
        [
          ColliderId,
          {
            data: -1,
            bounds: {
              x: 0,
              y: 0,
              width: playerTexture.width,
              height: playerTexture.height,
            },
          } satisfies Collider,
        ],
      ]);
    });

    const playerMoveSystem: System = (context) => {
      context.each(
        [write(TransformId), read(SpriteId), read(PlayerId)],
        (_, rawComponents) => {
          const [transform] = rawComponents as [Transform];

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

    const playerShootSystem: System = (context) => {
      context.each(
        [read(TransformId), write(BulletShooterId), read(PlayerId)],
        (shooter, rawComponents) => {
          const [playerTransform, bulletShooter] = rawComponents as [
            Transform,
            BulletShooter,
          ];
          bulletShooter.delayTimer.tick(context.deltaTime);
          if (!bulletShooter.delayTimer.finished) {
            return;
          }

          if (context.keyboard.isPressed("KeyZ")) {
            bulletShooter.delayTimer.reset();
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
                  rotation: toRadian(90),
                  scale: {
                    x: 1,
                    y: 1,
                  },
                } satisfies Transform,
              ],
              [
                VelocityId,
                {
                  x: 700,
                  y: 0,
                } satisfies Velocity,
              ],
              [RemoveOnOutsideId, true],
              [BulletId, { owner: shooter } satisfies Bullet],
              [
                ColliderId,
                {
                  data: -1,
                  bounds: {
                    x: 0,
                    y: 0,
                    width: playerBulletTexture.height,
                    height: playerBulletTexture.width,
                  },
                } satisfies Collider,
              ],
            ]);
          }
        },
      );
    };

    const maxEnemey = 300;
    let currentEnemy = 0;
    const timer = new Timer(0.2, { type: "infinite" });
    const enemySpawnSystem: System = (context) => {
      timer.tick(context.deltaTime);
      if (timer.segmentFinished) {
        if (currentEnemy >= maxEnemey) {
          return;
        }
        currentEnemy += 1;
        const scale = 0.3;
        context.spawn([
          [
            TransformId,
            {
              position: {
                x: Math.random() * context.stageWidth,
                y: Math.random() * context.stageHeight,
              },
              rotation: 0,
              scale: {
                x: scale,
                y: scale,
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
              offset: {
                x: 0,
                y: 0,
              },
            } satisfies BulletShooter,
          ],
          [
            ColliderId,
            {
              data: -1,
              bounds: {
                x: 0,
                y: 0,
                width: enemyTexture.width * scale,
                height: enemyTexture.height * scale,
              },
            } satisfies Collider,
          ],
        ]);
      }
    };

    const enemyShootSystem: System = (context) => {
      context.each(
        [read(TransformId), write(BulletShooterId), read(EnemyId)],
        (shooter, rawComponents) => {
          const [enemyTransform, bulletShooter] = rawComponents as [
            Transform,
            BulletShooter,
          ];
          bulletShooter.delayTimer.tick(context.deltaTime);
          if (!bulletShooter.delayTimer.finished) {
            return;
          }
          bulletShooter.delayTimer.reset();
          const scale = 0.3;
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
                  x: enemyTransform.position.x,
                  y: enemyTransform.position.y,
                },
                rotation: toRadian(90),
                scale: {
                  x: scale,
                  y: scale,
                },
              } satisfies Transform,
            ],
            [
              VelocityId,
              {
                x: -500,
                y: 0,
              } satisfies Velocity,
            ],
            [RemoveOnOutsideId, true],
            [BulletId, { owner: shooter } satisfies Bullet],
            [
              ColliderId,
              {
                data: -1,
                bounds: {
                  x: 0,
                  y: 0,
                  width: playerBulletTexture.height * scale,
                  height: playerBulletTexture.width * scale,
                },
              } satisfies Collider,
            ],
          ]);
        },
      );
    };

    const velocitySystem: System = (context) => {
      context.each(
        [read(VelocityId), write(TransformId)],
        (_, rawComponents) => {
          const [velocity, transform] = rawComponents as [Velocity, Transform];
          transform.position.x += velocity.x * context.deltaTime;
          transform.position.y += velocity.y * context.deltaTime;
        },
      );
    };

    const clearOutsideObjectSystem: System = (context) => {
      context.each(
        [read(TransformId), read(SpriteId), read(RemoveOnOutsideId)],
        (entity, rawComponents) => {
          const [transform, sprite] = rawComponents as [Transform, Sprite];
          if (
            transform.position.x + sprite.textureInfo.width < 0 ||
            transform.position.x > context.stageWidth ||
            transform.position.y + sprite.textureInfo.height < 0 ||
            transform.position.y > context.stageHeight
          ) {
            context.despawn(entity);
          }
        },
      );
    };

    const quadtree = new Quadtree<Entity>(
      { x: 0, y: 0, width: 1000, height: 1000 },
      40,
      0,
      3,
    );
    engine.signals.anyEntityDespawned.register((data) => {
      if (engine.world.hasComponent(data.entity, ColliderId)) {
        quadtree.remove(
          engine.world.getComponent(data.entity, ColliderId) as Collider,
        );
      }
    });
    const updateColliderQuadtreeSystem: System = (context) => {
      context.each(
        [read(TransformId), write(ColliderId)],
        (entity, rawComponents) => {
          const [transform, collider] = rawComponents as [Transform, Collider];

          collider.bounds.x = transform.position.x;
          collider.bounds.y = transform.position.y;
          collider.data = entity;

          quadtree.update(collider);
        },
      );

      quadtree.shrinkIfNeeded();
    };

    const queryResult: Set<Collider> = new Set();
    const collisionSystemRequiredComponents = [read(ColliderId)];
    const collisionSystem: System = (context) => {
      context.each(
        collisionSystemRequiredComponents,
        (entityA, rawComponentsA) => {
          const [collider] = rawComponentsA as [Collider];

          queryResult.clear();
          quadtree.query(collider.bounds, queryResult);

          for (const result of queryResult) {
            const entityB = result.data;
            for (const e of context.readEvent("collision")) {
              assert(e instanceof CollisionEvent);
              if (
                (e.a === entityA && e.b === entityB) ||
                (e.b === entityA && e.a === entityB)
              ) {
                return;
              }
            }
            context.createEvent(
              "collision",
              new CollisionEvent(entityA, entityB),
            );
          }
        },
      );
    };

    const scoreSystem: System = (context) => {
      for (const event of context.readEvent("collision")) {
        assert(event instanceof CollisionEvent);
        let bulletEntity = event.a;
        let targetEntity = event.b;
        if (!context.hasComponent(bulletEntity, BulletId)) {
          bulletEntity = event.b;
          targetEntity = event.a;
        }

        // both are not bullet. continue.
        if (!context.hasComponent(bulletEntity, BulletId)) {
          continue;
        }

        const bullet = context.getComponent(
          bulletEntity,
          read(BulletId),
        ) as Bullet;

        const scoredPlayerComponent = context.getComponent(
          bullet.owner,
          write(PlayerId),
        ) as Player;
        if (bullet.owner !== targetEntity && scoredPlayerComponent != null) {
          scoredPlayerComponent.score += 1;
          context.despawn(targetEntity);
        }
      }
    };

    engine.world.addSystem("update", playerMoveSystem);
    engine.world.addSystem("update", playerShootSystem);
    engine.world.addSystem("update", enemySpawnSystem);
    engine.world.addSystem("update", enemyShootSystem);
    engine.world.addSystem("update", velocitySystem);
    engine.world.addSystem("update", updateColliderQuadtreeSystem);
    engine.world.addSystem("update", collisionSystem);
    engine.world.addSystem("update", scoreSystem);
    engine.world.addSystem("update", clearOutsideObjectSystem);
  });

  return (
    <div className="w-full h-full flex gap-3">
      <canvas ref={canvasRef} className="flex-1 min-w-0">
        No canvas support.
      </canvas>
      <div className="w-[300px] flex flex-col">
        <div>Avg. FPS: {engine?.averageFPS.toFixed(2)}</div>
        <div>Entities: {engine?.world.entities.alives().length}</div>
        <div>
          {Object.entries(selectedEntity).map(([componentId, component]) => {
            return (
              <ComponentView
                key={componentId}
                componentId={Number.parseInt(componentId)}
                component={component as Component}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

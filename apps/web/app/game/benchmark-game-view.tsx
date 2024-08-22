import type { Sprite } from "@scatter/engine/2d/sprite";
import type { Transform } from "@scatter/engine/2d/transform";
import {
  read,
  write,
} from "@scatter/engine/ecs/component/component-access-descriptor";
import { useRef } from "react";
import { useEngine } from "./use-engine";

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

    engine.world.addSystem("init", (context) => {
      for (let i = 0; i < 6000; i++) {
        const scale = Math.random() * 0.5 + 0.4;
        const transform: Transform = {
          position: {
            x: Math.random() * context.stageWidth,
            y: Math.random() * context.stageHeight,
          },
          rotation: 0,
          scale: {
            x: scale,
            y: scale,
          },
        };
        const sprite: Sprite = {
          width: 1,
          height: 1,
          textureInfo: textures[(Math.random() * 3) | 0],
        };
        context.spawn("Entity", [
          [TransformId, transform],
          [SpriteId, sprite],
          [
            2,
            {
              dx: Math.random() > 0.5 ? -1 : 1,
              dy: Math.random() > 0.5 ? -1 : 1,
            },
          ],
        ]);
      }
    });

    // test for dxdy
    const DxDyId = engine.world.registerComponent("@my/DxDy");

    engine.world.addSystem("update", (context) => {
      const deltaTime = context.deltaTime;
      const speed = 120;

      context.each(
        [write(TransformId), read(SpriteId), write(DxDyId)],
        (_, [rawTransform, rawSprite, rawDxDy]) => {
          const transform = rawTransform as unknown as Transform;
          const sprite = rawSprite as unknown as Sprite;
          const dxdy = rawDxDy as unknown as { dx: number; dy: number };
          const position = transform.position;
          position.x += speed * dxdy.dx * deltaTime;
          position.y += speed * dxdy.dy * deltaTime;

          if (position.x < 0) {
            dxdy.dx = 1;
          }
          if (
            position.x + sprite.textureInfo.width * transform.scale.x >
            context.stageWidth
          ) {
            dxdy.dx = -1;
          }
          if (position.y < 0) {
            dxdy.dy = 1;
          }
          if (
            position.y + sprite.textureInfo.height * transform.scale.y >
            context.stageHeight
          ) {
            dxdy.dy = -1;
          }
        },
      );
    });
  });

  return (
    <canvas ref={canvasRef} className="flex-1 min-w-0">
      No canvas support.
    </canvas>
  );
}

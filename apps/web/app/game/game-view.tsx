import type { Sprite } from "@scatter/engine/2d/sprite";
import type { Transform } from "@scatter/engine/2d/transform";
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

    engine.world.addSystem("init", (context) => {
      for (let i = 0; i < 3000; i++) {
        const scale = Math.random() * 0.5 + 0.4;

        // TODO: implement proper id management system or better component design
        const TransformId = 0;
        const SpriteId = 1;
        const transform: Transform = {
          position: {
            x: Math.random() * 500,
            y: Math.random() * 300,
          },
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
        context.spawn([
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          [TransformId, transform] as any,
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          [SpriteId, sprite] as any,
        ]);
      }
    });
  });

  return (
    <canvas ref={canvasRef} className="flex-1">
      No canvas support.
    </canvas>
  );
}

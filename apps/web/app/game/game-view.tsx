import { useRef } from "react";
import { useEngine } from "./use-engine";

export function GameView() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEngine(canvasRef);

  return (
    <canvas ref={canvasRef} className="flex-1">
      No canvas support.
    </canvas>
  );
}

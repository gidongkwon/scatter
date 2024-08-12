import { type RefObject, useEffect, useRef } from "react";
import { Engine } from "@scatter/engine";

export function useEngine(canvasRef: RefObject<HTMLCanvasElement>) {
  const rafIdRef = useRef(0);
  useEffect(() => {
    if (canvasRef.current == null) {
      return;
    }

    const engine = new Engine(canvasRef.current);
    rafIdRef.current = requestAnimationFrame(engine.step);

    return () => {
      cancelAnimationFrame(rafIdRef.current);
    };
  }, [canvasRef.current]);
}

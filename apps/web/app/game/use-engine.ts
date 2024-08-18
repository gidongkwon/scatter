import { Engine } from "@scatter/engine";
import { type RefObject, useEffect, useRef, useState } from "react";

export function useEngine(
  canvasRef: RefObject<HTMLCanvasElement>,
  onInit: (engine: Engine) => void,
) {
  const rafIdRef = useRef(0);
  const [engine, setEngine] = useState<Engine | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: onInit 갱신이 필요해지면 풀기
  useEffect(() => {
    if (canvasRef.current == null) {
      return;
    }

    const engine = new Engine(canvasRef.current);
    onInit(engine);
    rafIdRef.current = engine.run();
    setEngine(engine);

    return () => {
      engine.cleanup();
      cancelAnimationFrame(rafIdRef.current);
    };
  }, [canvasRef.current]);

  return engine;
}

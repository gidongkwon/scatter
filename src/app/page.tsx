import { useEffect, useRef } from "react";
import styles from "./page.module.css";
import { Engine } from "@/engine/engine";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current == null) {
      return;
    }

    const engine = new Engine(canvasRef.current);
  }, [canvasRef]);

  return (
    <main className={styles.main}>
      <canvas ref={canvasRef}>
        No canvas support.
      </canvas>
    </main>
  );
}

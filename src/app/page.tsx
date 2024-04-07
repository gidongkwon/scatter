'use client';

import { useEffect, useRef } from "react";
import styles from "./page.module.css";
import { Scatter } from "@/engine/scatter";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current == null) {
      return;
    }

    const scatter = new Scatter(canvasRef.current);
  }, [canvasRef]);

  return (
    <main className={styles.main}>
      <canvas ref={canvasRef}>
        No canvas support.
      </canvas>
    </main>
  );
}

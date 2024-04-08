'use client';

import { useEffect, useRef } from "react";
import styles from "./page.module.css";
import { Scatter } from "@/engine/scatter";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fpsRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (canvasRef.current == null || fpsRef.current == null) {
      return;
    }

    const scatter = new Scatter(canvasRef.current, fpsRef.current);
  }, [canvasRef]);

  return (
    <main className={styles.main}>
      <span ref={fpsRef} className={styles.fps}></span>
      <canvas ref={canvasRef}>
        No canvas support.
      </canvas>
    </main>
  );
}

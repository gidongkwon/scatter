'use client';

import { useEffect, useRef } from "react";
import styles from "./page.module.css";
import { Scatter } from "@/engine/scatter";
import { Editor, Monaco } from "@monaco-editor/react";
import * as World from '../engine/ecs/World.gen';

const defaultScript = `const deltaTime = world.dt;
const speed = 120;

for (const sprite of world.sprites) {
  sprite.x += speed * sprite.dx * deltaTime;
  sprite.y += speed * sprite.dy * deltaTime;

  if (sprite.x < 0) {
    sprite.dx = 1
  }
  if (sprite.x + sprite.textureInfo.width * sprite.scaleX > world.gl.canvas.width) {
    sprite.dx = -1;
  }
  if (sprite.y < 0) {
    sprite.dy = 1;
  }
  if (sprite.y + sprite.textureInfo.height * sprite.scaleY > world.gl.canvas.height) {
    sprite.dy = -1;
  }
}`;

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fpsRef = useRef<HTMLSpanElement>(null);
  const editorRef = useRef<any>(null);
  const engineRef = useRef<Scatter | null>(null);
  const scriptRef = useRef<Function | null>(null);

  useEffect(() => {
    if (canvasRef.current == null || fpsRef.current == null) {
      return;
    }

    engineRef.current = new Scatter(canvasRef.current, fpsRef.current);
    handleEditorChange(defaultScript)
  }, [canvasRef]);

  function handleEditorDidMount(editor: any, monaco: Monaco) {
    editorRef.current = editor;
    // monaco.languages.typescript.javascriptDefaults.addExtraLib()
  }

  function handleEditorChange(value: string | undefined) {
    if (value != undefined && engineRef.current?.world != undefined) {
      World.removeSystem(engineRef.current.world, "Update", scriptRef.current as any);
      scriptRef.current = new Function('world', value);
      World.registerSystem(engineRef.current.world, "Update", scriptRef.current as any);
    }
  }

  return (
    <main className={styles.main}>
      <span ref={fpsRef} className={styles.fps}></span>
      <canvas ref={canvasRef} className={styles.canvas}>
        No canvas support.
      </canvas>
      <aside className={styles.sidebar}>
        <Editor
          language="javascript"
          defaultValue={defaultScript}
          onMount={handleEditorDidMount}
          onChange={handleEditorChange}
        />
      </aside>
    </main>
  );
}

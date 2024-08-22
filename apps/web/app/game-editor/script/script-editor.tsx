import { Editor, type Monaco, type OnMount } from "@monaco-editor/react";
import type { Script } from "@scatter/engine/script/script";
import { useRef } from "react";

interface Props {
  script: Script | undefined;
  onChange: (script: string | undefined) => void;
}

export function ScriptEditor({ script, onChange }: Props) {
  type CodeEditor = Parameters<OnMount>[0];
  const editorRef = useRef<CodeEditor | null>(null);

  function handleEditorDidMount(editor: CodeEditor, monaco: Monaco) {
    editorRef.current = editor;
    // test
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      `
      declare const context: {
        each: Function;
        keyboard: {
          isPressed: (code: string) => boolean
        };
        deltaTime: number;
      };
      declare const read: Function;
      declare const write: Function;
      `,
      "test.d.ts",
    );
  }

  return (
    <Editor
      theme="vs-dark"
      height="400px"
      language="typescript"
      defaultValue={script?.content}
      onMount={handleEditorDidMount}
      onChange={onChange}
    />
  );
}

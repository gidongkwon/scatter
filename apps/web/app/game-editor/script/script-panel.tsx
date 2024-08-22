import type { Engine } from "@scatter/engine";
import type { Script } from "@scatter/engine/script/script";
import type { ScriptData } from "@scatter/engine/signal/engine-signals";
import { useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { cn } from "~/lib/utils";
import { Panel } from "~/panels/panel";
import { ScriptEditor } from "./script-editor";

interface Props {
  engine: Engine | null;
  className?: string;
}

export function ScriptPanel({ engine, className }: Props) {
  const [selectedScriptName, setSelectedScriptName] = useState<string | null>(
    null,
  );
  const [scripts, setScripts] = useState<Script[]>([]);

  useEffect(() => {
    if (engine == null) {
      return;
    }
    setScripts([]);

    engine.signals.scriptAdded.register(handleScriptAdded);
    engine.signals.scriptRemoved.register(handleScriptRemoved);
    engine.signals.scriptUpdated.register(handleScriptUpdated);

    // for test
    if (!engine.scripts.has("test")) {
      engine.scripts.add(
        "test",
        "update",
        `context.each([write(0), read(1), read(3)], (_, [transform]) => {
  const speed = 300;
  if (context.keyboard.isPressed("ArrowLeft")) {
    transform.position.x -= speed * context.deltaTime;
  }
  if (context.keyboard.isPressed("ArrowRight")) {
    transform.position.x += speed * context.deltaTime;
  }
  if (context.keyboard.isPressed("ArrowUp")) {
    transform.position.y -= speed * context.deltaTime;
  }
  if (context.keyboard.isPressed("ArrowDown")) {
    transform.position.y += speed * context.deltaTime;
  }
});`,
        () => {},
      );
    }

    return () => {
      engine.signals.scriptAdded.unregister(handleScriptAdded);
      engine.signals.scriptRemoved.unregister(handleScriptRemoved);
      engine.signals.scriptUpdated.unregister(handleScriptUpdated);
    };
    function handleScriptAdded({ script }: ScriptData) {
      setScripts((before) => [...before, script]);
    }
    function handleScriptRemoved({ script }: ScriptData) {
      setScripts((before) => before.filter((s) => s.name !== script.name));
    }
    function handleScriptUpdated({ script }: ScriptData) {
      setScripts((before) => {
        const index = before.findIndex((s) => s.name === script.name);
        if (index > -1) {
          before[index].content = script.content;
          return [...before];
        }
        return before;
      });
    }
  }, [engine]);

  return (
    <Collapsible asChild>
      <Panel.Container className={cn("flex-col justify-start", className)}>
        <CollapsibleTrigger>Script</CollapsibleTrigger>
        <CollapsibleContent className="w-full flex gap-2 data-[state=open]:mt-2">
          <ScriptList
            scripts={scripts}
            onSelect={(name) => {
              setSelectedScriptName(name);
            }}
          />
          {selectedScriptName == null ? (
            <div className="h-[400px]">
              목록에서 스크립트를 선택하거나, 새로 작성하세요.
            </div>
          ) : (
            <ScriptEditor
              script={scripts.find((v) => v.name === selectedScriptName)}
              onChange={(editingScriptContent) => {
                if (editingScriptContent == null) {
                  return;
                }
                engine?.scripts.update(
                  "test",
                  editingScriptContent,
                  (error) => {
                    if (error instanceof SyntaxError) {
                      console.error(error);
                    }
                  },
                );
              }}
            />
          )}
        </CollapsibleContent>
      </Panel.Container>
    </Collapsible>
  );
}

interface ScriptListProps {
  scripts: Script[];
  onSelect: (name: string) => void;
}

function ScriptList({ scripts, onSelect }: ScriptListProps) {
  return (
    <ul className="w-[200px]">
      {scripts.map((script) => {
        return (
          <li key={script.name}>
            <button type="button" onClick={() => onSelect(script.name)}>
              {script.name}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

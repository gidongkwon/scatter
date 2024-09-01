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
import { Panel } from "~/components/panel";
import { ComponentList } from "./component-list";
import { ScriptEditor } from "./script-editor";
import { systemPhases } from "@scatter/engine/ecs/system/system";

interface Props {
  engine: Engine | null;
  className?: string;
}

export function ScriptPanel({ engine, className }: Props) {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [selectedScriptName, setSelectedScriptName] = useState<string | null>(
    null,
  );
  const selectedScript = scripts.find((v) => v.name === selectedScriptName);

  useEffect(() => {
    if (engine == null) {
      return;
    }
    setScripts(engine.scripts.all());

    engine.signals.scriptAdded.register(handleScriptAdded);
    engine.signals.scriptRemoved.register(handleScriptRemoved);
    engine.signals.scriptUpdated.register(handleScriptUpdated);

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
      <Panel.Container className={cn("flex-col justify-start p-0", className)}>
        <CollapsibleTrigger className="p-3 w-full text-left">
          스크립트
        </CollapsibleTrigger>
        <CollapsibleContent className="w-full flex flex-row gap-3 data-[state=open]:pb-3 data-[state=open]:px-3">
          <ComponentList
            className="flex-1"
            componentNames={
              engine?.world.components.all().map(([id, name]) => name) ?? []
            }
          />
          <section className="flex flex-[3] gap-3">
            <ScriptList
              scripts={scripts}
              selectedScriptName={selectedScriptName}
              onSelect={(name) => {
                setSelectedScriptName(name);
              }}
            />
            {selectedScript == null ? (
              <div className="h-[400px]">
                목록에서 스크립트를 선택하거나, 새로 작성하세요.
              </div>
            ) : (
              <ScriptEditor
                script={selectedScript}
                onChange={(editingScriptContent) => {
                  if (editingScriptContent == null) {
                    return;
                  }
                  engine?.scripts.update(
                    selectedScript.name,
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
          </section>
        </CollapsibleContent>
      </Panel.Container>
    </Collapsible>
  );
}

interface ScriptListProps {
  scripts: Script[];
  selectedScriptName: string | null;
  onSelect: (name: string) => void;
}

function ScriptList({
  scripts,
  selectedScriptName,
  onSelect,
}: ScriptListProps) {
  return (
    <div className="flex flex-col gap-3">
      {systemPhases.map((phase) => {
        const phaseScripts = scripts.filter((s) => s.phase === phase);
        return (
          <section key={phase}>
            <h3 className="text-xs font-bold bg-green-6 text-green-12 px-2 py-1 rounded-md w-fit">
              {phase.toUpperCase()}
            </h3>
            <ul className="w-[200px] mt-1 flex flex-col gap-1">
              {phaseScripts.map((script) => {
                return (
                  <li
                    key={script.name}
                    className={cn("px-2 py-1 rounded-md hover:bg-slate-2", {
                      "bg-slate-3 hover:bg-slate-4":
                        selectedScriptName === script.name,
                    })}
                  >
                    <button type="button" onClick={() => onSelect(script.name)}>
                      {script.name}
                    </button>
                  </li>
                );
              })}
            </ul>
            <button
              type="button"
              className="px-2 py-1 mt-1 w-full rounded-md hover:bg-slate-2 text-center border-2 border-slate-5 border-dashed"
            >
              + 스크립트 만들기
            </button>
          </section>
        );
      })}
    </div>
  );
}

import type { Entity } from "@scatter/engine/ecs/entity/entity";
import { useState } from "react";
import { Virtuoso } from "react-virtuoso";
import { cn } from "~/lib/utils";
import { Panel } from "../panel";
import { Engine } from "@scatter/engine";

interface Props {
  engine: Engine | null;
  entities: Entity[];
  onSelectionChange: (entities: Entity[]) => void;
}

export function ScenePanel({ entities, engine, onSelectionChange }: Props) {
  const [selectedEntities, setSelectedEntities] = useState<Entity[]>([]);

  const handleSelection = (entity: Entity) => {
    onSelectionChange([entity]);
    setSelectedEntities([entity]);
  };
  return (
    <Panel.Container className="flex-col gap-3 flex-1 min-h-0 p-4">
      {engine != null && (
        <Virtuoso
          className="h-full overflow-auto -mx-4"
          totalCount={entities.length}
          itemContent={(index) => {
            const entity = entities[index];
            const entityName =
              engine.world.entities.entityToName.get(entity) ?? "Unnamed";
            const isSelected = selectedEntities.indexOf(entity) > -1;
            return (
              <div
                key={entity}
                className={cn("flex gap-2 px-3 py-1 text-xs hover:bg-slate-3", {
                  "bg-iris-6": isSelected,
                  "hover:bg-iris-7": isSelected,
                })}
                onClick={() => handleSelection(entity)}
              >
                <span>{entityName}</span>
                <span className="text-slate-11">{entity}</span>
              </div>
            );
          }}
        />
      )}
    </Panel.Container>
  );
}

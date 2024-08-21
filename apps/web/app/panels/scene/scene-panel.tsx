import type { Entity } from "@scatter/engine/ecs/entity/entity";
import { useState } from "react";
import { Virtuoso } from "react-virtuoso";
import { cn } from "~/lib/utils";
import { Panel } from "../panel";

interface Props {
  entities: Entity[];
  onSelectionChange: (entities: Entity[]) => void;
}

export function ScenePanel({ entities, onSelectionChange }: Props) {
  const [selectedEntities, setSelectedEntities] = useState<Entity[]>([]);

  const handleSelection = (entity: Entity) => {
    console.log(entity);
    onSelectionChange([entity]);
    setSelectedEntities([entity]);
  };
  return (
    <Panel.Container className="flex-col gap-3 flex-1 min-h-0 p-3">
      <Virtuoso
        className="h-full overflow-auto -mx-3"
        totalCount={entities.length}
        itemContent={(index) => {
          const entity = entities[index];
          const isSelected = selectedEntities.indexOf(entity) > -1;
          return (
            <div
              key={entity}
              className={cn("px-3 py-1 text-xs hover:bg-slate-3", {
                "bg-iris-6": isSelected,
                "hover:bg-iris-7": isSelected,
              })}
              onClick={() => handleSelection(entity)}
            >
              {entity}
            </div>
          );
        }}
      />
    </Panel.Container>
  );
}

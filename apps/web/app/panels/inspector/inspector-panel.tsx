import type { Entity } from "@scatter/engine/ecs/entity/entity";
import { Panel } from "../panel";
import { ComponentView } from "./component-view";
import type { Component } from "@scatter/engine/ecs/component/component";

interface Props {
  entity: Entity | null;
  components: Record<number, Component>;
}

export function InspectorPanel({ entity, components }: Props) {
  return (
    <Panel.Container className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
      <ul className="flex flex-col gap-1">
        {Object.entries(components).map(([componentId, component]) => {
          return (
            <ComponentView
              key={`${entity}-${componentId}`}
              componentId={Number.parseInt(componentId)}
              component={component as Component}
            />
          );
        })}
      </ul>
    </Panel.Container>
  );
}

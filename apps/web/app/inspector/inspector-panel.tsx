import type { Engine } from "@scatter/engine";
import type { Component } from "@scatter/engine/ecs/component/component";
import type { Entity } from "@scatter/engine/ecs/entity/entity";
import { Panel } from "~/components/panel";
import { ComponentView } from "./component-view";

interface Props {
  engine: Engine | null;
  entity: Entity | null;
  components: Record<number, Component>;
}

export function InspectorPanel({ engine, entity, components }: Props) {
  return (
    <Panel.Container className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
      {engine != null && (
        <ul className="flex flex-col gap-1">
          {Object.entries(components).map(([componentIdString, component]) => {
            const componentId = Number.parseInt(componentIdString);
            const componentName = engine.world.getComponentName(componentId);
            return (
              <ComponentView
                key={`${entity}-${componentId}`}
                componentId={componentId}
                componentName={componentName}
                component={component as Component}
              />
            );
          })}
        </ul>
      )}
    </Panel.Container>
  );
}

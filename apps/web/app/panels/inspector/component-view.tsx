import type {
  Component,
  ComponentId,
} from "@scatter/engine/ecs/component/component";
import { Row } from "./row/row";
import { Vec2Row } from "./row/vec2-row";

interface Props {
  componentId: ComponentId;
  componentName: string;
  component: Component;
}

export function ComponentView({
  componentId,
  componentName,
  component,
}: Props) {
  return (
    <li className="p-3 bg-slate-2 rounded-md">
      <h3 className="font-bold leading-0 mb-2">
        {componentName.split("/").at(-1)}
      </h3>
      <ul>
        {(() => {
          if (component == null) {
            return null;
          }
          if (typeof component === "object") {
            return Object.entries(component).map(([key, value]) => {
              // TODO: implement component view registry
              if (key === "position") {
                return (
                  <Vec2Row
                    key={key}
                    propertyName={key}
                    x={value.x}
                    y={value.y}
                  />
                );
              }
              return (
                <Row key={key} propertyName={key}>
                  <pre className="break-all">
                    {JSON.stringify(value, undefined, 2)}
                  </pre>
                </Row>
              );
            });
          }
        })()}
      </ul>
    </li>
  );
}

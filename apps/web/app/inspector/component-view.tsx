import type {
  Component,
  ComponentId,
} from "@scatter/engine/ecs/component/component";
import { Row } from "./row/row";
import { Vec2Row } from "./row/vec2-row";

interface Props {
  componentId: ComponentId;
  component: Component;
}

export function ComponentView({ componentId, component }: Props) {
  return (
    <div className="border-b-gray-200 border-b-2 p-3">
      <h3 className="font-bold">{componentId}</h3>
      <ul>
        {(() => {
          if (component == null) {
            return null;
          }
          if (typeof component === "object") {
            return Object.entries(component).map(([key, value]) => {
              // TODO: implement component view registry
              if (key === "position") {
                return <Vec2Row key={key} propertyName={key} vec2={value} />;
              }
              return (
                <Row key={key} propertyName={key}>
                  {JSON.stringify(value)}
                </Row>
              );
            });
          }
        })()}
      </ul>
    </div>
  );
}

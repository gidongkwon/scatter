import type {
  Component,
  ComponentId,
} from "@scatter/engine/ecs/component/component";
import { Row } from "./row/row";
import { Vec2Row } from "./row/vec2-row";
import { FloatInput } from "./input/float-input";
import { toDegree } from "@scatter/engine/math/math";
import { TimerInput } from "./input/timer-input";

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
      <h3 className="leading-0 mb-2 text-xs">
        {componentName.split("/").at(-1)}
      </h3>
      <ul className="flex flex-col gap-1">
        {(() => {
          if (component == null) {
            return null;
          }
          if (typeof component === "object") {
            return Object.entries(component).map(([key, value]) => {
              // TODO: implement component view registry
              if (key === "position" || key === "offset" || key === "scale") {
                return (
                  <Vec2Row
                    key={key}
                    propertyName={key}
                    x={value.x}
                    y={value.y}
                  />
                );
              }
              if (key === "delayTimer") {
                return (
                  <Row key={key} propertyName={key}>
                    <TimerInput timer={value} />
                  </Row>
                );
              }
              if (key === "rotation") {
                return (
                  <Row key={key} propertyName={key}>
                    <FloatInput value={toDegree(value)} />
                  </Row>
                );
              }
              if (key === "score" || key === "width" || key === "height") {
                return (
                  <Row key={key} propertyName={key}>
                    <FloatInput value={value} />
                  </Row>
                );
              }
              return (
                <Row key={key} propertyName={key}>
                  <pre className="break-all text-sm">
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

import { FloatInput } from "../input/float-input";
import { Row } from "./row";

interface Props {
  propertyName: string;
  vec2: {
    x: number;
    y: number;
  };
}

export function Vec2Row({ propertyName, vec2 }: Props) {
  return (
    <Row propertyName={propertyName}>
      <div className="flex gap-2">
        <FloatInput
          className="flex-1"
          displayName={<span className="text-axis-x">X</span>}
          value={vec2.x}
        />
        <FloatInput
          className="flex-1"
          displayName={<span className="text-axis-y">Y</span>}
          value={vec2.y}
        />
      </div>
    </Row>
  );
}

import { FloatInput } from "../input/float-input";
import { Row } from "./row";

interface Props {
  propertyName: string;
  x: number;
  y: number;
}

export function Vec2Row({ propertyName, x, y }: Props) {
  return (
    <Row propertyName={propertyName}>
      <div className="flex gap-1">
        <FloatInput
          className="flex-1"
          displayName={<span className="text-axis-x">X</span>}
          value={x}
        />
        <FloatInput
          className="flex-1"
          displayName={<span className="text-axis-y">Y</span>}
          value={y}
        />
      </div>
    </Row>
  );
}

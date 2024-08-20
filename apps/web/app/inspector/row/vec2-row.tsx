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
      <Row propertyName="x">{vec2.x.toFixed(3)}</Row>
      <Row propertyName="y">{vec2.y.toFixed(3)}</Row>
    </Row>
  );
}

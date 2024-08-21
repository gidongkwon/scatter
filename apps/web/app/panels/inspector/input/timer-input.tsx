import type { Timer } from "@scatter/engine/timer/timer";
import { FloatInput } from "./float-input";
import { cn } from "~/lib/utils";
import { BooleanInput } from "./boolean-input";
import { Row } from "../row/row";

interface Props {
  timer: Timer;
}

export function TimerInput({ timer }: Props) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-1">
        <Row propertyName="elapsed" vertical>
          <FloatInput value={timer.elapsed} />
        </Row>
        <Row propertyName="duration" vertical>
          <FloatInput value={timer.duration} />
        </Row>
      </div>
      <Meter
        className="flex-2 basis-3"
        current={timer.elapsed}
        max={timer.duration}
      />
      <Row propertyName="finished" growName>
        <BooleanInput value={timer.finished} />
      </Row>
      <Row propertyName="segmentFinished" growName>
        <BooleanInput value={timer.segmentFinished} />
      </Row>
      <Row propertyName="type" growName>
        <pre>{timer.options.type}</pre>
      </Row>
    </div>
  );
}

function Meter({
  current,
  max,
  className,
}: { current: number; max: number; className?: string }) {
  return (
    <div className={cn("rounded-full relative overflow-clip", className)}>
      <div className="absolute w-full h-full bg-slate-4" />
      <div
        className="absolute bg-plum-9 h-full"
        style={{ width: `${((current / max) * 100).toFixed(1)}%` }}
      />
    </div>
  );
}

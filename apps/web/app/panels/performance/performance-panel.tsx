import { trimTrailingZero } from "~/lib/utils";
import { Panel } from "../panel";

interface Props {
  averageFPS: number;
  aliveEntityCount: number;
}

export function PerformancePanel({ averageFPS, aliveEntityCount }: Props) {
  return (
    <Panel.Container className="flex gap-3">
      <div className="flex gap-2">
        <span className="text-slate-11">FPS</span>
        <span className="w-[5ch]">{trimTrailingZero(averageFPS, 2)}</span>
      </div>
      <div className="flex gap-2">
        <span className="text-slate-11">Entities</span>
        {aliveEntityCount}
      </div>
    </Panel.Container>
  );
}

import type { System, SystemPhase } from "../ecs/system/system";

export interface Script {
  name: string;
  phase: SystemPhase;
  content: string;
  system: System;
}

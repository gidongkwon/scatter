import type {
  read as makeRead,
  write as makeWrite,
} from "../component/component-access-descriptor";
import type { SystemContext } from "./system-context";

export type SystemCleanup = () => void;

export const systemPhases = ["init", "render", "update"] as const;
export type SystemPhase = (typeof systemPhases)[number];
export type System = (
  context: SystemContext,
  // functions/data for scripts
  read: typeof makeRead,
  write: typeof makeWrite,
  // biome-ignore lint/suspicious/noConfusingVoidType: void
) => SystemCleanup | void;

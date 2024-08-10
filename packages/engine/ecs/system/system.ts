import type { SystemContext } from "./system-context";

export type SystemPhase = "render" | "update";
export type System = (context: SystemContext) => void;

import type { SystemContext } from "./system-context";

export type SystemPhase = "init" | "render" | "update";
export type System = (context: SystemContext) => void;

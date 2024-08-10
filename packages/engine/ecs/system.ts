import type { World } from "./world";

export type System = (world: World) => void;

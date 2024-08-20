import type { ComponentId } from "./component";

export interface ComponentAccessDescriptor {
  type: "read" | "write";
  componentId: ComponentId;
}

export function read(componentId: ComponentId): ComponentAccessDescriptor {
  return {
    type: "read",
    componentId,
  };
}

export function write(componentId: ComponentId): ComponentAccessDescriptor {
  return {
    type: "write",
    componentId,
  };
}

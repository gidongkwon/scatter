import { assert } from "../../utils/assert";
import type { ComponentId } from "./component";
import { ComponentBag } from "./component-bag";

export class ComponentRegistry {
  #nextComponentId = 0;
  #idToBags: Map<ComponentId, ComponentBag> = new Map();

  register: () => ComponentId = () => {
    const id = this.#nextComponentId;
    this.#idToBags.set(id, new ComponentBag(id));
    this.#nextComponentId = id + 1;
    assert(this.#nextComponentId < Number.MAX_SAFE_INTEGER);
    return id;
  };

  has = (componentId: ComponentId) => {
    return this.#idToBags.has(componentId);
  };
}

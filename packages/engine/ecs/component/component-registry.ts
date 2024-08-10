import { assert } from "../../utils/assert";
import type { Entity } from "../entity/entity";
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

  get = (componetId: ComponentId) => {
    return this.#idToBags.get(componetId);
  };

  removeEntity = (entity: Entity) => {
    for (const [_, bag] of this.#idToBags) {
      bag.remove(entity);
    }
  };
}

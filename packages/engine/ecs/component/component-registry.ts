import { assert } from "../../utils/assert";
import type { Entity } from "../entity/entity";
import type { Component, ComponentId } from "./component";
import { ComponentBag } from "./component-bag";

export class ComponentRegistry {
  #nextComponentId = 0;
  #idToBags: Map<ComponentId, ComponentBag> = new Map();
  #idToName: Map<ComponentId, string> = new Map();

  register: (namespacedName: string) => ComponentId = (
    namespacedName: string,
  ) => {
    assert(namespacedName.startsWith("@") && namespacedName.includes("/"));
    const id = this.#nextComponentId;
    this.#idToBags.set(id, new ComponentBag(id));
    this.#idToName.set(id, namespacedName);
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

  getName = (componentId: ComponentId) => {
    return this.#idToName.get(componentId) ?? "ERROR";
  };

  all() {
    return [...this.#idToName.entries()];
  }

  getAllFor = (entity: Entity) => {
    const result = [];
    for (const [_, bag] of this.#idToBags) {
      if (!bag.has(entity)) continue;
      result.push(bag.get(entity));
    }
    return result;
  };

  getAllWithIdFor = (entity: Entity) => {
    const result: {
      componentId: ComponentId;
      component: Component;
    }[] = [];
    for (const [componentId, bag] of this.#idToBags) {
      if (!bag.has(entity)) continue;
      result.push({
        componentId,
        component: bag.get(entity),
      });
    }
    return result;
  };

  removeEntity = (entity: Entity) => {
    for (const [_, bag] of this.#idToBags) {
      bag.remove(entity);
    }
  };
}

import { assert } from "../../utils/assert";
import { swap } from "../../utils/swap";
import type { Entity } from "../entity/entity";
import type { Component } from "./component";

export class ComponentBag {
  sparseEntityIndicies: (number | undefined)[] = [];
  denseEntities: Entity[] = [];
  denseComponents: Component[] = [];

  constructor(public componentId: number) {}

  add = (entity: Entity, component: Component) => {
    if (this.has(entity)) {
      console.error("같은 종류의 컴포넌트를 두 번 등록할 수 없습니다.");
      return;
    }

    const entitiesLength = this.denseEntities.push(entity);
    const componentsLength = this.denseComponents.push(component);

    assert(entitiesLength === componentsLength);

    this.sparseEntityIndicies[entity] = entitiesLength - 1;
  };

  has = (entity: Entity) => {
    return this.sparseEntityIndicies[entity] !== undefined;
  };

  remove = (entity: Entity) => {
    if (!this.has(entity)) {
      return;
    }
    // biome-ignore lint/style/noNonNullAssertion: checked by has()
    const index = this.sparseEntityIndicies[entity]!;
    const lastIndex = this.denseComponents.length - 1;
    const swapTargetEntity = this.denseEntities[lastIndex];
    swap(this.denseEntities, index, lastIndex);
    swap(this.denseComponents, index, lastIndex);
    this.denseComponents.length -= 1;
    this.denseEntities.length -= 1;
    this.sparseEntityIndicies[entity] = undefined;
    if (swapTargetEntity !== undefined) {
      this.sparseEntityIndicies[swapTargetEntity] = index;
    }
  };

  get = (entity: Entity) => {
    if (!this.has(entity)) {
      return null;
    }
    // biome-ignore lint/style/noNonNullAssertion: checked by has()
    return this.denseComponents[this.sparseEntityIndicies[entity]!];
  };

  get length() {
    return this.denseComponents.length;
  }
}

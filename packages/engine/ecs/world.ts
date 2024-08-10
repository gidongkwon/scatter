import { assert } from "../utils/assert";
import type { Component, ComponentId } from "./component/component";
import { ComponentRegistry } from "./component/component-registry";
import type { Entity } from "./entity/entity";
import { EntityRegistry } from "./entity/entity-registry";
import type { System } from "./system/system";

export class World {
  components: ComponentRegistry = new ComponentRegistry();
  entities: EntityRegistry = new EntityRegistry();
  systems: System[];

  addEntity = () => {
    const entityId = this.entities.create();
    return entityId;
  };

  removeEntity = (entity: Entity) => {
    this.components.removeEntity(entity);
  };

  registerComponent = () => {
    return this.components.register();
  };

  addComponent = (
    entity: Entity,
    componentId: ComponentId,
    component: Component,
  ) => {
    assert(this.components.has(componentId));
    this.components.get(componentId)?.add(entity, component);
  };

  removeComponent = (entity: Entity, componentId: ComponentId) => {
    this.components.get(componentId)?.remove(entity);
  };

  hasComponent = (entity: Entity, componentId: ComponentId) => {
    return this.components.get(componentId)?.has(entity);
  };
}

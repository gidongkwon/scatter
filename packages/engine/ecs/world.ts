import { assert } from "../utils/assert";
import type { Component, ComponentId } from "./component/component";
import { ComponentRegistry } from "./component/component-registry";
import type { Entity } from "./entity/entity";
import { EntityRegistry } from "./entity/entity-registry";
import type { System, SystemPhase } from "./system/system";
import { SystemContext } from "./system/system-context";

export class World {
  components: ComponentRegistry = new ComponentRegistry();
  entities: EntityRegistry = new EntityRegistry();
  systems: Map<SystemPhase, System[]> = new Map();
  context: SystemContext = new SystemContext(this);

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

  addSystem = (phase: SystemPhase, system: System) => {
    const existing = this.systems.get(phase) ?? [];
    this.systems.set(phase, [...existing, system]);
  };

  hasSystem = (phase: SystemPhase, system: System) => {
    return (this.systems.get(phase)?.indexOf(system) ?? -1) !== -1;
  };

  removeSystem = (phase: SystemPhase, system: System) => {
    const systems = this.systems.get(phase);
    if (systems == null) return;

    const index = systems.indexOf(system);
    if (index === -1) return;

    systems.splice(index);
  };

  update = (deltaTime: number) => {
    this.context.update(deltaTime);

    const systems = this.systems.get("update");
    if (systems != null) {
      for (const system of systems) {
        system(this.context);
      }
    }
  };
}

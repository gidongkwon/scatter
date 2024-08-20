import { assert } from "../utils/assert";
import type { Component, ComponentId } from "./component/component";
import { ComponentRegistry } from "./component/component-registry";
import type { Entity } from "./entity/entity";
import { EntityRegistry } from "./entity/entity-registry";
import type {
  System,
  SystemCleanup,
  SystemPhase,
  SystemWithEffect,
} from "./system/system";
import { SystemContext } from "./system/system-context";
import type { EventName, ScatterEvent } from "./event/event";
import type { Engine } from "../engine";

export class World {
  components: ComponentRegistry = new ComponentRegistry();
  entities: EntityRegistry = new EntityRegistry();
  systems: Map<SystemPhase, (System | SystemWithEffect)[]> = new Map();
  eventQueues: Map<EventName, ScatterEvent[]> = new Map();
  cleanups: SystemCleanup[] = [];
  context: SystemContext;

  constructor(private engine: Engine) {
    this.context = new SystemContext(this, this.engine);
  }

  addEntity = () => {
    const entityId = this.entities.create();
    return entityId;
  };

  removeEntity = (entity: Entity) => {
    if (!this.entities.isAlive(entity)) {
      return;
    }
    this.entities.remove(entity);
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

  getComponent = (entity: Entity, componentId: ComponentId) => {
    return this.components.get(componentId)?.get(entity);
  };

  getAllComponents = (entity: Entity) => {
    return this.components.getAllFor(entity);
  };

  removeComponent = (entity: Entity, componentId: ComponentId) => {
    this.components.get(componentId)?.remove(entity);
  };

  hasComponent = (entity: Entity, componentId: ComponentId) => {
    return this.components.get(componentId)?.has(entity) ?? false;
  };

  addSystem = (phase: SystemPhase, system: System | SystemWithEffect) => {
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

  callInitSystems = () => {
    const systems = this.systems.get("init");
    if (systems != null) {
      for (const system of systems) {
        const maybeCleanup = system(this.context);
        if (typeof maybeCleanup === "function") {
          this.cleanups.push(maybeCleanup);
        }
      }
    }
  };

  registerEvent = (name: string) => {
    this.eventQueues.set(name, []);
  };

  update = (deltaTime: number) => {
    this.context._updateDeltaTime(deltaTime);

    const systems = this.systems.get("update");
    if (systems != null) {
      for (const system of systems) {
        system(this.context);
      }
    }

    // TODO: find out whether to move event stuff to engine
    this.clearEventQueues();
  };

  render = () => {
    const systems = this.systems.get("render");
    if (systems != null) {
      for (const system of systems) {
        system(this.context);
      }
    }
  };

  cleanup = () => {
    for (const cleanup of this.cleanups) {
      cleanup();
    }
  };

  private clearEventQueues() {
    for (const [_, events] of this.eventQueues) {
      events.length = 0;
    }
  }
}

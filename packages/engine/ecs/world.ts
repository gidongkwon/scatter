import type { Engine } from "../engine";
import { assert } from "../utils/assert";
import type { Component, ComponentId } from "./component/component";
import { ComponentRegistry } from "./component/component-registry";
import type { Entity } from "./entity/entity";
import { EntityRegistry } from "./entity/entity-registry";
import type { EventName, ScatterEvent } from "./event/event";
import type {
  System,
  SystemCleanup,
  SystemPhase,
  SystemWithEffect,
} from "./system/system";
import { SystemContext } from "./system/system-context";

export class World {
  components: ComponentRegistry = new ComponentRegistry();
  entities: EntityRegistry = new EntityRegistry();
  systems: Map<SystemPhase, (System | SystemWithEffect)[]> = new Map();
  eventQueues: Map<EventName, ScatterEvent[]> = new Map();
  cleanups: SystemCleanup[] = [];
  context: SystemContext;

  isInitSystemsCalled = false;

  constructor(private engine: Engine) {
    this.context = new SystemContext(this, this.engine);
  }

  addEntity = () => {
    const entity = this.entities.create();
    this.engine.signals.anyEntitySpawned.emit({ entity });
    return entity;
  };

  removeEntity = (entity: Entity) => {
    if (!this.entities.isAlive(entity)) {
      return;
    }
    // call this signal before cleanup to handle with remaining data.
    this.engine.signals.anyEntityDespawned.emit({ entity });
    this.entities.remove(entity);
    this.components.removeEntity(entity);
  };

  registerComponent = (namespacedName: string) => {
    return this.components.register(namespacedName);
  };

  addComponent = (
    entity: Entity,
    componentId: ComponentId,
    component: Component,
  ) => {
    assert(this.components.has(componentId));
    this.components.get(componentId)?.add(entity, component);
    // TODO: decide signal's container
    this.engine.signals.entityComponentChanged.tryEmit(entity, {
      entity,
      componentId,
      component,
    });
  };

  getComponent = (entity: Entity, componentId: ComponentId) => {
    return this.components.get(componentId)?.get(entity);
  };

  getComponentName = (componentId: ComponentId) => {
    return this.components.getName(componentId);
  };

  getAllComponents = (entity: Entity) => {
    return this.components.getAllFor(entity);
  };

  getAllComponentsWithIds = (entity: Entity) => {
    return this.components.getAllWithIdFor(entity);
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

    systems.splice(index, 1);
  };

  callInitSystems = () => {
    this.isInitSystemsCalled = true;
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

    if (!this.isInitSystemsCalled) {
      return;
    }

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

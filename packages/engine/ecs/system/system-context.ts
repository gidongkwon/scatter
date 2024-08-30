import type { Assets } from "../../assets";
import { Keyboard } from "../../input/keyboard";
import type { EngineSignals } from "../../signal/engine-signals";
import { assert } from "../../utils/assert";
import type { Component, ComponentId } from "../component/component";
import type { ComponentAccessDescriptor } from "../component/component-access-descriptor";
import type { Entity, EntityId } from "../entity/entity";
import type { ScatterEvent } from "../event/event";
import type { World } from "../world";

export type EachCallback = (entity: Entity, components: Component[]) => void;

/**
 * A context for system update.
 * System should not call some functions directly like addEntity/addComponent,
 * instead of passing world object, we pass this context.
 */
export class SystemContext {
  deltaTime = 0;
  stageWidth = 0;
  stageHeight = 0;
  keyboard: Keyboard = new Keyboard();
  _world: World | null = null;

  constructor(
    public assets: Assets,
    private _signals: EngineSignals,
  ) {}

  /**
   * Iterates every entity that has all component of componentIds.
   * Memory inefficient version.
   * @param componentAccessDescriptors
   * @param callback
   */
  each(
    componentAccessDescriptors: ComponentAccessDescriptor[],
    callback: EachCallback,
  ) {
    if (this._world == null) {
      return;
    }
    if (componentAccessDescriptors.length === 0) {
      return;
    }

    const componentBags = componentAccessDescriptors
      .map((descriptor) => descriptor.componentId)
      .map(this._world.components.get)
      .filter((v) => v != null);
    if (componentAccessDescriptors.length !== componentBags.length) {
      return;
    }

    const componentIds = componentAccessDescriptors.map(
      (desc) => desc.componentId,
    );

    const shortestBag = componentBags.sort((a, b) => a.length - b.length)[0];
    for (const entity of shortestBag.denseEntities) {
      let hasEveryComponent = true;
      for (const bag of componentBags) {
        hasEveryComponent &&= bag.has(entity);
      }
      if (hasEveryComponent) {
        callback(
          entity,
          componentIds.map((componentId) =>
            this._world?.components.get(componentId)?.get(entity),
          ),
        );

        // TODO: implement dirty checking?
        for (const descriptor of componentAccessDescriptors) {
          if (descriptor.type !== "write") {
            continue;
          }

          this._signals.entityComponentChanged.tryEmit(entity, {
            entity,
            componentId: descriptor.componentId,
            component: this._world.components
              .get(descriptor.componentId)
              ?.get(entity),
          });
        }
      }
    }
  }

  spawn = (name: string, components: [ComponentId, Component][]) => {
    if (this._world == null) {
      return;
    }
    const entity = this._world.addEntity(name);
    for (const idComponent of components) {
      this._world.addComponent(entity, idComponent[0], idComponent[1]);
    }
    this._signals.anyEntitySpawned.emit({ entity });
  };

  despawn = (entityId: EntityId) => {
    if (this._world == null) {
      return;
    }
    this._world.removeEntity(entityId);
  };

  createEvent = (name: string, event: ScatterEvent) => {
    if (this._world == null) {
      return;
    }
    assert(this._world.eventQueues.has(name));
    this._world.eventQueues.get(name)?.push(event);
  };

  readEvent = (name: string) => {
    return this._world?.eventQueues.get(name) ?? [];
  };

  hasComponent = (entity: Entity, componentId: ComponentId) => {
    return this._world?.hasComponent(entity, componentId) ?? false;
  };

  getComponent = (
    entity: Entity,
    componentAccessDescriptor: ComponentAccessDescriptor,
  ) => {
    // if (componentAccessDescriptor.type === "write") {
    //   // TODO: enqueue change
    // }
    return this._world?.getComponent(
      entity,
      componentAccessDescriptor.componentId,
    );
  };

  _updateDeltaTime = (deltaTime: number) => {
    this.deltaTime = deltaTime;
  };

  _updateStageSize = (width: number, height: number) => {
    this.stageWidth = width;
    this.stageHeight = height;
  };
}

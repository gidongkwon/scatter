import type { Component, ComponentId } from "../ecs/component/component";
import type { Entity } from "../ecs/entity/entity";
import type { System } from "../ecs/system/system";
import type { Script } from "../script/script";
import { Signal } from "./signal";

export type EntityComponentChangedData = {
  entity: Entity;
  componentId: ComponentId;
  component: Component;
};

export type EntityData = {
  entity: Entity;
};

export type ScriptData = {
  script: Script;
};

export type ScriptUpdatedData = {
  script: Script;
  prevSystem: System;
};

class SignalPerEntity<TData> {
  _entityToSignal: Map<Entity, Signal<TData>> = new Map();
  register = (entity: Entity, handler: (data: TData) => void) => {
    const signal = this._entityToSignal.get(entity) ?? new Signal();
    signal.register(handler);
    this._entityToSignal.set(entity, signal);
  };

  tryUnregister = (entity: Entity, handler: (data: TData) => void) => {
    const index = this._entityToSignal.get(entity)?.handlers.indexOf(handler);
    if (index != null && index > -1) {
      this._entityToSignal.get(entity)?.handlers.splice(index, 1);
    }
  };

  tryEmit = (entity: Entity, data: TData) => {
    this._entityToSignal.get(entity)?.emit(data);
  };
}

export class EngineSignals {
  entityComponentChanged = new SignalPerEntity<EntityComponentChangedData>();
  anyEntityDespawned = new Signal<EntityData>();
  anyEntitySpawned = new Signal<EntityData>();
  scriptAdded = new Signal<ScriptData>();
  scriptUpdated = new Signal<ScriptUpdatedData>();
  scriptRemoved = new Signal<ScriptData>();
}

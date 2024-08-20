import type { Component, ComponentId } from "../ecs/component/component";
import { Signal } from "./signal";
import type { Entity } from "../ecs/entity/entity";

type EntityComponentChangedData = {
  entity: Entity;
  componentId: ComponentId;
  component: Component;
};

class SignalPerEntity<TData> {
  _entityToSignal: Map<Entity, Signal<TData>> = new Map();
  register = (entity: Entity, handler: (data: TData) => void) => {
    const signal = this._entityToSignal.get(entity) ?? new Signal();
    signal.register(handler);
    this._entityToSignal.set(entity, signal);
  };

  tryEmit = (entity: Entity, data: TData) => {
    this._entityToSignal.get(entity)?.emit(data);
  };
}

export class EngineSignals {
  entityComponentChanged = new SignalPerEntity<EntityComponentChangedData>();
}

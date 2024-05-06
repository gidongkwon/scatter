/* TypeScript file generated from ECS.res by genType. */

/* eslint-disable */
/* tslint:disable */

import * as ECSJS from './ECS.res.js';

import type {ArrayCmp_identity as Component_ArrayCmp_ArrayCmp_identity} from './Component_ArrayCmp.gen.tsx';

import type {MutableMap_t as Belt_MutableMap_t} from './Belt.gen.tsx';

import type {id as Archetype_id} from './Archetype.gen.tsx';

import type {id as Component_id} from './Component.gen.tsx';

import type {phase as System_phase} from './System.gen.tsx';

import type {t as Archetype_t} from './Archetype.gen.tsx';

import type {t as Component_t} from './Component.gen.tsx';

import type {t as Entity_t} from './Entity.gen.tsx';

import type {t as Map_t} from './Map.gen.tsx';

import type {t as Set_t} from './Set.gen.tsx';

export type World_componentStorageIndex = { readonly archetype: Archetype_t; readonly index: number };

export type World_system = (_1:t) => void;

export type World_t = {
  dt: number; 
  readonly startupSystems: World_system[]; 
  readonly renderSystems: World_system[]; 
  readonly updateSystems: World_system[]; 
  readonly entityToComponentStorage: Map_t<Entity_t,World_componentStorageIndex>; 
  readonly componentIdToArchetypeSet: Map_t<Component_id,Set_t<Archetype_id>>; 
  readonly componentIdsToArchetype: Belt_MutableMap_t<Component_id[],Archetype_t,Component_ArrayCmp_ArrayCmp_identity>; 
  componentIdCounter: number; 
  entityIdCounter: number
};

export type World_componentStorageIndex = World_componentStorageIndex;

export type World_system = World_system;

export type World_t = World_t;

export const World_make: () => World_t = ECSJS.World.make as any;

export const World_startup: (_1:World_t) => void = ECSJS.World.startup as any;

export const World_update: (_1:World_t, dt:number) => void = ECSJS.World.update as any;

export const World_render: (_1:World_t) => void = ECSJS.World.render as any;

export const World_registerSystem: (_1:World_t, phase:System_phase, system:World_system) => void = ECSJS.World.registerSystem as any;

export const World_removeSystem: (_1:World_t, phase:System_phase, system:World_system) => void = ECSJS.World.removeSystem as any;

export const World_hasComponent: (_1:World_t, entity:Entity_t, componentId:Component_id) => boolean = ECSJS.World.hasComponent as any;

export const World_getComponent: (_1:World_t, entity:Entity_t, componentId:Component_id) => (undefined | Component_t) = ECSJS.World.getComponent as any;

export const World_defineComponent: (_1:World_t) => Component_id = ECSJS.World.defineComponent as any;

export const World_makeEntity: (_1:World_t) => Entity_t = ECSJS.World.makeEntity as any;

export const World_hasEntity: (_1:World_t, entity:Entity_t) => boolean = ECSJS.World.hasEntity as any;

export const World: {
  hasComponent: (_1:World_t, entity:Entity_t, componentId:Component_id) => boolean; 
  update: (_1:World_t, dt:number) => void; 
  removeSystem: (_1:World_t, phase:System_phase, system:World_system) => void; 
  getComponent: (_1:World_t, entity:Entity_t, componentId:Component_id) => (undefined | Component_t); 
  defineComponent: (_1:World_t) => Component_id; 
  hasEntity: (_1:World_t, entity:Entity_t) => boolean; 
  render: (_1:World_t) => void; 
  makeEntity: (_1:World_t) => Entity_t; 
  startup: (_1:World_t) => void; 
  registerSystem: (_1:World_t, phase:System_phase, system:World_system) => void; 
  make: () => World_t
} = ECSJS.World as any;

/* TypeScript file generated from World.resi by genType. */

/* eslint-disable */
/* tslint:disable */

import * as WorldJS from './World.res.js';

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

export type componentStorageIndex = { readonly archetype: Archetype_t; readonly index: number };

export type system = (_1:t) => void;

export type t = {
  dt: number; 
  readonly startupSystems: system[]; 
  readonly renderSystems: system[]; 
  readonly updateSystems: system[]; 
  readonly entityToComponentStorage: Map_t<Entity_t,componentStorageIndex>; 
  readonly componentIdToArchetypeSet: Map_t<Component_id,Set_t<Archetype_id>>; 
  readonly componentIdsToArchetype: Belt_MutableMap_t<Component_id[],Archetype_t,Component_ArrayCmp_ArrayCmp_identity>; 
  componentIdCounter: number; 
  entityIdCounter: number
};

export const make: () => t = WorldJS.make as any;

export const startup: (_1:t) => void = WorldJS.startup as any;

export const update: (_1:t, dt:number) => void = WorldJS.update as any;

export const render: (_1:t) => void = WorldJS.render as any;

export const registerSystem: (_1:t, phase:System_phase, system:system) => void = WorldJS.registerSystem as any;

export const removeSystem: (_1:t, phase:System_phase, system:system) => void = WorldJS.removeSystem as any;

export const hasComponent: (_1:t, entity:Entity_t, componentId:Component_id) => boolean = WorldJS.hasComponent as any;

export const getComponent: (_1:t, entity:Entity_t, componentId:Component_id) => (undefined | Component_t) = WorldJS.getComponent as any;

export const defineComponent: (_1:t) => Component_id = WorldJS.defineComponent as any;

export const makeEntity: (_1:t) => Entity_t = WorldJS.makeEntity as any;

export const hasEntity: (_1:t, entity:Entity_t) => boolean = WorldJS.hasEntity as any;

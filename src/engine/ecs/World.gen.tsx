/* TypeScript file generated from World.res by genType. */

/* eslint-disable */
/* tslint:disable */

import * as WorldJS from './World.res.js';

import type {priority as System_priority} from './System.gen.tsx';

export type system = (_1:t) => void;

export type t = {
  dt: number; 
  readonly renderSystems: system[]; 
  readonly updateSystems: system[]
};

export const make: () => t = WorldJS.make as any;

export const update: (world:t, dt:number) => void = WorldJS.update as any;

export const render: (world:t) => void = WorldJS.render as any;

export const registerSystem: (world:t, priority:System_priority, system:system) => void = WorldJS.registerSystem as any;

/* TypeScript file generated from Query.resi by genType. */

/* eslint-disable */
/* tslint:disable */

import * as QueryJS from './Query.res.js';

import type {id as Component_id} from './Component.gen.tsx';

export type t = { readonly componentIds: Component_id[] };

export const make: (componentIds:Component_id[]) => t = QueryJS.make as any;

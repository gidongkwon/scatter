// Most of the code came from https://codesandbox.io/s/beautiful-blackburn-ckzhf&file=/src/entities.ts

/**
 * Entity is combination of EntityId and EntityVersion.
 * Entity is 32bit integer due to nature of js bitwise operation(automatically converts to 32bit integer).
 * It is combined through bitwise operation using forgeEntity().
 *  */
export type Entity = number;
export type Entities = Uint32Array;

export type EntityId = number;
export type EntityVersion = number;

export const N_ID_BITS = 20;
export const N_VERSION_BITS = 32 - N_ID_BITS;
export const ID_MAX = 2 ** N_ID_BITS - 1;
export const ID_MASK = ID_MAX;
export const VERSION_MAX = 2 ** N_VERSION_BITS - 1;
export const VERSION_MASK = (VERSION_MAX << N_ID_BITS) >>> 0;

/**
 * This is currently only used in one place - checking the end of the recycle list
 */
export const ID_END_OF_DESTROYED = ID_MASK;

export function extractEntityId(entity: Entity): EntityId {
  return entity & ID_MASK;
}

export function extractEntityVersion(entity: Entity): EntityId {
  return (entity & VERSION_MASK) >>> N_ID_BITS;
}

export function forgeEntity(id: EntityId, version: EntityVersion): Entity {
  return (((version << N_ID_BITS) & VERSION_MASK) | (id & ID_MASK)) >>> 0;
}

export function asRawString(entity: Entity) {
  return `(${extractEntityId(entity)}|v${extractEntityVersion(entity)})`;
}

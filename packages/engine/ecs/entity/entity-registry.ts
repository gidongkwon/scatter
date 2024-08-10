// Most of the code came from https://codesandbox.io/s/beautiful-blackburn-ckzhf&file=/src/entities.ts

import { assert } from "../../utils/assert";
import {
  type Entities,
  type Entity,
  type EntityId,
  ID_END_OF_DESTROYED,
  VERSION_MAX,
  extractEntityId,
  extractEntityVersion,
  forgeEntity,
} from "./entity";

/**
 * The amount to allocate each time we run out of space, in number of entities
 */
const ALLOC_CAPACITY = 128;

export class EntityRegistry {
  destoyedEntityPointer: EntityId | null = null;
  nextCapacityTarget = 0;
  entities: Entities = new Uint32Array(0);

  nextEntityId = 0;

  isAlive = (entity: Entity) => {
    const id = extractEntityId(entity);
    return id < this.nextEntityId && this.entities[id] === entity;
  };

  all = () => {
    return this.entities.slice(0, this.nextEntityId);
  };

  alives = () => {
    return this.all().filter(
      (entity, index) => extractEntityId(entity) === index,
    );
  };

  create: () => Entity = () => {
    // Create new one if there's no recylable entity
    if (this.destoyedEntityPointer == null) {
      if (this.nextEntityId === this.nextCapacityTarget) {
        this.nextCapacityTarget += ALLOC_CAPACITY;
        const old = this.entities;
        this.entities = new Uint32Array(this.nextCapacityTarget);
        this.entities.set(old);
      }

      const id = this.nextEntityId;
      const version = 0;
      const entity = forgeEntity(id, version);
      this.entities[id] = entity;
      this.nextEntityId++;
      return entity;
    }

    // Recycle destroyed entity
    const pointedDestoyedEntity = this.entities[this.destoyedEntityPointer];
    const pointedEntityId = extractEntityId(pointedDestoyedEntity);
    // version is increased on remove
    const version = extractEntityVersion(pointedDestoyedEntity);
    const idToRecycle = this.destoyedEntityPointer;

    // Update pointer to pointed one. (like move head to the next element in linked list)
    // ID_END_OF_DESTROYED means there's no more linked entity.
    this.destoyedEntityPointer =
      pointedEntityId === ID_END_OF_DESTROYED ? null : pointedEntityId;

    const entity = forgeEntity(idToRecycle, version);
    this.entities[idToRecycle] = entity;

    return entity;
  };

  remove = (entity: Entity) => {
    const id = extractEntityId(entity);

    assert(id < this.nextEntityId, "entity id is out of range");
    assert(this.entities[id] === entity, "entity id is invalid");

    const nextIdToPoint =
      this.destoyedEntityPointer != null
        ? this.destoyedEntityPointer
        : ID_END_OF_DESTROYED;
    assert(nextIdToPoint !== id, "entity id exhausted");

    const version = extractEntityVersion(entity);
    const nextVersion = version === VERSION_MAX ? 0 : version + 1;
    this.entities[id] = forgeEntity(nextIdToPoint, nextVersion);
    this.destoyedEntityPointer = id;
  };

  getEntityString = (entity: Entity) => {
    const id = extractEntityId(entity);
    const isPointer = extractEntityId(this.entities[id]) !== id;
    const isDestroyedEndMarker = id === ID_END_OF_DESTROYED;
    const isOutOfRange = id >= this.entities.length;

    let idStr: string;
    if (isDestroyedEndMarker) {
      idStr = "END";
    } else if (isPointer) {
      idStr = `→${id}`;
    } else if (isOutOfRange) {
      idStr = "ERROR";
    } else {
      idStr = `${id}`;
    }

    return `(${idStr}|v${extractEntityVersion(entity)})`;
  };

  toString = () => {
    return `[${[...this.all()].map((entity) => this.getEntityString(entity)).join(", ")}]`;
  };
}

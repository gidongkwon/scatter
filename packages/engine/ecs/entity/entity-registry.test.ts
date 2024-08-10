import { expect, test } from "vitest";
import { VERSION_MAX, extractEntityId, extractEntityVersion } from "./entity";
import { EntityRegistry } from "./entity-registry";

test("add/id increment", () => {
  const entityRegistry = new EntityRegistry();

  let entity = entityRegistry.create();
  expect(extractEntityId(entity)).toStrictEqual(0);
  expect(extractEntityVersion(entity)).toStrictEqual(0);

  entity = entityRegistry.create();
  expect(extractEntityId(entity)).toStrictEqual(1);
  expect(extractEntityVersion(entity)).toStrictEqual(0);

  const allEntities = entityRegistry.all();
  const entity0 = allEntities[0];
  expect(extractEntityId(entity0)).toStrictEqual(0);
  expect(extractEntityVersion(entity0)).toStrictEqual(0);

  const entity1 = allEntities[1];
  expect(extractEntityId(entity1)).toStrictEqual(1);
  expect(extractEntityVersion(entity1)).toStrictEqual(0);
});

test("remove", () => {
  const entityRegistry = new EntityRegistry();

  const entity0 = entityRegistry.create();
  const entity1 = entityRegistry.create();
  const entity2 = entityRegistry.create();
  const entity3 = entityRegistry.create();

  entityRegistry.remove(entity1);
  expect(entityRegistry.destoyedEntityPointer).toEqual(entity1);
  expect(entityRegistry.toString()).toEqual(
    "[(0|v0), (END|v1), (2|v0), (3|v0)]",
  );

  entityRegistry.remove(entity2);
  expect(entityRegistry.destoyedEntityPointer).toEqual(entity2);
  expect(entityRegistry.toString()).toEqual(
    "[(0|v0), (END|v1), (→1|v1), (3|v0)]",
  );

  entityRegistry.remove(entity0);
  expect(entityRegistry.destoyedEntityPointer).toEqual(entity0);
  expect(entityRegistry.toString()).toEqual(
    "[(→2|v1), (END|v1), (→1|v1), (3|v0)]",
  );

  entityRegistry.remove(entity3);
  expect(entityRegistry.destoyedEntityPointer).toEqual(entity3);
  expect(entityRegistry.toString()).toEqual(
    "[(→2|v1), (END|v1), (→1|v1), (→0|v1)]",
  );
});

test("remove already removed one", () => {
  const entityRegistry = new EntityRegistry();
  const entity0 = entityRegistry.create();
  entityRegistry.remove(entity0);
  expect(() => {
    entityRegistry.remove(entity0);
  }).toThrowError();
});

test("recycle one", () => {
  const entityRegistry = new EntityRegistry();

  const entity0 = entityRegistry.create();
  entityRegistry.remove(entity0);
  expect(entityRegistry.destoyedEntityPointer).toEqual(0);
  expect(entityRegistry.toString()).toEqual("[(END|v1)]");

  entityRegistry.create();
  expect(entityRegistry.destoyedEntityPointer).toBeNull();
  expect(entityRegistry.toString()).toEqual("[(0|v1)]");
});

test("recycle multiple", () => {
  const entityRegistry = new EntityRegistry();

  entityRegistry.create();
  const entity1 = entityRegistry.create();
  const entity2 = entityRegistry.create();
  entityRegistry.create();

  entityRegistry.remove(entity1);
  entityRegistry.remove(entity2);

  entityRegistry.create();
  entityRegistry.create();

  const alives = entityRegistry.alives();
  const aliveEntityIds = alives.map(extractEntityId);
  const aliveEnttiyVersions = alives.map(extractEntityVersion);

  expect(aliveEntityIds).toEqual(Uint32Array.from([0, 1, 2, 3]));
  expect(aliveEnttiyVersions).toEqual(Uint32Array.from([0, 1, 1, 0]));
});

test("alives/version spread", () => {
  const entityRegistry = new EntityRegistry();
  for (let i = 0; i < 10; i++) {
    entityRegistry.create();
  }
  for (let i = 0; i < 10; i++) {
    entityRegistry.remove(i);
  }
  for (let i = 0; i < 100; i++) {
    const entity = entityRegistry.create();
    entityRegistry.remove(entity);
  }

  const entity = entityRegistry.create();
  expect(entityRegistry.alives().length).toEqual(1);
  expect(extractEntityVersion(entity)).toEqual(101);
});

test("version wrap", () => {
  const entityRegistry = new EntityRegistry();
  for (let i = 0; i < 10; i++) {
    entityRegistry.create();
  }
  for (let i = 0; i < 10; i++) {
    entityRegistry.remove(i);
  }

  for (let x = 0; x < 5; x++) {
    for (let y = 0; y <= VERSION_MAX; y++) {
      const entity = entityRegistry.create();
      entityRegistry.remove(entity);
    }
  }

  const entity = entityRegistry.create();
  expect(extractEntityVersion(entity)).toEqual(1);
});

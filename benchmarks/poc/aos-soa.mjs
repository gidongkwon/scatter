import { run, bench, group } from 'mitata';

// Utility function to generate random number
function random(min, max) {
  return Math.random() * (max - min) + min;
}

// Entity creation functions
function createEntityAoS(id) {
  return {
    id,
    position: { x: random(0, 1000), y: random(0, 1000) },
    velocity: { x: random(-10, 10), y: random(-10, 10) },
    acceleration: { x: random(-1, 1), y: random(-1, 1) }
  };
}

// System update functions
function updateAoS(entities, dt) {
  for (let entity of entities) {
    entity.velocity.x += entity.acceleration.x * dt;
    entity.velocity.y += entity.acceleration.y * dt;
    entity.position.x += entity.velocity.x * dt;
    entity.position.y += entity.velocity.y * dt;
  }
}

function updateSoA(entityData, dt) {
  for (let i = 0; i < entityData.ids.length; i++) {
    entityData.velocityX[i] += entityData.accelerationX[i] * dt;
    entityData.velocityY[i] += entityData.accelerationY[i] * dt;
    entityData.positionX[i] += entityData.velocityX[i] * dt;
    entityData.positionY[i] += entityData.velocityY[i] * dt;
  }
}

// Setup functions
function setupAoS(entityCount) {
  let entities = new Array(entityCount);
  for (let i = 0; i < entityCount; i++) {
    entities[i] = createEntityAoS(i);
  }
  return entities;
}

function setupSoA(entityCount) {
  let entities = {
    ids: new Array(entityCount),
    positionX: new Float32Array(entityCount),
    positionY: new Float32Array(entityCount),
    velocityX: new Float32Array(entityCount),
    velocityY: new Float32Array(entityCount),
    accelerationX: new Float32Array(entityCount),
    accelerationY: new Float32Array(entityCount)
  };
  for (let i = 0; i < entityCount; i++) {
    entities.ids[i] = i;
    entities.positionX[i] = random(0, 1000);
    entities.positionY[i] = random(0, 1000);
    entities.velocityX[i] = random(-10, 10);
    entities.velocityY[i] = random(-10, 10);
    entities.accelerationX[i] = random(-1, 1);
    entities.accelerationY[i] = random(-1, 1);
  }
  return entities;
}

// Benchmark
const ENTITY_COUNT = 100000;
const DT = 1/60;

const entitiesAoS = setupAoS(ENTITY_COUNT);
const entitiesSoA = setupSoA(ENTITY_COUNT);

group('ECS Update Performance', () => {
  bench('Array of Structures (AoS)', () => {
    updateAoS(entitiesAoS, DT);
  });

  bench('Structure of Arrays (SoA)', () => {
    updateSoA(entitiesSoA, DT);
  });
});

await run();
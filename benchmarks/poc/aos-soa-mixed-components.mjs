import { bench, group, run } from "mitata";

// Component types
const POSITION = 1;
const VELOCITY = 2;
const HEALTH = 3;
const RENDER = 4;
const AI = 5;

// Utility function to generate random number
function random(min, max) {
  return Math.random() * (max - min) + min;
}

// Entity creation functions
function createEntityAoS(id, componentTypes) {
  const entity = { id, componentTypes };
  if (componentTypes.includes(POSITION))
    entity.position = { x: random(0, 1000), y: random(0, 1000) };
  if (componentTypes.includes(VELOCITY))
    entity.velocity = { x: random(-10, 10), y: random(-10, 10) };
  if (componentTypes.includes(HEALTH)) entity.health = random(50, 100);
  if (componentTypes.includes(RENDER))
    entity.render = { sprite: Math.floor(random(1, 10)) };
  if (componentTypes.includes(AI))
    entity.ai = { state: Math.floor(random(1, 5)) };
  return entity;
}

// System update functions
function updatePositionAoS(entities, dt) {
  for (const entity of entities) {
    if (
      entity.componentTypes.includes(POSITION) &&
      entity.componentTypes.includes(VELOCITY)
    ) {
      entity.position.x += entity.velocity.x * dt;
      entity.position.y += entity.velocity.y * dt;
    }
  }
}

function updateHealthAoS(entities) {
  for (const entity of entities) {
    if (entity.componentTypes.includes(HEALTH)) {
      entity.health -= random(0, 0.1);
      if (entity.health <= 0) {
        entity.componentTypes = entity.componentTypes.filter(
          (c) => c !== HEALTH,
        );
      }
    }
  }
}

function updateAIAoS(entities, dt) {
  for (const entity of entities) {
    if (entity.componentTypes.includes(AI)) {
      entity.ai.state = Math.floor(random(1, 5));
      if (entity.componentTypes.includes(VELOCITY)) {
        entity.velocity.x += random(-1, 1) * dt;
        entity.velocity.y += random(-1, 1) * dt;
      }
    }
  }
}

function updatePositionSoA(entityData, dt) {
  for (let i = 0; i < entityData.ids.length; i++) {
    if (
      entityData.componentTypes[i].includes(POSITION) &&
      entityData.componentTypes[i].includes(VELOCITY)
    ) {
      entityData.positionX[i] += entityData.velocityX[i] * dt;
      entityData.positionY[i] += entityData.velocityY[i] * dt;
    }
  }
}

function updateHealthSoA(entityData) {
  for (let i = 0; i < entityData.ids.length; i++) {
    if (entityData.componentTypes[i].includes(HEALTH)) {
      entityData.health[i] -= random(0, 0.1);
      if (entityData.health[i] <= 0) {
        entityData.componentTypes[i] = entityData.componentTypes[i].filter(
          (c) => c !== HEALTH,
        );
      }
    }
  }
}

function updateAISoA(entityData, dt) {
  for (let i = 0; i < entityData.ids.length; i++) {
    if (entityData.componentTypes[i].includes(AI)) {
      entityData.aiState[i] = Math.floor(random(1, 5));
      if (entityData.componentTypes[i].includes(VELOCITY)) {
        entityData.velocityX[i] += random(-1, 1) * dt;
        entityData.velocityY[i] += random(-1, 1) * dt;
      }
    }
  }
}

// Setup functions
function setupAoS(entityCount) {
  const entities = new Array(entityCount);
  for (let i = 0; i < entityCount; i++) {
    const componentTypes = [POSITION, VELOCITY, HEALTH, RENDER, AI].filter(
      () => Math.random() > 0.3,
    );
    entities[i] = createEntityAoS(i, componentTypes);
  }
  return entities;
}

function setupSoA(entityCount) {
  const entities = {
    ids: new Array(entityCount),
    componentTypes: new Array(entityCount),
    positionX: new Float32Array(entityCount),
    positionY: new Float32Array(entityCount),
    velocityX: new Float32Array(entityCount),
    velocityY: new Float32Array(entityCount),
    health: new Float32Array(entityCount),
    renderSprite: new Uint8Array(entityCount),
    aiState: new Uint8Array(entityCount),
  };
  for (let i = 0; i < entityCount; i++) {
    const componentTypes = [POSITION, VELOCITY, HEALTH, RENDER, AI].filter(
      () => Math.random() > 0.3,
    );
    entities.ids[i] = i;
    entities.componentTypes[i] = componentTypes;
    if (componentTypes.includes(POSITION)) {
      entities.positionX[i] = random(0, 1000);
      entities.positionY[i] = random(0, 1000);
    }
    if (componentTypes.includes(VELOCITY)) {
      entities.velocityX[i] = random(-10, 10);
      entities.velocityY[i] = random(-10, 10);
    }
    if (componentTypes.includes(HEALTH)) {
      entities.health[i] = random(50, 100);
    }
    if (componentTypes.includes(RENDER)) {
      entities.renderSprite[i] = Math.floor(random(1, 10));
    }
    if (componentTypes.includes(AI)) {
      entities.aiState[i] = Math.floor(random(1, 5));
    }
  }
  return entities;
}

function setupSoANonTyped(entityCount) {
  const entities = {
    ids: new Array(entityCount),
    componentTypes: new Array(entityCount),
    positionX: new Array(entityCount),
    positionY: new Array(entityCount),
    velocityX: new Array(entityCount),
    velocityY: new Array(entityCount),
    health: new Array(entityCount),
    renderSprite: new Array(entityCount),
    aiState: new Array(entityCount),
  };
  for (let i = 0; i < entityCount; i++) {
    const componentTypes = [POSITION, VELOCITY, HEALTH, RENDER, AI].filter(
      () => Math.random() > 0.3,
    );
    entities.ids[i] = i;
    entities.componentTypes[i] = componentTypes;
    if (componentTypes.includes(POSITION)) {
      entities.positionX[i] = random(0, 1000);
      entities.positionY[i] = random(0, 1000);
    }
    if (componentTypes.includes(VELOCITY)) {
      entities.velocityX[i] = random(-10, 10);
      entities.velocityY[i] = random(-10, 10);
    }
    if (componentTypes.includes(HEALTH)) {
      entities.health[i] = random(50, 100);
    }
    if (componentTypes.includes(RENDER)) {
      entities.renderSprite[i] = Math.floor(random(1, 10));
    }
    if (componentTypes.includes(AI)) {
      entities.aiState[i] = Math.floor(random(1, 5));
    }
  }
  return entities;
}

// Benchmark
const ENTITY_COUNT = 100000;
const DT = 1 / 60;

const entitiesAoS = setupAoS(ENTITY_COUNT);
const entitiesSoA = setupSoA(ENTITY_COUNT);
const entitiesSoANonTyped = setupSoANonTyped(ENTITY_COUNT);

function runAoSUpdate(entities, dt) {
  updatePositionAoS(entities, dt);
  updateHealthAoS(entities);
  updateAIAoS(entities, dt);
}

function runSoAUpdate(entities, dt) {
  updatePositionSoA(entities, dt);
  updateHealthSoA(entities);
  updateAISoA(entities, dt);
}

group("ECS Update Performance with Mixed Components", () => {
  bench("Array of Structures (AoS)", () => {
    runAoSUpdate(entitiesAoS, DT);
  });
  bench("Structure of Arrays (SoA)", () => {
    runSoAUpdate(entitiesSoA, DT);
  });
  bench("Structure of Arrays on Non-typed Array", () => {
    runSoAUpdate(entitiesSoANonTyped, DT);
  });
});

await run();

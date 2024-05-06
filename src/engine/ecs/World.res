type componentStorageIndex = {
  archetype: Archetype.t,
  index: int,
}

type rec system = t => unit
and t = {
  mutable dt: float,
  startupSystems: array<system>,
  renderSystems: array<system>,
  updateSystems: array<system>,
  entityToComponentStorage: Map.t<Entity.t, componentStorageIndex>,
  componentIdToArchetypeSet: Map.t<Component.id, Set.t<Archetype.id>>,
  componentIdsToArchetype: Belt.MutableMap.t<array<Component.id>, Archetype.t, Component_ArrayCmp.ArrayCmp.identity>,
  mutable componentIdCounter: int,
  mutable entityIdCounter: int,
}

let make = () => {
  {
    dt: 0.,
    startupSystems: [],
    renderSystems: [],
    updateSystems: [],
    entityToComponentStorage: Map.make(),
    componentIdToArchetypeSet: Map.make(),
    componentIdsToArchetype: Belt.MutableMap.make(~id=module(Component_ArrayCmp.ArrayCmp)),
    componentIdCounter: 0,
    entityIdCounter: 0,
  }
}

let callSystems = (world, systems) => {
  for i in 0 to systems->Array.length - 1 {
    (systems->Array.getUnsafe(i))(world)
  }
}

let startup = (world) => {
  callSystems(world, world.startupSystems)
}

let update = (world, ~dt) => {
  world.dt = dt
  callSystems(world, world.updateSystems)
}

let render = (world) => {
  callSystems(world, world.renderSystems)
}

let registerSystem = (world, ~phase, ~system) => {
  let arrayToPush = switch phase {
  | System.Startup => world.startupSystems
  | System.Render => world.renderSystems
  | System.Update => world.updateSystems
  }
  arrayToPush->Array.push(system)
}

let removeSystem = (world, ~phase, ~system) => {
  let arrayToRemove = switch phase {
  | System.Startup => world.startupSystems
  | System.Render => world.renderSystems
  | System.Update => world.updateSystems
  }
  let maybeIndex = arrayToRemove->Array.indexOfOpt(system)
  
  if maybeIndex->Option.isSome {
    arrayToRemove->Array.splice(~start=maybeIndex->Option.getExn, ~remove=1, ~insert=[])
  }
}

let addComponent = (world: t, ~entity: Entity.t, ~componentId: Component.id) => {
  let findArchetype = () => {
    world.componentIdsToArchetype->Belt.MutableMap.get([componentId])
  }

  // switch world.entityToComponentStorage->Map.get(entity) {
  // | Some({archetype})
  // }
}

let hasComponent = (world: t, ~entity: Entity.t, ~componentId: Component.id) => {
  switch world.entityToComponentStorage->Map.get(entity) {
  | Some({archetype}) => switch world.componentIdToArchetypeSet->Map.get(componentId) {
    | Some(archetypeSet) => archetypeSet->Set.has(archetype.id)
    | None => false
    }
  | None => false
  }
}

let getComponent = (world: t, ~entity: Entity.t, ~componentId: Component.id) => {
  switch world.entityToComponentStorage->Map.get(entity) {
  | Some({index, archetype}) => switch archetype.componentIdToStorage->Map.get(componentId) {
    | Some(components) => components->Array.get(index)
    | None => None
    }
  | None => None
  }
}

let defineComponent = (world: t) => {
  world.componentIdCounter = world.componentIdCounter + 1
  world.componentIdCounter
}

let makeEntity = (world: t) => {
  world.entityIdCounter = world.entityIdCounter + 1
  world.entityIdCounter
}

let hasEntity = (world: t, ~entity: Entity.t) => {
  world.entityIdCounter <= entity
}

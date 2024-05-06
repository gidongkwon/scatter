type componentStorageIndex = {
  archetype: Archetype.t,
  index: int,
}

@genType
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
  mutable entityIdCounter: int
}

@genType let make: () => t

@genType let startup: t => unit
@genType let update: (t, ~dt: float) => unit
@genType let render: t => unit
@genType let registerSystem: (t, ~phase: System.phase, ~system: system) => unit
@genType let removeSystem: (t, ~phase: System.phase, ~system: system) => unit

@genType
let hasComponent: (t, ~entity: Entity.t, ~componentId: Component.id) => bool

@genType
let getComponent: (t, ~entity: Entity.t, ~componentId: Component.id) => option<Component.t>

@genType
let defineComponent: (t) => Component.id

@genType let makeEntity: (t) => Entity.t
@genType let hasEntity: (t, ~entity: Entity.t) => bool
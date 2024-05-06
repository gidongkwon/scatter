type id = int

type rec edge = {
  add: sibling,
  remove: sibling,
}
and sibling = {
  archetype: t,
  component: Component.id,
}
and t = {
  id: id,
  componentIdToStorage: Map.t<Component.id, array<Component.t>>,
  edges: Map.t<Component.id, edge>,
}

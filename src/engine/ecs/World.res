type rec system = (t) => unit
and t = {
  mutable dt: float,
  renderSystems: array<system>,
  updateSystems: array<system>,
}

@genType
let make = () => {
  {
    dt: 0.,
    renderSystems: [],
    updateSystems: [],
  }
}

@genType
let update = (world: t, dt) => {
  world.dt = dt
  let systems = world.updateSystems
  for i in 0 to systems->Array.length - 1 {
    (systems->Array.getUnsafe(i))(world)
  }
}

@genType
let render = (world: t) => {
  let systems = world.renderSystems
  for i in 0 to systems->Array.length - 1 {
    (systems->Array.getUnsafe(i))(world)
  }
}

@genType
let registerSystem = (~world: t, priority, system) => {
  let arrayToPush = switch priority {
    | System.Render => world.renderSystems
    | System.Update => world.updateSystems
  }
  arrayToPush->Array.push(system)
}

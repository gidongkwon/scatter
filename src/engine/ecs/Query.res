type t = {componentIds: array<Component.id>}

let make = (~componentIds: array<Component.id>) => {
  {componentIds: componentIds}
}


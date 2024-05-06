type t = {
  dense: array<int>,
  sparse: array<int>,
}

let make = () => {
  {
    dense: [],
    sparse: [],
  }
}


let add = (set: t, value: int) => {
  set.sparse[value] = set.sparse->Array.length
  set.dense->Array.push(value)
}

let has = (set: t, value) => {
  switch set.sparse->Array.get(value) {
    | Some(index) => set.dense->Array.get(index) == Some(value)
    | None => false
  }
}

let remove = (set: t, value) => {
  if has(set, value) {
    let swap = set.dense->Array.pop
    if swap != Some(value) {
      let swapValue = swap->Option.getExn
      set.dense[set.sparse->Array.getUnsafe(value)] = swapValue
      set.sparse[swapValue] = set.sparse->Array.getUnsafe(value)
    }
  }
}
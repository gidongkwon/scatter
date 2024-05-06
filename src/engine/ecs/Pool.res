type id = int

type t = {
  idCounter: id
}

let make = () => {
  {idCounter: 0}
}
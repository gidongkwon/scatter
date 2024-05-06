module ArrayCmp = Belt.Id.MakeComparableU({
  type t = array<Component.id>
  let cmp = (a, b) => Belt.Array.cmpU(a, b, (x, y) => compare(x, y))
})
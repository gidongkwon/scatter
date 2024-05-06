type id = int

type t = {
  id,
  componentIds: Set.t<Component.id>,
  components: array<int>,
}
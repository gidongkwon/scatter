export function swap<T>(array: Array<T>, i: number, j: number) {
  const tmp = array[i];
  array[i] = array[j];
  array[j] = tmp;
}

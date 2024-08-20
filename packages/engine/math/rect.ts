export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function intersects(a: Rect, b: Rect) {
  const leftA = a.x;
  const rightA = a.x + a.width;
  const topA = a.y;
  const bottomA = a.y + a.height;

  const leftB = b.x;
  const rightB = b.x + b.width;
  const topB = b.y;
  const bottomB = b.y + b.height;

  let collided = true;
  if (rightA < leftB || leftA > rightB) collided = false;
  if (bottomA < topB || topA > bottomB) collided = false;
  return collided;
}

import { type Rect, intersects } from "../math/rect";

export interface BoundsWithData<TData> {
  data: TData;
  bounds: Rect;
}

export class SpatialHash<TData> {
  buckets: Map<number, Set<BoundsWithData<TData>>> = new Map();
  constructor(public cellSize = 128) {
    this.reset();
  }

  insert = (object: BoundsWithData<TData>) => {
    this.hashBounds(object.bounds, (hash) => {
      let bucket = this.buckets.get(hash);
      if (bucket == null) {
        bucket = new Set();
        this.buckets.set(hash, bucket);
      }

      bucket.add(object);
    });
  };

  remove = (object: BoundsWithData<TData>) => {
    for (const [_, bucket] of this.buckets) {
      bucket.delete(object);
    }
  };

  update = (object: BoundsWithData<TData>) => {
    this.remove(object);
    this.insert(object);
  };

  query = (bounds: Rect, out: Set<BoundsWithData<TData>>) => {
    this.hashBounds(bounds, (hash) => {
      const bucket = this.buckets.get(hash);
      if (bucket == null) {
        return;
      }

      for (const o of bucket) {
        if (intersects(o.bounds, bounds)) {
          out.add(o);
        }
      }
    });
  };

  reset = () => {
    for (const [_, bucket] of this.buckets) {
      bucket.clear();
    }
  };

  private hashPoint(x: number, y: number) {
    // Calculate the grid cell coordinates
    const cellX = Math.floor(x / this.cellSize);
    const cellY = Math.floor(y / this.cellSize);

    // Combine the cell coordinates into a single numeric hash value
    const prime = 73856093; // A large prime number
    return cellX * prime + cellY;
  }

  private hashBounds(rect: Rect, callback: (hash: number) => void) {
    const sizeInv = 1 / this.cellSize;
    const left = Math.floor(rect.x * sizeInv) * this.cellSize;
    const right = Math.floor((rect.x + rect.width) * sizeInv) * this.cellSize;
    const top = Math.floor(rect.y * sizeInv) * this.cellSize;
    const bottom = Math.floor((rect.y + rect.height) * sizeInv) * this.cellSize;
    for (let y = bottom; y >= top; y -= this.cellSize) {
      for (let x = right; x >= left; x -= this.cellSize) {
        callback(this.hashPoint(x, y));
      }
    }
  }
}

import { type Rect, intersects } from "../math/rect";

export interface BoundsWithData<TData> {
  data: TData;
  bounds: Rect;
}

export class Quadtree<TData> {
  subNodes:
    | {
        topLeft: Quadtree<TData>;
        topRight: Quadtree<TData>;
        bottomLeft: Quadtree<TData>;
        bottomRight: Quadtree<TData>;
      }
    | undefined;

  objects: BoundsWithData<TData>[] = [];

  constructor(
    public bounds: Rect,
    public capacity: number,
    public depth = 0,
    public maxDepth = 4,
  ) {}

  tryInsert = (object: BoundsWithData<TData>) => {
    if (!intersects(object.bounds, this.bounds)) {
      return;
    }
    if (this.subNodes != null) {
      this.subNodes.topLeft.tryInsert(object);
      this.subNodes.topRight.tryInsert(object);
      this.subNodes.bottomLeft.tryInsert(object);
      this.subNodes.bottomRight.tryInsert(object);
      return;
    }

    this.objects.push(object);

    if (this.objects.length > this.capacity && this.depth < this.maxDepth) {
      this.split();
      // biome-ignore lint/style/noNonNullAssertion: spilt()
      this.subNodes!.topLeft.tryInsert(object);
      // biome-ignore lint/style/noNonNullAssertion: spilt()
      this.subNodes!.topRight.tryInsert(object);
      // biome-ignore lint/style/noNonNullAssertion: spilt()
      this.subNodes!.bottomLeft.tryInsert(object);
      // biome-ignore lint/style/noNonNullAssertion: spilt()
      this.subNodes!.bottomRight.tryInsert(object);
    }
  };

  remove = (object: BoundsWithData<TData>) => {
    const index = this.objects.indexOf(object);
    if (index > -1) {
      this.objects.splice(index);
    }

    if (this.subNodes != null) {
      this.subNodes.topLeft.remove(object);
      this.subNodes.topRight.remove(object);
      this.subNodes.bottomLeft.remove(object);
      this.subNodes.bottomRight.remove(object);
    }
  };

  update = (object: BoundsWithData<TData>) => {
    this.remove(object);
    this.tryInsert(object);
  };

  split = () => {
    const x = this.bounds.x;
    const y = this.bounds.y;
    const halfWidth = this.bounds.width / 2;
    const halfHeight = this.bounds.height / 2;
    const centerX = x + halfWidth;
    const centerY = y + halfHeight;
    const nextDepth = this.depth + 1;

    this.subNodes = {
      topLeft: new Quadtree(
        {
          x,
          y,
          width: halfWidth,
          height: halfHeight,
        },
        this.capacity,
        nextDepth,
      ),
      topRight: new Quadtree(
        {
          x: centerX,
          y,
          width: halfWidth,
          height: halfHeight,
        },
        this.capacity,
        nextDepth,
      ),
      bottomLeft: new Quadtree(
        {
          x,
          y: centerY,
          width: halfWidth,
          height: halfHeight,
        },
        this.capacity,
        nextDepth,
      ),
      bottomRight: new Quadtree(
        {
          x: centerX,
          y: centerY,
          width: halfWidth,
          height: halfHeight,
        },
        this.capacity,
        nextDepth,
      ),
    };
  };

  _uniqueObjects = new Set<BoundsWithData<TData>>();
  shrink = () => {
    if (this.subNodes == null) {
      return;
    }
    for (const o of this.objects) {
      this._uniqueObjects.add(o);
    }
    for (const o of this.subNodes.topLeft.objects) {
      this._uniqueObjects.add(o);
    }
    for (const o of this.subNodes.topRight.objects) {
      this._uniqueObjects.add(o);
    }
    for (const o of this.subNodes.bottomLeft.objects) {
      this._uniqueObjects.add(o);
    }
    for (const o of this.subNodes.bottomRight.objects) {
      this._uniqueObjects.add(o);
    }
    this.objects = Array.from(this._uniqueObjects);
    this.subNodes = undefined;
  };

  query = (bounds: Rect, out: Set<BoundsWithData<TData>>) => {
    if (!intersects(bounds, this.bounds)) {
      return;
    }

    for (let i = 0; i < this.objects.length; i++) {
      if (intersects(this.objects[i].bounds, bounds)) {
        out.add(this.objects[i]);
      }
    }

    if (this.subNodes != null) {
      if (intersects(bounds, this.subNodes.topLeft.bounds)) {
        this.subNodes.topLeft.query(bounds, out);
      }
      if (intersects(bounds, this.subNodes.topRight.bounds)) {
        this.subNodes.topRight.query(bounds, out);
      }
      if (intersects(bounds, this.subNodes.bottomLeft.bounds)) {
        this.subNodes.bottomLeft.query(bounds, out);
      }
      if (intersects(bounds, this.subNodes.bottomRight.bounds)) {
        this.subNodes.bottomRight.query(bounds, out);
      }
    }
  };

  shrinkIfNeeded = () => {
    if (this.subNodes == null) {
      return;
    }

    if (
      this.subNodes.topLeft.objects.length === 0 &&
      this.subNodes.topRight.objects.length === 0 &&
      this.subNodes.bottomLeft.objects.length === 0 &&
      this.subNodes.bottomRight.objects.length === 0
    ) {
      this.shrink();
    } else {
      this.subNodes.topLeft.shrinkIfNeeded();
      this.subNodes.topRight.shrinkIfNeeded();
      this.subNodes.bottomLeft.shrinkIfNeeded();
      this.subNodes.bottomRight.shrinkIfNeeded();
    }
  };
}

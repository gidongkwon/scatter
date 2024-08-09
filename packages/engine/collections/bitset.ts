const mod32 = 31;

export class BitSet {
  blocks: Uint32Array;
  
  constructor(bufferSize: number = 4) {
    this.blocks = new Uint32Array(bufferSize);
  }

  growIfNeeded = (storageIndex: number) => {
    if (storageIndex >= this.blocks.length) {
      const old = this.blocks;
      this.blocks = new Uint32Array(storageIndex + 1);
      this.blocks.set(old, 0);
    }
  }

  has = (index: number) => {
    const storageIndex = index >>> 5 // divide by 32
    if (storageIndex >= this.blocks.length) {
      return false;
    }
    return (this.blocks[storageIndex] & (1 << (index & mod32))) > 0
  }

  set = (index: number) => {
    const storageIndex = index >>> 5 // divide by 32
    this.growIfNeeded(storageIndex);
    this.blocks[storageIndex] |= 1 << (index & mod32)
  }

  unset = (index: number) => {
    const storageIndex = index >>> 5 // divide by 32
    if (storageIndex >= this.blocks.length) return;

    this.blocks[storageIndex] &= ~(1 << (index & mod32))
  }

  toString = () => {
    return `[${[...this.blocks].map((n) => n.toString(2).padStart(32, '0')).reverse().join(" ")}]`
  }
}

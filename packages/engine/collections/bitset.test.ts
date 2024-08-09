import { expect, test } from "vitest";
import { BitSet } from "./bitset";

test("set", () => {
  const b = new BitSet(1);
  expect(b.toString(), "[00000000000000000000000000000000]")
  b.set(1);
  expect(b.toString(), "[00000000000000000000000000000010]")
})

test("set grow if needed", () => {
  const b = new BitSet(2);
  expect(b.toString()).toBe("[00000000000000000000000000000000 00000000000000000000000000000000]");
  b.set(64);
  expect(b.toString()).toBe("[00000000000000000000000000000001 00000000000000000000000000000000 00000000000000000000000000000000]")
})

test("has", () => {
  const b = new BitSet(2);
  expect(b.has(0)).toBe(false);
  expect(b.has(2)).toBe(false);
  b.set(2);
  expect(b.has(0)).toBe(false);
  expect(b.has(2)).toBe(true);
})

test("unset", () => {
  const b = new BitSet(1);
  b.set(3);
  b.set(4);
  expect(b.has(3)).toBe(true);
  expect(b.has(4)).toBe(true);
  b.unset(4);
  expect(b.has(3)).toBe(true);
  expect(b.has(4)).toBe(false);
})

test("has beyond length", () => {
  const b = new BitSet(1);
  expect(b.has(32)).toBe(false);
})

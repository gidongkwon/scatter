import { expect, test } from "vitest";
import { Mat4 } from "gl-matrix";

test("is buffer copied", () => {
  const buffer = new ArrayBuffer(Float32Array.BYTES_PER_ELEMENT * 16 * 2);
  const matrix = new Mat4(buffer, Float32Array.BYTES_PER_ELEMENT * 16);
  matrix[0] = 5;

  const view = new DataView(buffer);
  expect(matrix[0]).toBe(5);
  expect(view.getFloat32(Float32Array.BYTES_PER_ELEMENT * 16, true)).toBe(5);
});

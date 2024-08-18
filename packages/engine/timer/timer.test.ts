import { expect, test } from "vitest";
import { Timer } from "./timer";

test("once/finished", () => {
  const timer = new Timer(1, { type: "once" });
  expect(timer.finished).toBe(false);
  timer.tick(1);
  expect(timer.finished).toBe(true);
});

test("repeat", () => {
  const timer = new Timer(1, { type: "repeat", count: 3 });
  expect(timer.enabled).toBe(true);
  timer.tick(1);
  expect(timer.finished).toBe(false);
  expect(timer.segmentFinished).toBe(true);
  timer.tick(1);
  expect(timer.finished).toBe(false);
  expect(timer.segmentFinished).toBe(true);
  timer.tick(1);
  expect(timer.finished).toBe(true);
  expect(timer.segmentFinished).toBe(true);
  timer.tick(1);
  expect(timer.finished).toBe(true);
  expect(timer.enabled).toBe(false);
});

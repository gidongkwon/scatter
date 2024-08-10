import { expect, test } from "vitest";
import { extractEntityId, extractEntityVersion, forgeEntity } from "./entity";

test("id/version", () => {
  const entity = forgeEntity(1, 3);
  expect(extractEntityId(entity)).toStrictEqual(1);
  expect(extractEntityVersion(entity)).toStrictEqual(3);
});

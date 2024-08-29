import { Type as JTD, type Static } from "../schema/jtd-typedef";
import { Type as TypeBoxType } from "@sinclair/typebox";
import { systemPhases } from "../ecs/system/system";
import { assetTypes } from "../asset/asset-type";

export const ProjectSchema = JTD.Struct({
  name: JTD.String(),
  assets: JTD.Array(
    JTD.Struct({
      type: JTD.Enum([...assetTypes]),
      name: JTD.String(),
      path: JTD.String(),
    }),
  ),
  components: JTD.Array(
    JTD.Struct({
      name: JTD.String(),
      schema: TypeBoxType.Any(),
    }),
  ),
  systems: JTD.Array(
    JTD.Struct({
      name: JTD.String(),
      phase: JTD.Enum([...systemPhases]),
      code: JTD.String(),
    }),
  ),
});

export type ProjectSchema = Static<typeof ProjectSchema>;

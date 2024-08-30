import { Type as JTD, type Static } from "../schema/jtd-typedef";
import { Type as TypeBoxType } from "@sinclair/typebox";
import { systemPhases } from "../ecs/system/system";
import { assetTypes } from "../asset/asset-type";

const RefId = JTD.Uint32;

const SystemPhaseEnumSchema = TypeBoxType.Union([
  TypeBoxType.Literal(systemPhases[0]),
  TypeBoxType.Literal(systemPhases[1]),
  TypeBoxType.Literal(systemPhases[2]),
]);

const SystemSchema = JTD.Struct({
  id: RefId(),
  name: JTD.String(),
  code: JTD.String(),
});

const ComponentDefinitionSchema = JTD.Struct({
  name: JTD.String(),
  schema: TypeBoxType.Any(),
});

const EntitySchema = JTD.Struct({
  name: JTD.String(),
  components: JTD.Array(TypeBoxType.Any()),
});

const SceneSchema = JTD.Struct({
  name: JTD.String(),
  entities: JTD.Array(EntitySchema),
  scripts: TypeBoxType.Mapped(SystemPhaseEnumSchema, () =>
    TypeBoxType.Array(RefId()),
  ),
});

export type SerializedScene = Static<typeof SceneSchema>;

export const ProjectSchema = JTD.Struct({
  name: JTD.String(),
  assets: JTD.Array(
    JTD.Struct({
      type: JTD.Enum([...assetTypes]),
      name: JTD.String(),
      path: JTD.String(),
    }),
  ),
  components: JTD.Array(ComponentDefinitionSchema),
  systems: JTD.Array(SystemSchema),
  scenes: JTD.Array(SceneSchema),
});

export type SerializedProject = Static<typeof ProjectSchema>;

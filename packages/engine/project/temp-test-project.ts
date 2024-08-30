import type { SerializedProject } from "./project-schema";

const tempComponentIds = `
const TransformId = 0;
const SpriteId = 1;
const VelocityId = 2;
const PlayerId = 3;
const EnemyId = 4;
const BulletShooterId = 5;
const RemoveOnOutsideId = 6;
const ColliderId = 7;
`;

export const tempTestProject: SerializedProject = {
  name: "test",
  assets: [
    {
      type: "texture",
      name: "player-ship",
      path: "/shooter/playerShip1_blue.png",
    },
    {
      type: "texture",
      name: "enemy-ship",
      path: "/shooter/playerShip3_red.png",
    },
    {
      type: "texture",
      name: "player-bullet",
      path: "/shooter/Lasers/laserBlue01.png",
    },
  ],
  systems: [
    {
      id: 0,
      name: "Move Player",
      code: `${tempComponentIds}
context.each([write(0), read(1), read(3)], (_, [transform]) => {
  const speed = 300;
  if (context.keyboard.isPressed("ArrowLeft")) {
    transform.position.x -= speed * context.deltaTime;
  }
  if (context.keyboard.isPressed("ArrowRight")) {
    transform.position.x += speed * context.deltaTime;
  }
  if (context.keyboard.isPressed("ArrowUp")) {
    transform.position.y -= speed * context.deltaTime;
  }
  if (context.keyboard.isPressed("ArrowDown")) {
    transform.position.y += speed * context.deltaTime;
  }
});`,
    },
    {
      id: 1,
      name: "Create Player",
      code: `
${tempComponentIds}
const playerTexture = context.assets.texture("player-ship");
      
context.spawn("Player", [
  [
    TransformId,
    {
      position: {
        x: 100,
        y: 100,
      },
      rotation: Math.PI,
      scale: {
        x: 0.5,
        y: 0.5,
      },
    },
  ],
  [
    SpriteId,
    { textureInfo: playerTexture, width: 1, height: 1 },
  ],
  [PlayerId, { score: 0 }],
  [
    BulletShooterId,
    {
      delayTimer: new Timer(0.1, { type: "once" }),
      offset: {
        x: playerTexture.width / 2,
        y: playerTexture.height / 2 / 2,
      },
    },
  ],
  [
    ColliderId,
    {
      data: -1,
      bounds: {
        x: 0,
        y: 0,
        width: playerTexture.width,
        height: playerTexture.height,
      },
    },
  ],
]);`,
    },
  ],
  components: [],
  scenes: [
    {
      name: "Shooter Test",
      entities: [],
      scripts: {
        init: [1],
        update: [0],
        render: [],
      },
    },
  ],
};

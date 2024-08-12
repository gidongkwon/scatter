import type { MetaFunction } from "@remix-run/node";
import { GameView } from "~/game/game-view";

export const meta: MetaFunction = () => {
  return [
    { title: "Scatter" },
    { name: "description", content: "Yet another web game engine" },
  ];
};

export default function Index() {
  return (
    <div className="font-sans p-4 flex w-full h-full min-w-0">
      <GameView />
    </div>
  );
}

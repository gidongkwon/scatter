import type { MetaFunction } from "@remix-run/node";
import { GameEditorPage } from "~/game-editor/game-editor-page";

export const meta: MetaFunction = () => {
  return [
    { title: "Scatter" },
    { name: "description", content: "Yet another web game engine" },
  ];
};

export default function Index() {
  return <GameEditorPage />;
}

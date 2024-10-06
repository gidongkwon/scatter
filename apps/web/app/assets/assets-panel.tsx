import type { Assets } from "@scatter/engine/asset/assets";
import { Panel } from "~/components/panel";
import { Button } from "~/components/ui/button";

interface Props {
  assets: Assets;
}

export function AssetsPanel({ assets }: Props) {
  return (
    <Panel.Container className="flex-col gap-3 flex-1 min-h-0 p-4">
      <section>
        <h2>Textures</h2>
        <div className="grid gap-2 grid-cols-3 justify-items-center mt-3">
          {assets.textures().map((texture) => {
            const name = texture.url.split("/").at(-1)?.split(".")[0];
            return (
              <Button
                variant="ghost"
                key={texture.url}
                title={name}
                className="flex flex-col gap-2 w-full h-fit p-0 hover:bg-slate-2"
              >
                <img
                  src={texture.url}
                  alt={texture.url}
                  className="size-11 object-contain"
                />
                <span className="text-[10px] w-full text-ellipsis break-words line-clamp-2">
                  {name}
                </span>
              </Button>
            );
          })}
        </div>
      </section>
    </Panel.Container>
  );
}

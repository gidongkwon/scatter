import type { ReactNode } from "react";
import { cn } from "~/lib/utils";

function PanelConatiner({
  children,
  className,
}: { children: ReactNode; className?: string }) {
  return (
    <section
      className={cn("w-[300px] bg-background p-3 rounded-lg", className)}
    >
      {children}
    </section>
  );
}

function PanelTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-sm mb-3">{children}</h2>;
}

export const Panel = {
  Container: PanelConatiner,
  Title: PanelTitle,
};

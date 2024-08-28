import type { ReactNode } from "react";
import { cn } from "~/lib/utils";

interface Props {
  propertyName: string;
  children: ReactNode;
  vertical?: boolean;
  className?: string;
  growName?: boolean;
}

export function Row({
  propertyName,
  children,
  vertical,
  className,
  growName,
}: Props) {
  return (
    <li
      className={cn(
        "flex gap-3 items-center",
        {
          "flex-col gap-1": vertical,
        },
        className,
      )}
    >
      <span
        className={cn(
          "w-16 flex-none text-slate-11 hover:text-slate-12 break-words",
          {
            "flex-1": growName,
          },
        )}
      >
        {propertyName}
      </span>
      {children}
    </li>
  );
}

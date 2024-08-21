import type { ReactNode } from "react";
import { Input, type InputProps } from "~/components/ui/input";
import { cn } from "~/lib/utils";

interface Props extends InputProps {
  left?: ReactNode;
}

export function InspectorInput({ left, className, ...props }: Props) {
  return (
    <div
      className={cn(
        "min-w-0 flex items-center gap-2 flex-1 text-xs rounded-md bg-input px-2 py-[0.125rem] shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-1 focus-within:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
    >
      {left}
      <input
        className="focus-visible:outline-none bg-transparent w-full h-fit"
        {...props}
      />
    </div>
  );
}

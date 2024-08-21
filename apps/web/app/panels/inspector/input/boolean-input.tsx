import { cn } from "~/lib/utils";
import { InspectorInput } from "./inspector-input";

interface Props {
  value: boolean;
  className?: string;
}

export function BooleanInput({ value, className }: Props) {
  return (
    <InspectorInput
      type="checkbox"
      className={cn(
        "size-fit flex-none p-0 rounded-md overflow-clip",
        className,
      )}
      inputClassName={cn(
        "size-4 appearance-none checked:bg-plum-8 checked:text-plum-12",
      )}
      checked={value}
    />
  );
}

import type { ReactNode } from "react";
import { InspectorInput } from "./inspector-input";
import { trimTrailingZero } from "~/lib/utils";

interface Props {
  value: number;
  displayName?: ReactNode;
  className?: string;
}

export function FloatInput({ value, displayName, className }: Props) {
  return (
    <InspectorInput
      className={className}
      left={displayName}
      value={trimTrailingZero(value, 2)}
    />
  );
}

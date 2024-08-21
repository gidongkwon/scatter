import type { ReactNode } from "react";
import { trimTrailingZero } from "~/lib/utils";
import { InspectorInput } from "./inspector-input";

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

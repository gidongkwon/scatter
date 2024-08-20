import type { ReactNode } from "react";

interface Props {
  propertyName: string;
  children: ReactNode;
}

export function Row({ propertyName, children }: Props) {
  return (
    <li className="flex gap-3">
      <span className="w-24">{propertyName}</span>
      <div className="min-w-0 break-words">{children}</div>
    </li>
  );
}

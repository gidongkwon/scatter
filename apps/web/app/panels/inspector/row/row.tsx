import type { ReactNode } from "react";

interface Props {
  propertyName: string;
  children: ReactNode;
}

export function Row({ propertyName, children }: Props) {
  return (
    <li className="flex gap-3 items-center">
      <span className="w-24">{propertyName}</span>
      {children}
    </li>
  );
}

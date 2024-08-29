import { cn } from "~/lib/utils";

export interface ComponentListProps {
  componentNames: string[];
  className?: string;
}

export function ComponentList({
  componentNames,
  className,
}: ComponentListProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <ul>
        {componentNames.map((name) => {
          return <li key={name}>{name}</li>;
        })}
      </ul>
      <button
        type="button"
        className="w-full rounded-md hover:bg-slate-2 text-slate-11 hover:text-slate-12 text-center border-2 border-slate-5 border-dashed"
      >
        + 컴포넌트 만들기
      </button>
    </div>
  );
}

// interface ComponentSchemaViewProps {
//   name: string;
// }

// function ComponentSchemaView({ name }: ComponentSchemaViewProps) {
//   return (
//     <section className="bg-slate-2 w-[200px] h-full rounded-md p-3">
//       <h3 className="text-sm">{name}</h3>
//       <main className="flex flex-col gap-2 mt-2 text-sm">
//         <ComponentSchemaRow propertyName="rotation" />
//         <ComponentSchemaRow propertyName="rotation" />
//       </main>
//     </section>
//   );
// }

// interface ComponentSchemaRowProps {
//   propertyName: string;
// }

// function ComponentSchemaRow({ propertyName }: ComponentSchemaRowProps) {
//   return (
//     <div className="flex gap-2 items-center">
//       <span>{propertyName}</span>
//       <div className="rounded-full px-2 py-1 bg-green-4 text-green-12 text-xs">
//         Number
//       </div>
//     </div>
//   );
// }

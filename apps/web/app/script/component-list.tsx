export function ComponentList() {
  return (
    <div className="w-full h-[200px] rounded-lg p-2 flex gap-2 border-[1px] border-slate-3">
      <ComponentSchemaView name="Transform" />
      <button
        type="button"
        className="w-[200px] rounded-md hover:bg-slate-2 text-slate-11 hover:text-slate-12 text-center border-2 border-slate-5 border-dashed"
      >
        + 컴포넌트 만들기
      </button>
    </div>
  );
}

interface ComponentSchemaViewProps {
  name: string;
}

function ComponentSchemaView({ name }: ComponentSchemaViewProps) {
  return (
    <section className="bg-slate-2 w-[200px] h-full rounded-md p-3">
      <h3 className="text-sm">{name}</h3>
      <main className="flex flex-col gap-2 mt-2 text-sm">
        <ComponentSchemaRow propertyName="rotation" />
        <ComponentSchemaRow propertyName="rotation" />
      </main>
    </section>
  );
}

interface ComponentSchemaRowProps {
  propertyName: string;
}

function ComponentSchemaRow({ propertyName }: ComponentSchemaRowProps) {
  return (
    <div className="flex gap-2 items-center">
      <span>{propertyName}</span>
      <div className="rounded-full px-2 py-1 bg-green-4 text-green-12 text-xs">
        Number
      </div>
    </div>
  );
}

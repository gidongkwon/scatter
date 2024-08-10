type JSONPrimitive = string | number | boolean | null | undefined;
type JSONValue =
  | JSONPrimitive
  | JSONValue[]
  | {
      [key: string]: JSONValue;
    };

type JSONCompatible<T> = unknown extends T
  ? never
  : {
      [P in keyof T]: T[P] extends JSONValue
        ? T[P]
        : T[P] extends NotAssignableToJson
          ? never
          : JSONCompatible<T[P]>;
    };

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type NotAssignableToJson = bigint | symbol | ((...args: any[]) => any);

// Component is serializable data
export type Component = JSONValue;
export type ComponentId = number;

export function serialzeComponent<T>(data: JSONCompatible<T>) {
  return JSON.stringify(data);
}

export function deserializeComponent(data: string): unknown {
  return JSON.parse(data);
}

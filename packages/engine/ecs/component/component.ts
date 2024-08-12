const INVALID_COMPONENT_ID = 0;

export type ComponentId = number;
export class Component {
  id: ComponentId = INVALID_COMPONENT_ID;

  serialize = () => {
    return JSON.stringify(this);
  };

  deserialize = (data: string) => {
    return JSON.parse(data);
  };
}

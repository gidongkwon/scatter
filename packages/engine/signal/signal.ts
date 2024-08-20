export class Signal<
  TData,
  THandler extends (data: TData) => void = (data: TData) => void,
> {
  handlers: THandler[] = [];

  register = (handler: THandler) => {
    this.handlers.push(handler);
  };

  emit = (data: TData) => {
    for (const handler of this.handlers) {
      handler(data);
    }
  };
}

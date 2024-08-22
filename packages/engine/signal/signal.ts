export class Signal<
  TData,
  THandler extends (data: TData) => void = (data: TData) => void,
> {
  handlers: THandler[] = [];

  register = (handler: THandler) => {
    this.handlers.push(handler);
  };

  unregister = (handler: THandler) => {
    const index = this.handlers.indexOf(handler);
    if (index > -1) {
      this.handlers.splice(index, 1);
    }
  };

  emit = (data: TData) => {
    for (const handler of this.handlers) {
      handler(data);
    }
  };
}

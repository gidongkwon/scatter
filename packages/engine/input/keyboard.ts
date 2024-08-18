import type { SystemContext } from "../ecs/system/system-context";

export class Keyboard {
  _pressedCodes: Set<string> = new Set();

  isPressed = (code: string) => {
    return this._pressedCodes.has(code);
  };
}

// phase: init
export function createKeyboardSystem(document: Document) {
  return (context: SystemContext) => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    document.addEventListener(
      "keydown",
      (e) => {
        context.keyboard._pressedCodes.add(e.code);
      },
      { signal },
    );

    document.addEventListener(
      "keyup",
      (e) => {
        context.keyboard._pressedCodes.delete(e.code);
      },
      { signal },
    );

    return () => {
      abortController.abort();
    };
  };
}

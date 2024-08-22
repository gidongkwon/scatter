import type { System, SystemPhase } from "../ecs/system/system";
import type { EngineSignals } from "../signal/engine-signals";
import type { Script } from "./script";

type ConversionErrorHandler = (error: unknown) => void;

/**
 * Source of truth of scripts.
 */
export class ScriptRegistry {
  #nameToScript: Map<string, Script> = new Map();

  constructor(private signals: EngineSignals) {}

  add(
    name: string,
    phase: SystemPhase,
    content: string,
    onError: ConversionErrorHandler,
  ) {
    this.tryConvertToFunction(
      content,
      (system) => {
        console.log(system);
        const script = {
          name,
          phase,
          content,
          system,
        };
        this.#nameToScript.set(name, script);
        this.signals.scriptAdded.emit({ script });
      },
      onError,
    );
  }

  has(name: string) {
    return this.#nameToScript.has(name);
  }

  update(name: string, content: string, onError: ConversionErrorHandler) {
    this.tryConvertToFunction(
      content,
      (system) => {
        const script = this.#nameToScript.get(name);
        if (script == null) {
          return;
        }
        script.content = content;
        const prevSystem = script.system;
        script.system = system;
        this.signals.scriptUpdated.emit({ script, prevSystem });
      },
      onError,
    );
  }

  remove(name: string) {
    const script = this.#nameToScript.get(name);
    if (script == null) {
      return;
    }
    this.signals.scriptRemoved.emit({ script });
    this.#nameToScript.delete(name);
  }

  tryConvertToFunction(
    content: string,
    onSuccess: (converted: System) => void,
    onError: (error: unknown) => void,
  ) {
    try {
      const converted = new Function("context", "read", "write", content);
      onSuccess(converted as System);
    } catch (e) {
      onError(e);
    }
  }
}

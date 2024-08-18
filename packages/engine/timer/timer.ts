import { assert } from "../utils/assert";

export type TimerOptions =
  | {
      type: "once";
    }
  | {
      type: "repeat";
      count: number;
    }
  | {
      type: "infinite";
    };

export class Timer {
  elapsed = 0;
  finished = false;
  enabled = true;
  segmentFinished = false;
  options: TimerOptions;
  optionsOrigin: TimerOptions;

  constructor(
    public duration: number,
    options: TimerOptions,
  ) {
    this.options = { ...options };
    this.optionsOrigin = { ...options };
  }

  tick = (deltaTime: number) => {
    if (!this.enabled) {
      return;
    }

    this.elapsed += deltaTime;
    if (this.elapsed >= this.duration) {
      switch (this.options.type) {
        case "once": {
          this.finished = true;
          this.enabled = false;
          break;
        }
        case "repeat": {
          this.options.count -= 1;
          if (this.options.count <= 0) {
            this.finished = true;
            this.enabled = false;
          }
          break;
        }
        case "infinite": {
          // do nothing
        }
      }

      this.segmentFinished = true;
      this.elapsed -= this.duration;
    } else {
      this.segmentFinished = false;
    }
  };

  reset = () => {
    this.elapsed = 0;
    this.segmentFinished = false;
    this.finished = false;
    this.enabled = true;
    if (this.options.type === "repeat") {
      assert(this.optionsOrigin.type === "repeat");
      this.options.count = this.optionsOrigin.count;
    }
  };

  setOptions = (options: TimerOptions) => {
    this.options = { ...options };
    this.optionsOrigin = { ...options };
  };
}

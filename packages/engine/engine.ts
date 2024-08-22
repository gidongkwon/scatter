import { createProgramFromSources } from "./2d/gl";
import { type ProgramInfo, fragment, vertex } from "./2d/shader";
import { createSpriteRenderSystem } from "./2d/sprite-render-system";
import { Assets } from "./assets";
import { World } from "./ecs/world";
import { createKeyboardSystem } from "./input/keyboard";
import { EngineSignals } from "./signal/engine-signals";
import { resizeCanvasToDisplaySize } from "./utils/canvas";

export class Engine {
  initialized = false;

  world: World;
  gl: WebGL2RenderingContext;
  assets: Assets;
  signals: EngineSignals = new EngineSignals();

  // renderer
  programInfo!: ProgramInfo;
  quadVAO!: WebGLVertexArrayObject;

  // fps/time tracking
  private _then = 0;
  private _frameTimes: number[] = [];
  private _frameCursor = 0;
  private _frameCounts = 0;
  private _framesToAverage = 20;
  private _totalFPS = 0;
  averageFPS = 0;
  private _rafHandle = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.world = new World(this.signals);
    const context = canvas.getContext("webgl2", { alpha: false });
    if (!context) {
      throw new Error("WebGL2 is not available.");
    }
    this.gl = context;
    this.assets = new Assets(this.gl);

    this.initRenderer();
    this.initDefaultSystems();
  }

  run = () => {
    // Init moved to render due to canvas resize delay.
    // this.world.callInitSystems();
    this._rafHandle = requestAnimationFrame(this.step);
  };

  cleanup = () => {
    this.world.cleanup();
    cancelAnimationFrame(this._rafHandle);
  };

  private initRenderer = () => {
    const gl = this.gl;

    const program = createProgramFromSources(gl, [vertex, fragment]);
    if (program == null) {
      throw new Error("Creating WebGL2 program failed.");
    }

    this.programInfo = {
      program,
      attribLocations: {
        position: gl.getAttribLocation(program, "a_position"),
        texCoord: gl.getAttribLocation(program, "a_texCoord"),
      },
      uniformLocations: {
        // biome-ignore lint/style/noNonNullAssertion: should have
        matrix: gl.getUniformLocation(program, "u_matrix")!,
        // biome-ignore lint/style/noNonNullAssertion: should have
        texture: gl.getUniformLocation(program, "u_texture")!,
        // biome-ignore lint/style/noNonNullAssertion: should have
        textureMatrix: gl.getUniformLocation(program, "u_textureMatrix")!,
      },
    };

    // biome-ignore lint/style/noNonNullAssertion: should have
    this.quadVAO = gl.createVertexArray()!;
    gl.bindVertexArray(this.quadVAO);
    const positionBuffer = gl.createBuffer();
    gl.enableVertexAttribArray(this.programInfo.attribLocations.position);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    gl.vertexAttribPointer(
      this.programInfo.attribLocations.position,
      2,
      gl.FLOAT,
      false,
      0,
      0,
    );

    const texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0,
      ]),
      gl.STATIC_DRAW,
    );
    gl.enableVertexAttribArray(this.programInfo.attribLocations.texCoord);
    gl.vertexAttribPointer(
      this.programInfo.attribLocations.texCoord,
      2,
      gl.FLOAT,
      false,
      0,
      0,
    );

    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  };

  private initDefaultSystems = () => {
    this.world.addSystem("init", createKeyboardSystem(document));

    const Transform = this.world.registerComponent("@scatter/Transform");
    const Sprite = this.world.registerComponent("@scatter/Sprite");
    const spriteRenderSystem = createSpriteRenderSystem(
      [Transform, Sprite],
      this,
    );
    this.world.addSystem("render", spriteRenderSystem);
  };

  private step: FrameRequestCallback = (time) => {
    const now = time / 1000;
    const deltaTime = Math.min(0.1, now - this._then);
    this._then = now;

    const fps = 1 / deltaTime;

    this._totalFPS += fps - (this._frameTimes[this._frameCursor] ?? 0);
    this._frameTimes[this._frameCursor] = fps;
    this._frameCursor++;
    this._frameCounts = Math.max(this._frameCounts, this._frameCursor);
    this._frameCursor %= this._framesToAverage;
    this.averageFPS = this._totalFPS / this._frameCounts;

    this.update(deltaTime);
    this.render();

    this._rafHandle = requestAnimationFrame(this.step);
  };

  private update = (deltaTime: number) => {
    this.world.update(deltaTime);
  };

  private render = () => {
    resizeCanvasToDisplaySize(this.gl.canvas as HTMLCanvasElement);

    this.world.context._updateStageSize(
      this.gl.canvas.width,
      this.gl.canvas.height,
    );

    if (!this.initialized) {
      this.world.callInitSystems();
      this.initialized = true;
    }

    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clearColor(0, 0, 0, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.world.render();
  };
}

import { Assets, TextureInfo } from "./assets";
import { createProgramFromSources } from "./gl";
import { fragment, vertex } from "./shader";
import { Mat4 } from "gl-matrix";

interface Sprite {
  x: number;
  y: number;
  dx: number;
  dy: number;
  scaleX: number;
  scaleY: number;
  offX: number;
  offY: number;
  rotation: number;
  deltaRotation: number;
  width: number,
  height: number,
  textureInfo: TextureInfo,
}

export class Scatter {

  public assets: Assets;
    
  private gl: WebGL2RenderingContext;

  // 사각형 렌더링을 위한 구성요소들
  private program: WebGLProgram;
  private quadVAO: WebGLVertexArrayObject;
  private matrixUniformLocation: WebGLUniformLocation;
  private textureUniformLocation: WebGLUniformLocation;
  private textureMatrixUniformLocation: WebGLUniformLocation;

  private sprites: Sprite[];

  private _then = 0;
  private _frameTimes: number[] = [];
  private _frameCursor = 0;
  private _frameCounts = 0;
  private _framesToAverage = 20;
  private _totalFPS = 0;


  constructor(
    public canvas: HTMLCanvasElement,
    public fpsElement: HTMLSpanElement
  ) {
    const context = canvas.getContext('webgl2');
    if (!context) {
      throw new Error('WebGL2 is not available.');
    }
    this.gl = context;
    this.assets = new Assets(this.gl);

    const gl = this.gl;

    this.program = createProgramFromSources(gl, [vertex, fragment])!;
    const positionAttribLocation = gl.getAttribLocation(this.program, 'a_position');
    const texCoordAttribLocation = gl.getAttribLocation(this.program, 'a_texCoord');
    this.matrixUniformLocation = gl.getUniformLocation(this.program, 'u_matrix')!;
    this.textureUniformLocation = gl.getUniformLocation(this.program, 'u_texture')!;
    this.textureMatrixUniformLocation = gl.getUniformLocation(this.program, 'u_textureMatrix')!;
    
    this.quadVAO = gl.createVertexArray()!;
    gl.bindVertexArray(this.quadVAO);
    const positionBuffer = gl.createBuffer();
    gl.enableVertexAttribArray(positionAttribLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      0, 0,
      0, 1,
      1, 0,
      1, 0,
      0, 1,
      1, 1,
    ]), gl.STATIC_DRAW);
    gl.vertexAttribPointer(positionAttribLocation, 2, gl.FLOAT, false, 0, 0);

    const texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      0.0,  0.0,
      1.0,  0.0,
      0.0,  1.0,
      0.0,  1.0,
      1.0,  0.0,
      1.0,  1.0,
    ]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(texCoordAttribLocation);
    gl.vertexAttribPointer(texCoordAttribLocation, 2, gl.FLOAT, false, 0, 0);

    const texture = this.assets.loadImage('http://localhost:3000/leaves.jpg');

    this.sprites = [];
    for (let i = 0; i < 10000; i++) {
      const scale = Math.random() * 0.1 + 0.1;
      this.sprites.push({
        x: Math.random() * gl.canvas.width,
        y: Math.random() * gl.canvas.height,
        dx: Math.random() * 0.5 ? -1 : 1,
        dy: Math.random() * 0.5 ? -1 : 1,
        scaleX: scale,
        scaleY: scale,
        offX: 0,
        offY: 0,
        rotation: Math.random() * Math.PI * 2,
        deltaRotation: (0.5 + Math.random() * 0.5) * (Math.random() > 0.5 ? -1 : 1),
        width: 1,
        height: 1,
        textureInfo: texture,
      })
    }

    requestAnimationFrame(this.step);
  }

  step: FrameRequestCallback = (time) => {
    const now = time / 1000;
    const deltaTime = Math.min(0.1, now - this._then);
    this._then = now;

    const fps = 1 / deltaTime;
    
    this._totalFPS += fps - (this._frameTimes[this._frameCursor] ?? 0);
    this._frameTimes[this._frameCursor] = fps;
    this._frameCursor++;
    this._frameCounts = Math.max(this._frameCounts, this._frameCursor);
    this._frameCursor %= this._framesToAverage;
    const averageFPS = this._totalFPS / this._frameCounts;
    
    this.fpsElement.textContent = `FPS: ${(averageFPS).toFixed(1)}`;
    

    this.update(deltaTime);
    this.render();

    requestAnimationFrame(this.step);
  }

  update = (deltaTime: number) => {
    const speed = 120;

    for (const sprite of this.sprites) {
      sprite.x += speed * sprite.dx * deltaTime;
      sprite.y += speed * sprite.dy * deltaTime;

      if (sprite.x < 0) {
        sprite.dx = 1
      }
      if (sprite.x + sprite.textureInfo.width * sprite.scaleX > this.gl.canvas.width) {
        sprite.dx = -1;
      }
      if (sprite.y < 0) {
        sprite.dy = 1;
      }
      if (sprite.y + sprite.textureInfo.height * sprite.scaleY > this.gl.canvas.height) {
        sprite.dy = -1;
      }
    }
  }

  render = () => {
    this.resizeCanvasToDisplaySize(this.gl.canvas as HTMLCanvasElement);

    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    
    for (const sprite of this.sprites) {
      const dstX = sprite.x;
      const dstY = sprite.y;
      const dstWidth = sprite.textureInfo.width * sprite.scaleX;
      const dstHeight = sprite.textureInfo.height * sprite.scaleY;
      const srcX = sprite.textureInfo.width * sprite.offX;
      const srcY = sprite.textureInfo.height * sprite.offY;
      const srcWidth = sprite.textureInfo.width * sprite.width;
      const srcHeight = sprite.textureInfo.height * sprite.height;

      this.drawImage(
        sprite.textureInfo.texture,
        sprite.textureInfo.width,
        sprite.textureInfo.height,
        dstX, dstY, dstWidth, dstHeight,
        srcX, srcY, srcWidth, srcHeight,
        // sprite.rotation
        )
    }
  }

  drawImage = (
    texture: WebGLTexture, textureWidth: number, textureHeight: number,
    dstX: number, dstY: number,
    dstWidth?: number, dstHeight?: number,
    srcX?: number, srcY?: number,
    srcWidth?: number, srcHeight?: number,
    srcRotation?: number) => {

    this.gl.useProgram(this.program);
    this.gl.bindVertexArray(this.quadVAO);

    const textureUnit = 0;
    this.gl.uniform1i(this.textureUniformLocation, textureUnit);
    this.gl.activeTexture(this.gl.TEXTURE0 + textureUnit);
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

    let matrix = Mat4.create();
    Mat4.orthoNO(matrix, 0, this.gl.canvas.width, this.gl.canvas.height, 0, -1, 1);
    
    // let matrix = Matrix4.orthographic(0, this.gl.canvas.width, this.gl.canvas.height, 0, -1, 1);

    // (dstX, dstY)로 이동
    matrix.translate([dstX, dstY, 0]);

    // (0~1, 0~1)의 texture space에서 (0~w, 0~h)의 pixel space로 변환
    matrix.scale([dstWidth ?? textureWidth, dstHeight ?? textureHeight, 1]);
    
    // matrix 적용
    this.gl.uniformMatrix4fv(this.matrixUniformLocation, false, matrix);

    let textureMatrix = Mat4.create();
    Mat4.fromScaling(textureMatrix, [1 / textureWidth, 1 / textureHeight, 1]);
    const halfWidth = textureWidth * 0.5;
    const halfHeight = textureHeight * 0.5;
    textureMatrix.translate([halfWidth, halfHeight, 0]);
    textureMatrix.rotateZ(srcRotation ?? 0);
    textureMatrix.translate([-halfWidth, -halfHeight, 0]);

    textureMatrix.translate([srcX ?? 0, srcY ?? 0, 0]);
    textureMatrix.scale([srcWidth ?? textureWidth, srcHeight ?? textureHeight, 1]);

    this.gl.uniformMatrix4fv(this.textureMatrixUniformLocation, false, textureMatrix);

    // quad 그리기
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
  }

  resizeCanvasToDisplaySize = (canvas: HTMLCanvasElement, multiplier: number = 1) => {
    const width  = canvas.clientWidth  * multiplier | 0;
    const height = canvas.clientHeight * multiplier | 0;
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width  = width;
      canvas.height = height;
      return true;
    }
    return false;
  }
}

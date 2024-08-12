import { Mat4 } from "gl-matrix";
import type { ProgramInfo } from "./shader";

export function drawImage(
  gl: WebGL2RenderingContext,
  programInfo: ProgramInfo,
  quadVAO: WebGLVertexArrayObject,
  texture: WebGLTexture,
  textureWidth: number,
  textureHeight: number,
  dstX: number,
  dstY: number,
  dstWidth?: number,
  dstHeight?: number,
  srcX?: number,
  srcY?: number,
  srcWidth?: number,
  srcHeight?: number,
  srcRotation?: number,
) {
  gl.useProgram(programInfo.program);
  gl.bindVertexArray(quadVAO);

  const textureUnit = 0;
  gl.uniform1i(programInfo.uniformLocations.texture, textureUnit);
  gl.activeTexture(gl.TEXTURE0 + textureUnit);
  gl.bindTexture(gl.TEXTURE_2D, texture);

  const matrix = Mat4.create();
  Mat4.orthoNO(matrix, 0, gl.canvas.width, gl.canvas.height, 0, -1, 1);

  // let matrix = Matrix4.orthographic(0, gl.canvas.width, gl.canvas.height, 0, -1, 1);

  // (dstX, dstY)로 이동
  matrix.translate([dstX, dstY, 0]);

  // (0~1, 0~1)의 texture space에서 (0~w, 0~h)의 pixel space로 변환
  matrix.scale([dstWidth ?? textureWidth, dstHeight ?? textureHeight, 1]);

  // matrix 적용
  gl.uniformMatrix4fv(programInfo.uniformLocations.matrix, false, matrix);

  const textureMatrix = Mat4.create();
  Mat4.fromScaling(textureMatrix, [1 / textureWidth, 1 / textureHeight, 1]);
  const halfWidth = textureWidth * 0.5;
  const halfHeight = textureHeight * 0.5;
  textureMatrix.translate([halfWidth, halfHeight, 0]);
  textureMatrix.rotateZ(srcRotation ?? 0);
  textureMatrix.translate([-halfWidth, -halfHeight, 0]);

  textureMatrix.translate([srcX ?? 0, srcY ?? 0, 0]);
  textureMatrix.scale([
    srcWidth ?? textureWidth,
    srcHeight ?? textureHeight,
    1,
  ]);

  gl.uniformMatrix4fv(
    programInfo.uniformLocations.textureMatrix,
    false,
    textureMatrix,
  );

  // quad 그리기
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

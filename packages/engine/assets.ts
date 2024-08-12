export interface TextureInfo {
  width: number;
  height: number;
  texture: WebGLTexture;
}

export class Assets {
  constructor(private gl: WebGL2RenderingContext) {}
  loadImage = (url: string): TextureInfo => {
    const texture = this.gl.createTexture();
    if (texture == null) {
      throw Error("createTexture() failed.");
    }
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

    // Fill the texture with a 1x1 blue pixel.
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA,
      1,
      1,
      0,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      new Uint8Array([0, 0, 255, 255]),
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_S,
      this.gl.CLAMP_TO_EDGE,
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_T,
      this.gl.CLAMP_TO_EDGE,
    );

    const textureInfo: TextureInfo = {
      width: 1,
      height: 1,
      texture,
    };
    const image = new Image();
    image.addEventListener("load", () => {
      textureInfo.width = image.width;
      textureInfo.height = image.height;

      this.gl.bindTexture(this.gl.TEXTURE_2D, textureInfo.texture);
      this.gl.texImage2D(
        this.gl.TEXTURE_2D,
        0,
        this.gl.RGBA,
        this.gl.RGBA,
        this.gl.UNSIGNED_BYTE,
        image,
      );
      this.gl.generateMipmap(this.gl.TEXTURE_2D);
    });

    image.src = url;
    return textureInfo;
  };
}

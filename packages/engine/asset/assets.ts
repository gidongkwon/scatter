export interface TextureInfo {
  url: string;
  width: number;
  height: number;
  texture: WebGLTexture;
}

export class Assets {
  #nameToLoadingTexture: Map<string, Promise<TextureInfo>> = new Map();
  #nameToTexture: Map<string, TextureInfo> = new Map();

  constructor(private gl: WebGL2RenderingContext) {}

  loadImage = (name: string, url: string): Promise<TextureInfo> => {
    const loadPromise = new Promise<TextureInfo>((resolve, reject) => {
      const texture = this.gl.createTexture();
      if (texture == null) {
        reject("createTexture() failed.");
        return;
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
        url,
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

        this.#nameToLoadingTexture.delete(name);
        this.#nameToTexture.set(name, textureInfo);
        resolve(textureInfo);
      });
      image.src = url;
    });

    this.#nameToLoadingTexture.set(name, loadPromise);
    return loadPromise;
  };

  texture = (name: string) => {
    return this.#nameToTexture.get(name);
  };

  textures = () => {
    return [...this.#nameToTexture.values()];
  };
}

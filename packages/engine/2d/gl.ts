export function createProgram(
  gl: WebGL2RenderingContext,
  shaders: WebGLShader[],
  attribs?: string[],
  locations?: number[],
) {
  const program = gl.createProgram();
  if (program == null) {
    return null;
  }

  for (const shader of shaders) {
    gl.attachShader(program, shader);
  }

  if (attribs) {
    attribs.forEach((attrib, index) => {
      gl.bindAttribLocation(
        program,
        locations ? locations[index] : index,
        attrib,
      );
    });
  }
  gl.linkProgram(program);

  // Check the link status
  const linked = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!linked) {
    // something went wrong with the link
    const lastError = gl.getProgramInfoLog(program);
    console.error(
      `Error in program linking: ${lastError}\n${shaders
        .map((shader) => {
          // biome-ignore lint/style/noNonNullAssertion: linking error involves shader source
          const src = addLineNumbersWithError(gl.getShaderSource(shader)!);
          const type = gl.getShaderParameter(shader, gl.SHADER_TYPE);
          return `${type}:\n${src}`;
        })
        .join("\n")}`,
    );

    gl.deleteProgram(program);
    return null;
  }
  return program;
}

const defaultShaderType = ["VERTEX_SHADER", "FRAGMENT_SHADER"] as const;

function createShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string,
) {
  const shader = gl.createShader(type);
  if (shader == null) {
    throw Error("createShader() failed.");
  }
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
  throw Error("getShaderParameter() failed.");
}

export function createProgramFromSources(
  gl: WebGL2RenderingContext,
  shaderSources: string[],
  attribs?: string[],
  locations?: number[],
) {
  const shaders = shaderSources.map((source, index) => {
    return createShader(gl, gl[defaultShaderType[index]], source);
  });

  return createProgram(gl, shaders, attribs, locations);
}

const errorRE = /ERROR:\s*\d+:(\d+)/gi;
function addLineNumbersWithError(src: string, log = "") {
  // Note: Error message formats are not defined by any spec so this may or may not work.
  const matches = [...log.matchAll(errorRE)];
  const lineNoToErrorMap = new Map(
    matches.map((m, ndx) => {
      const lineNo = Number.parseInt(m[1]);
      const next = matches[ndx + 1];
      const end = next ? next.index : log.length;
      const msg = log.substring(m.index ?? 0, end);
      return [lineNo - 1, msg];
    }),
  );
  return src
    .split("\n")
    .map((line, lineNo) => {
      const err = lineNoToErrorMap.get(lineNo);
      return `${lineNo + 1}: ${line}${err ? `\n\n^^^ ${err}` : ""}`;
    })
    .join("\n");
}

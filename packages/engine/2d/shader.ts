export const vertex = /* glsl */ `#version 300 es

in vec4 a_position;
in vec2 a_texCoord;

uniform mat4 u_matrix;
uniform mat4 u_textureMatrix;

out vec2 v_texCoord;

void main() {
  gl_Position = u_matrix * a_position;
  v_texCoord = (u_textureMatrix * vec4(a_texCoord, 0, 1)).xy;
}
`;

export const fragment = /* glsl */ `#version 300 es
precision highp float;

in vec2 v_texCoord;

uniform sampler2D u_texture;

out vec4 outColor;

void main() {
  outColor = texture(u_texture, v_texCoord);
}
`;

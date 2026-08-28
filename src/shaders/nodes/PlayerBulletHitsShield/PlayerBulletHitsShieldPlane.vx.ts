export const PLAYER_BULLET_HITS_SHIELD_PLANE_VX = `
    precision highp float;

    attribute vec3 position;
    attribute vec2 uv;

    uniform mat4 worldViewProjection;

    varying vec2 vUV;

    void main(void) {
        gl_Position = worldViewProjection * vec4(position, 1.1);
        vUV = uv;
    }
`;

export const PLAYER_DESTROY_BLOOM_FX = `
    precision highp float;

    varying vec2 vUV;
    uniform sampler2D iChannel0;

    void main() {
        vec3 color = texture2D(iChannel0, vUV).rgb;

        gl_FragColor = vec4(color, 1.0);
    }
`;

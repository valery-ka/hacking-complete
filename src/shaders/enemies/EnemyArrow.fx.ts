export const ENEMY_ARROW_FRAGMENT_SHADER = `
    precision highp float;

    varying vec2 vUV;

    void main() {
        gl_FragColor = vec4(0.24, 0.24, 0.24, 1.0);
    }
`;

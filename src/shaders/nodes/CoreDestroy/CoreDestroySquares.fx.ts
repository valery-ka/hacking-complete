export const CORE_DESTROY_SQUARES_FX = `
    precision highp float;

    varying vec2 vUV;
    uniform float progress;
    uniform int smoothFlag;
    uniform vec3 color;

    vec3 RED = vec3(1.0, 0.12, 0.0);

    float rand(vec2 co) {
        return fract(sin(dot(co,vec2(12.99,78.23)))*43758.5453);
    }

    void main() {
        vec2 uv = (vUV - 0.5) / mix(1.0, 1.025, progress) + 0.5;
        if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) discard;

        vec2 coord = floor(uv / 0.025);
        float r = rand(coord);

        float alpha = 0.0;
        if (r > 0.6) {
            float op[4] = float[4](0.25, 0.5, 0.75, 1.0);
            alpha = op[int((r - 0.5) * 8.0)];
        }

        alpha *= 1.0 - smoothstep(0.50, 1.0, length(vUV * 2.0 - 1.0));
        alpha *= 1.0 - smoothstep(0.25, 1.0, progress);

        if (alpha < 0.01) discard;

        vec3 color = color;

        if (smoothFlag == 1) {
            float t = smoothstep(0.0, 0.50, progress);
            color = mix(RED, color, t);
        }

        gl_FragColor = vec4(color, alpha);
    }
`;

export const PAEBC_RING_FX = `
    precision highp float;

    varying vec2 vUV;
    uniform float progress;

    void main() {
        vec2 uv = vUV * 2.0 - 1.0;

        float maxRadius = 1.0;
        float glow = 0.01;
        float fadeStart = 0.3;

        float radius = mix(0.2, maxRadius, progress);

        float dist = length(uv);

        float alpha = exp(-pow((dist - radius) / glow, 2.0));

        if (progress > fadeStart) {
            float fade = 1.0 - (progress - fadeStart) / (1.0 - fadeStart);
            alpha *= clamp(fade, 0.0, 1.0);
        }

        if (alpha < 0.01) discard;

        vec3 color = vec3(1.0, 0.98, 0.95);
        color += alpha * 0.075;

        gl_FragColor = vec4(color, alpha);
    }
`;

export const CORE_DESTROY_RING_FX = `
    precision highp float;

    varying vec2 vUV;
    uniform float progress;

    void main() {
        vec2 uv = vUV * 2.0 - 1.0;

        float maxRadius = 0.90;
        float ringThickness = 0.0015;

        float radius = mix(0.1, maxRadius, progress);

        float dist = length(uv);
        
        float alpha = 1.0 - smoothstep(ringThickness * 0.5, ringThickness * 1.5, abs(dist - radius));

        if (alpha < 0.01) discard;

        vec3 color = vec3(0.0);

        gl_FragColor = vec4(color, alpha);
    }
`;

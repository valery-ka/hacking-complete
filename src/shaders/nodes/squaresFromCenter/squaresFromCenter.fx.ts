export const SQUARES_FROM_CENTER_FX = `
    precision highp float;

    varying vec2 vUV;

    uniform vec3 color;

    uniform float progress;
    uniform float effectSeed; 
    uniform float uSpeed;
    uniform float uSize;

    uniform int amount;

    vec2 rotate(vec2 uv, vec2 center, float a) {
        vec2 d = uv - center;
        float cs = cos(a);
        float sn = sin(a);
        return center + vec2(d.x * cs - d.y * sn, d.x * sn + d.y * cs);
    }

    float square(vec2 uv, vec2 center, float size) {
        vec2 d = abs(uv - center);
        return step(d.x, size) * step(d.y, size);
    }

    float hash(float n) { return fract(sin(n) * 43758.5453123); }

    void main() {
        vec2 uv = vUV;
        vec4 finalColor = vec4(0.0);
        vec2 center = vec2(0.5, 0.5);

        float fadeStart = 0.75;
        float fadeEnd = 1.0;
        float fadeFactor = smoothstep(fadeEnd, fadeStart, progress);

        for (int i = 0; i < amount; i++) {
            float seed = float(i) + effectSeed;

            float angle = hash(seed * 12.34) * 6.2831;
            float size = uSize + hash(seed * 56.78) * uSize;
            float speed = uSpeed + hash(seed * 34.56) * 0.1;
            float radius = progress * speed;
            vec2 offset = vec2(cos(angle), sin(angle)) * radius;

            float rotationSpeed = hash(seed * 78.9) * 2.0;
            float rotation = rotationSpeed * progress;
            vec2 rotatedUV = rotate(uv, center + offset, rotation);

            float sq = square(rotatedUV, center + offset, size);

            finalColor += vec4(color, sq * fadeFactor);
        }

        if (finalColor.a < 0.01) discard;
        gl_FragColor = finalColor;
    }
`;

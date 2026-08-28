export const ENEMY_DESTROY_SPARKLES_FX = `
    precision highp float;

    varying vec2 vUV;

    uniform float time;
    uniform float progress;

    const int   STRIPE_COUNT  =     6;
    const float STRIPE_WIDTH  =     0.0025;
    const float MIN_STRIPE_LENGTH = 0.050;
    const float MAX_STRIPE_LENGTH = 0.150;

    float random(float seed) {
        return fract(sin(seed) * 43758.5453);
    }

    float randomRange(float seed, float min, float max) {
        return min + random(seed) * (max - min);
    }

    void main() {
        vec2 uv = vUV * 2.0 - 1.0;
        float angle = atan(uv.y, uv.x);
        float dist  = length(uv);

        if (angle < 0.0) angle += 6.28318530718;

        float sector = floor(angle / (6.28318530718 / float(STRIPE_COUNT)));
        float baseAngle = sector * (6.28318530718 / float(STRIPE_COUNT));

        float randomLength = randomRange(sector + time, MIN_STRIPE_LENGTH, MAX_STRIPE_LENGTH);
        float randomAngleOffset = randomRange(sector * 10.0 + time, -0.002, 0.002);
        baseAngle += randomAngleOffset;

        float randomStartOffset = randomRange(sector * 3.1 + time * 0.5, -0.05, 0.05);

        float explodeSpeed = randomRange(sector * 5.77 + time * 0.2, 0.1, 1.0);

        float radiusMin = progress * explodeSpeed + randomStartOffset;
        float radiusMax = radiusMin + randomLength;

        float correctedAngle = abs(angle - baseAngle);
        if (correctedAngle > STRIPE_WIDTH) discard;

        if (dist < radiusMin || dist > radiusMax) discard;

        float alpha = 1.0 - smoothstep(0.7, 1.0, progress);
        if (alpha < 0.01) discard;

        gl_FragColor = vec4(0.0, 0.0, 0.0, alpha);
    }
`;

export const SPHERE_BOMB_DESTROY_FX = `
    precision highp float;

    varying vec2 vUV;
    uniform float progress;

    vec3 ringColor = vec3(1.0, 0.05, 0.00);

    struct Ring {
        float innerRadius;
        float outerRadius;
        float innerGlow;
        float outerGlow;
        vec3  color;
        float alpha;
    };

    float computeRingAlpha(vec2 uv, Ring ring) {
        float dist = length(uv);
        float aInner = smoothstep(ring.innerRadius - ring.innerGlow, ring.innerRadius + ring.innerGlow, dist);
        float aOuter = 1.0 - smoothstep(ring.outerRadius - ring.outerGlow, ring.outerRadius + ring.outerGlow, dist);
        return aInner * aOuter * ring.alpha;
    }

    float getAlphaForProgress1(float p) {
        return 1.0 - smoothstep(0.0, 1.0, p);
    }

    float getAlphaForProgress2(float p) {
        return 1.0 - smoothstep(0.75, 1.0, p);
    }

    void main() {
        vec2 uv = vUV * 2.0 - 1.0;

        Ring ring1;
        ring1.innerRadius = 0.7 * progress;
        ring1.outerRadius = 0.9 * progress;
        ring1.innerGlow   = 1.5;
        ring1.outerGlow   = 0.2;
        ring1.color       = ringColor;
        ring1.alpha       = 2.0;

        Ring ring2;
        ring2.innerRadius = 0.95 * progress;
        ring2.outerRadius = 1.0 * progress;
        ring2.innerGlow   = 0.0;
        ring2.outerGlow   = 0.0;
        ring2.color       = ringColor;
        ring2.alpha       = 1.0;

        float a1 = computeRingAlpha(uv, ring1) * getAlphaForProgress1(progress);
        float a2 = computeRingAlpha(uv, ring2) * getAlphaForProgress2(progress);

        vec3 color = ring1.color * a1 + ring2.color * a2;
        float alpha = a1 + a2;

        if (alpha < 0.01) discard;

        gl_FragColor = vec4(color, alpha);
    }
`;

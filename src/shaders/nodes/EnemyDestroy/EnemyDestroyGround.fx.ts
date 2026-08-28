export const ENEMY_DESTROY_GROUND_FX = `
    precision highp float;

    varying vec2 vUV;
    uniform float progress;

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

        float aInner = smoothstep(
            ring.innerRadius - ring.innerGlow,
            ring.innerRadius + ring.innerGlow,
            dist
        );

        float aOuter = 1.0 - smoothstep(
            ring.outerRadius - ring.outerGlow,
            ring.outerRadius + ring.outerGlow,
            dist
        );

        return aInner * aOuter * ring.alpha;
    }

    vec3 getColorForProgressR1(float p) {
        return vec3(0.0);
    }

    vec3 getColorForProgressR2(float p) {
        if (p < 0.2) return vec3(1.00);
        if (p < 0.4) return vec3(1.00);
        if (p < 0.5) return vec3(0.50);
        if (p < 0.6) return vec3(0.25);
        if (p < 0.9) return vec3(0.00);
        return              vec3(0.00);
    }

    float getAlphaForProgress(float p) {
        if (p < 0.2) return 0.6;
        if (p < 0.4) return 1.0;
        if (p < 0.6) return 1.0;
        if (p < 0.7) return 0.75;
        if (p < 0.8) return 0.5;
        if (p < 0.9) return 0.25;
        return              0.0;
    }

    float getGlowForProgress(float p) {
        if (p < 0.2) return 0.1;
        if (p < 0.4) return 0.2;
        if (p < 0.6) return 0.3;
        if (p < 0.7) return 0.4;
        if (p < 0.8) return 0.5;
        if (p < 0.9) return 0.6;
        return              0.7;
    }

    void main() {
        vec2 uv = vUV * 2.0 - 1.0;

        Ring ring1;
        ring1.innerRadius = 0.79 * progress;
        ring1.outerRadius = 0.80 * progress;
        ring1.innerGlow   = getGlowForProgress(progress);
        ring1.outerGlow   = 0.0;
        ring1.color       = getColorForProgressR1(progress);
        ring1.alpha       = getAlphaForProgress(progress);

        float start2 = 0.2;
        float end2   = 1.0;

        float p2 = clamp((progress - start2) / (end2 - start2), 0.0, 1.0);

        float ring2Radius    = p2;
        float ring2Thickness = 0.005;

        Ring ring2;
        ring2.innerRadius = ring2Radius - ring2Thickness * 0.5;
        ring2.outerRadius = ring2Radius + ring2Thickness * 0.5;
        ring2.innerGlow   = 0.0;
        ring2.outerGlow   = 0.0;
        ring2.color       = getColorForProgressR2(progress);
        ring2.alpha       = 2.0;

        float alpha = 0.0;
        vec3 color  = vec3(0.0);

        float a1 = computeRingAlpha(uv, ring1);
        alpha += a1;
        color += ring1.color * a1;

        float a2 = computeRingAlpha(uv, ring2);
        alpha += a2;
        color += ring2.color * a2;

        float fade = 1.0 - smoothstep(0.85, 1.0, progress);
        alpha *= fade;
        color *= fade;

        if (alpha < 0.01) discard;

        gl_FragColor = vec4(color, alpha);
    }
`;

export const CYLINDER_BOMB_DESTROY_FX = `
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

    float getAlphaForProgress1(float p) {
        if (p < 0.2) return 0.40;
        if (p < 0.4) return 0.80;
        if (p < 0.6) return 0.80;
        if (p < 0.7) return 0.55;
        if (p < 0.8) return 0.30;
        if (p < 0.9) return 0.15;
        return              0.00;
    }

    float getAlphaForProgress2(float p) {
        float factor = 1.25;
        if (p * factor < 0.2) return 0.6;
        if (p * factor < 0.4) return 1.0;
        if (p * factor < 0.6) return 1.0;
        if (p * factor < 0.7) return 0.75;
        if (p * factor < 0.8) return 0.5;
        if (p * factor < 0.9) return 0.25;
        return              0.0;
    }

    float getAlphaForProgress3(float p) {
        float factor = 1.5;
        if (p * factor < 0.2) return 0.6;
        if (p * factor < 0.4) return 1.0;
        if (p * factor < 0.6) return 1.0;
        if (p * factor < 0.7) return 1.0;
        if (p * factor < 0.8) return 0.5;
        if (p * factor < 0.9) return 0.25;
        return              0.0;
    }

    float getGlowForProgress12(float p) {
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
        ring1.innerGlow   = getGlowForProgress12(progress);
        ring1.outerGlow   = 0.0;
        ring1.color       = vec3(0.0);
        ring1.alpha       = getAlphaForProgress1(progress);

        Ring ring2;
        ring2.innerRadius = 0.29 * progress;
        ring2.outerRadius = 0.30 * progress;
        ring2.innerGlow   = getGlowForProgress12(progress);
        ring2.outerGlow   = 0.0;
        ring2.color       = vec3(0.0);
        ring2.alpha       = getAlphaForProgress2(progress);

        Ring ring3;
        ring3.innerRadius = 0.49 * progress;
        ring3.outerRadius = 0.50 * progress;
        ring3.innerGlow   = 0.06;
        ring3.outerGlow   = 0.06;
        ring3.color       = vec3(0.0);
        ring3.alpha       = getAlphaForProgress3(progress);

        float alpha = 0.0;
        vec3 color  = vec3(0.0);

        float a1 = computeRingAlpha(uv, ring1);
        alpha += a1;
        color += ring1.color * a1;

        float a2 = computeRingAlpha(uv, ring2);
        alpha += a2;
        color += ring2.color * a2;

        float a3 = computeRingAlpha(uv, ring3);
        alpha += a3;
        color += ring3.color * a3;

        float fade = 1.0 - smoothstep(0.85, 1.0, progress);
        alpha *= fade;
        color *= fade;

        if (alpha < 0.01) discard;

        gl_FragColor = vec4(color, alpha);
    }
`;

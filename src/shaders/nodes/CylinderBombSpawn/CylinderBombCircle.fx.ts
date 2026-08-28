export const CYLINDER_BOMB_SPAWN_CIRCLE_FX = `
    precision highp float;

    varying vec2 vUV;
    uniform float progress;

    const float PI = 3.141592653589793;

    const vec3 COLOR1 = vec3(0.0);
    const vec3 COLOR2 = vec3(0.0);

    float ringGlow(float dist, float radius, float glowSize) {
        return exp(-pow((dist - radius) / glowSize, 2.0));
    }

    float getGlowForProgress(float p) {
        if (p < 0.4) return 0.0;
        if (p < 0.7) return 0.15;
        if (p < 0.8) return 0.10;
        if (p < 0.9) return 0.05;
        return 0.0;
    }

    float ringAlpha(float dist, float innerR, float outerR, float glow) {
        float base = smoothstep(innerR - 0.01, innerR, dist) *
                    (1.0 - smoothstep(outerR, outerR + 0.01, dist));
        return max(base, glow);
    }

    float ringAlphaWithGlow(float dist, float innerR, float outerR, float glow) {
        float alphaInner = smoothstep(innerR - glow, innerR + glow, dist);
        float alphaOuter = 1.0 - smoothstep(outerR - glow, outerR + glow, dist);
        return clamp(alphaInner * alphaOuter, 0.0, 1.0);
    }

    void main() {
        vec2 uv = vUV * 2.0 - 1.0;
        float dist = length(uv);

        float r1_inner = 0.89 * progress;
        float r1_outer = 0.90 * progress;
        float r1_center = (r1_inner + r1_outer) * 0.1;
        float r1_width  = (r1_outer - r1_inner) * 0.1;

        float glow1 = ringGlow(dist, r1_center, r1_width) * 0.1;
        float alpha1 = ringAlpha(dist, r1_inner, r1_outer, glow1);

        vec3 colGlow1 = COLOR1 * glow1 * 0.1;

        float r2_inner = 0.87 * progress;
        float r2_outer = 0.88 * progress;
        float glowVal  = getGlowForProgress(progress);

        float alpha2 = ringAlphaWithGlow(dist, r2_inner, r2_outer, glowVal);

        float glow2 = ringGlow(dist, r2_inner, glowVal) + ringGlow(dist, r2_outer, glowVal);
        alpha2 = clamp(alpha2 + glow2 * 0.05, 0.0, 1.0);

        vec3 colGlow2 = COLOR2 * glow2 * 0.05;

        float alpha = max(alpha1, alpha2);
        vec3 finalColor = COLOR1 + colGlow1 + colGlow2;

        if (alpha < 0.01) discard;

        float fade = clamp(0.75 - (progress - 0.75)/0.25, 0.0, 1.0);
        alpha *= fade;

        gl_FragColor = vec4(finalColor, alpha);
    }
`;

export const CORE_SHIELD_DESTROY_RING_FX = `
    precision highp float;

    varying vec2 vUV;
    uniform float progress;

    const float PI = 3.141592653589793;
    const vec3 COLOR1 = vec3(0.96, 0.51, 0.34);
    const vec3 COLOR2 = vec3(0.96, 0.35, 0.35);

    float ringGlow(float dist, float radius, float glowSize) {
        return exp(-pow((dist - radius) / glowSize, 2.0));
    }

    float ringAlpha(float dist, float innerR, float outerR) {
        float insideOuter = step(dist, outerR);
        float outsideInner = 1.0 - step(dist, innerR);
        return insideOuter * outsideInner;
    }

    void main() {
        vec2 uv = vUV * 2.0 - 1.0;
        float dist = length(uv);

        float ringThickness = 0.08;
        float r1_inner = 0.8 * progress;
        float r1_outer = r1_inner + ringThickness * progress;
        float r1_center = (r1_inner + r1_outer) * 0.5;
        float r1_width = (r1_outer - r1_inner) * 0.5;

        float ring1_mask = ringAlpha(dist, r1_inner, r1_outer);
        
        float glow1_intensity = mix(10.0, 0.0, progress);
        float glow1 = ringGlow(dist, r1_center, r1_width) * glow1_intensity;
        vec3 colGlow1 = COLOR1 * glow1 * 0.35;

        float r2_inner = 0.8 * progress;
        float r2_outer = r2_inner + 0.03 * progress;

        float ring2_mask = ringAlpha(dist, r2_inner, r2_outer);
        
        float glow2 = ringGlow(dist, r2_inner, 0.0) + ringGlow(dist, r2_outer, 0.0);
        vec3 colGlow2 = COLOR2 * glow2 * 0.1;

        float alpha = max(glow1 * 0.3, glow2 * 0.3);
        
        float ring_alpha = max(ring1_mask, ring2_mask);
        alpha = max(alpha, ring_alpha);

        vec3 finalColor = COLOR1 * ring1_mask + colGlow1 + colGlow2;

        if (alpha < 0.01) discard;

        float fade = clamp(0.85 - (progress - 0.75)/0.25, 0.0, 1.0);
        alpha *= fade;

        gl_FragColor = vec4(finalColor, alpha);
    }
`;

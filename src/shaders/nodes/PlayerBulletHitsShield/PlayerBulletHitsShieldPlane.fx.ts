export const PLAYER_BULLET_HITS_SHIELD_PLANE_FX = `
    precision highp float;

    varying vec2 vUV;
    uniform float progress;

    vec3 getColorForProgress(float p) {
        if (p < 0.5) return vec3(1.0, 1.0, 1.0);
        if (p < 0.6) return vec3(1.0, 1.0, 1.0);
        if (p < 0.7) return vec3(1.0, 1.0, 1.0);
        if (p < 0.8) return vec3(0.5, 0.5, 0.5);
        return              vec3(0.0, 0.0, 0.0);
    }

    float getAlphaForProgress(float p) {
        if (p < 0.2) return 1.0;
        if (p < 0.4) return 0.9;
        if (p < 0.6) return 0.8;
        if (p < 0.8) return 0.7;
        return              0.6;
    }

    void main() {
        vec2 uv = vUV * 2.0 - 1.0;
        float dist = length(uv);

        float innerRadius = 0.85 * progress;
        float outerRadius = 0.88 * progress;

        float innerGlow = 0.01;
        float outerGlow = 0.01;

        float alphaInner = smoothstep(innerRadius - innerGlow, innerRadius + innerGlow, dist);
        float alphaOuter = 1.0 - smoothstep(outerRadius - outerGlow, outerRadius + outerGlow, dist);

        float alpha = alphaInner * alphaOuter;

        if (alpha < 0.01) {
            discard;
        }

        alpha *= getAlphaForProgress(progress);

        vec3 ringColor = getColorForProgress(progress);

        gl_FragColor = vec4(ringColor, alpha);
    }
`;

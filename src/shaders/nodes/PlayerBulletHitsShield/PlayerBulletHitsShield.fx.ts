export const PLAYER_BULLET_HITS_SHIELD_FX = `
    precision highp float;

    varying vec2 vUV;
    uniform float progress;

    vec3 getColorForProgress(float p) {
        if (p < 0.2) return vec3(1.0, 1.0, 1.0);
        if (p < 0.4) return vec3(1.0, 1.0, 1.0);
        if (p < 0.6) return vec3(0.0, 0.0, 0.0);
        if (p < 0.8) return vec3(0.0, 0.0, 0.0);
        return              vec3(0.0, 0.0, 0.0);
    }

    float getAlphaForProgress(float p) {
        if (p < 0.2) return 0.75;
        if (p < 0.4) return 0.75;
        if (p < 0.6) return 0.40;
        if (p < 0.8) return 0.25;
        return              0.10;
    }

    void main() {
        vec2 uv = vUV * 2.0 - 1.0;
        float dist = length(uv);

        float innerRadius = 0.7 * progress;
        float outerRadius = 0.8 * progress;

        float innerGlow = 0.1;
        float outerGlow = 0.1;

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

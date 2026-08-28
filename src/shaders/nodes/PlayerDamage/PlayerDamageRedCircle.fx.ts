export const PLAYER_DAMAGE_RED_CIRCLE_FX = `
    precision highp float;

    varying vec2 vUV;
    uniform float progress;

    void main() {
        vec2 uv = vUV * 2.0 - 1.0;
        float dist = length(uv);

        float startRadius = 0.2;
        float maxOuterRadius = 0.5;
        float endRadiusProgress = 0.5;

        float innerRadius = 0.0;
        float softness = 1.0;

        vec3 circleColor = vec3(1.0, 0.12, 0.0);

        float t = clamp(progress / endRadiusProgress, 0.0, 1.0);
        float outerRadius = mix(startRadius, maxOuterRadius, t);

        float thickness = outerRadius - innerRadius;
        float softStart = outerRadius - thickness * softness;

        float alpha = 0.0;

        if (dist < innerRadius) {
            alpha = 1.0;
        }
        else if (dist < outerRadius) {
            alpha = 1.0 - smoothstep(softStart, outerRadius, dist);
        }

        float fade = 1.0 - smoothstep(0.25, 0.6, progress);
        alpha *= fade;

        if (alpha < 0.01) discard;

        gl_FragColor = vec4(circleColor, alpha);
    }
`;

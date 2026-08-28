export const ENEMY_DESTROY_PLANE_FX = `
    precision highp float;

    varying vec2 vUV;
    uniform float progress;

    vec3 getColorForProgress(float p) {
        return vec3(0.0);
    }

    void main() {
        vec2 uv = vUV * 2.0 - 1.0;
        float dist = length(uv);

        float ringRadius = progress;      
        float ringThickness = 0.005;       

        float innerRadius = ringRadius - ringThickness * 0.5;
        float outerRadius = ringRadius + ringThickness * 0.5;

        float alphaInner = smoothstep(innerRadius, innerRadius, dist);
        float alphaOuter = 1.0 - smoothstep(outerRadius, outerRadius, dist);

        float alpha = alphaInner * alphaOuter;

        if (alpha < 0.01) {
            discard;
        }

        float fade = 1.0 - smoothstep(0.85, 1.0, progress);
        alpha *= fade;

        if (alpha < 0.01) discard;

        gl_FragColor = vec4(0.0, 0.0, 0.0, alpha);
    }
`;

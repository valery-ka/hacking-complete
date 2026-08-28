export const PLAYER_DAMAGE_GROUND_FX = `
    precision highp float;

    varying vec2 vUV;
    uniform float progress;

    vec3 COLOR = vec3(0.97, 0.96, 0.91);

    float rand(vec2 co) {
        return fract(sin(dot(co,vec2(12.99,78.23)))*43758.5453);
    }

    void main() {
        vec2 uv = vUV * 2.0 - 1.0;
        float dist = length(uv);

        if (progress <= 0.529) {
            float localProgress = progress / 0.529;

            float innerRadius = mix(0.25, 0.75, localProgress);
            float outerRadius = mix(0.3, 0.85, localProgress);

            float alphaInner = smoothstep(innerRadius - 0.1, innerRadius + 0.1, dist);
            float alphaOuter = 1.0 - smoothstep(outerRadius - 0.005, outerRadius + 0.005, dist);
            float alpha = alphaInner * alphaOuter;

            float glowInner = exp(-pow((dist - innerRadius) / 0.075, 2.0));
            float glowOuter = exp(-pow((dist - outerRadius) / 0.005, 2.0));
            float combinedGlow = glowInner + glowOuter;

            alpha = clamp(alpha + combinedGlow * 0.6, 0.0, 1.0);

            if (alpha < 0.01) discard;

            vec3 ringColor = COLOR + combinedGlow * 0.075;
            gl_FragColor = vec4(ringColor, alpha * 0.85);
        }
        else {
            float ringInner = 0.75;
            float ringOuter = 0.75;
            float blurSize = 0.15;
            
            float ringMask = smoothstep(ringInner - blurSize, ringInner + blurSize, dist) * 
                            (1.0 - smoothstep(ringOuter - blurSize, ringOuter + blurSize, dist));
            
            if (ringMask < 0.01) discard;

            float squaresProgress = progress;
            
            vec2 squaresUV = (vUV - 0.5) / mix(1.0, 1.025, squaresProgress) + 0.5;
            if (squaresUV.x < 0.0 || squaresUV.x > 1.0 || squaresUV.y < 0.0 || squaresUV.y > 1.0) discard;
            
            vec2 coord = floor(squaresUV / 0.025);
            float r = rand(coord);

            float alpha = 0.0;
            float discardAlpha = (1.05 - (0.5 * (1.0 - progress) * (1.0 - progress)));

            if (r > discardAlpha) {
                float op[2] = float[2](0.0, 1.0);
                alpha = op[int((r - 0.7) * 10.0)];
            }
            
            alpha *= ringMask;
            alpha *= 1.0 - smoothstep(0.25, 1.0, squaresProgress);
            
            if (alpha < 0.01) discard;
            gl_FragColor = vec4(COLOR, alpha);
        }
    }
`;

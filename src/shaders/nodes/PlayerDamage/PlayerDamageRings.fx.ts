export const PLAYER_DAMAGE_RINGS_FX = `
    precision highp float;

    varying vec2 vUV;

    uniform int ring;
    uniform float progress;

    const vec3 WHITE = vec3(1.0);
    const vec3 BLACK = vec3(0.0);

    float drawRing(
        float currentRadius,          
        float startRadius,            
        float endRadius,              
        float startProgress,          
        float endProgress,            
        float initialThickness,       
        float finalThickness
    ) {
        float t = (progress - startProgress) / (endProgress - startProgress);
        float radius = mix(startRadius, endRadius, t);
        float thickness = mix(initialThickness, finalThickness, t);

        float alpha = 1.0 - smoothstep(thickness, thickness, abs(currentRadius - radius));

        if (progress < startProgress || progress > endProgress) {
            alpha = 0.0;
        }

        return alpha;
    }

    void main() {
        vec2 uv = vUV * 2.0 - 1.0;
        float dist = length(uv);

        float startRadius[2]      = float[](0.30, 0.60);
        float endRadius[2]        = float[](0.90, 0.60);
        float startProgress[2]    = float[](0.11, 0.23);
        float endProgress[2]      = float[](0.57, 1.00);
        float initialThickness[2] = float[](0.015, 0.0125);
        float finalThickness[2]   = float[](0.002, 0.0125);
        vec3 colors[2]            = vec3[](WHITE, BLACK);

        float totalAlpha = 0.0;
        vec3 totalColor  = vec3(0.0);

        float alpha = drawRing(
            dist,
            startRadius[ring],
            endRadius[ring],
            startProgress[ring],
            endProgress[ring],
            initialThickness[ring],
            finalThickness[ring]
        );
        totalAlpha += alpha;
        totalColor += alpha * colors[ring];

        if (ring == 1) {
            float t = (progress - startProgress[1]) /
                      (endProgress[1] - startProgress[1]);

            float ringRadius = mix(startRadius[1], endRadius[1], t);

            bool fillActive = progress >= startProgress[1] &&
                              progress <= endProgress[1];

            if (fillActive) {
                float fill = smoothstep(ringRadius, ringRadius - 0.01, dist)
                             * 0.075;

                totalAlpha += fill;
                totalColor += fill * colors[1];
            }
        }

        float globalFade = 1.0 - smoothstep(0.8, 1.0, progress);
        totalAlpha *= globalFade;

        if (totalAlpha < 0.01) discard;

        totalColor /= totalAlpha;

        gl_FragColor = vec4(totalColor, totalAlpha);
    }
`;

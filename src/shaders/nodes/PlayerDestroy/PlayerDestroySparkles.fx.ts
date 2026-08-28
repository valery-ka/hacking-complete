export const PLAYER_DESTROY_SPARKLES_FX = `
    precision highp float;

    varying vec2 vUV;

    uniform float time;
    uniform float progress;

    uniform vec3 color;
    uniform int amount;
    uniform float factor;

    const float LINE_WIDTH    =     0.001;
    const float MIN_LINE_HEIGHT =   0.05;
    const float MAX_LINE_HEIGHT =   0.10;

    float random(float seed) {
        return fract(sin(seed) * 43758.5453);
    }

    float randomRange(float seed, float min, float max) {
        return min + random(seed) * (max - min);
    }

    float blurredRect(vec2 pos, float halfWidth, float halfHeight, float blurAmount) {
        vec2 expandedSize = vec2(halfWidth, halfHeight) + blurAmount;

        float horizontal = smoothstep(-expandedSize.x, -halfWidth, pos.x) -
                        smoothstep(halfWidth, expandedSize.x, pos.x);
        float vertical = smoothstep(-expandedSize.y, -halfHeight, pos.y) -
                        smoothstep(halfHeight, expandedSize.y, pos.y);

        return horizontal * vertical;
    }

    vec4 makeBlur(vec2 pos, float w, float h, float blur, float intensity) {
        float mask = blurredRect(pos, w, h, blur);
        vec3 color = color * intensity;
        return vec4(pow(color, vec3(1.0/2.2)), mask * intensity);
    }

    void main() {
        vec2 uv = vUV * 2.0 - 1.0;
        vec3 finalColor = vec3(0.0);
        float finalAlpha = 0.0;

        for(int i = 0; i < amount; i++) {
            float angle = randomRange(float(i) * 10.0 + time, 0.0, 6.28318530718);
            float cos_a = cos(angle);
            float sin_a = sin(angle);
            mat2 rot = mat2(cos_a, -sin_a, sin_a, cos_a);

            float height = randomRange(float(i) * 20.0 + time, MIN_LINE_HEIGHT, MAX_LINE_HEIGHT);

            float dist = progress * randomRange(float(i) * 5.0, 0.2, 1.0);
            vec2 center = vec2(cos_a, sin_a) * dist;

            vec2 pos = rot * (uv - center);

            float mask = step(-height * 0.5, pos.x) * step(pos.x, height * 0.5) *
                        step(-LINE_WIDTH * 0.5, pos.y) * step(pos.y, LINE_WIDTH * 0.5);

            vec3 sharpColor = color * mask;
            vec4 sharpFragment = vec4(pow(sharpColor, vec3(1.0/2.2)), mask);

            const int BLUR_COUNT = 5;
            float blurConfigs[BLUR_COUNT];
            float intensityConfigs[BLUR_COUNT];
            // blurConfigs[0] = 0.001; intensityConfigs[0] = 0.2;
            // blurConfigs[1] = 0.003; intensityConfigs[1] = 0.4;
            blurConfigs[2] = 0.005; intensityConfigs[2] = 0.3;
            blurConfigs[3] = 0.007; intensityConfigs[3] = 0.2;
            // blurConfigs[4] = 0.009; intensityConfigs[4] = 0.1;

            vec3 blurSum = vec3(0.0);
            float alphaMax = 0.0;

            for(int j = 0; j < BLUR_COUNT; j++) {
                vec4 b = makeBlur(pos, height * 0.5, LINE_WIDTH * 0.5, blurConfigs[j], intensityConfigs[j]);
                blurSum += b.rgb;
                alphaMax = max(alphaMax, b.a);
            }

            vec3 lineColor = blurSum + sharpFragment.rgb * sharpFragment.a;
            float lineAlpha = max(alphaMax, sharpFragment.a);

            finalColor += lineColor * lineAlpha;
            finalAlpha = max(finalAlpha, lineAlpha);
        }

        finalAlpha *= (factor - smoothstep(0.8, 1.0, progress));

        if (finalAlpha < 0.01) discard;

        gl_FragColor = vec4(finalColor, finalAlpha);
    }
`;

export const PLAYER_BULLET_HITS_WALL_FX = `
    precision highp float;

    varying vec2 vUV;

    uniform float progress;
    uniform float invertColors;

    uniform sampler2D dispose00;
    uniform sampler2D dispose01;
    uniform sampler2D dispose02;
    uniform sampler2D dispose03;
    uniform sampler2D dispose04;

    const int NUM_TEXTURES = 5;

    const float startTimes[NUM_TEXTURES] = float[NUM_TEXTURES](0.8, 0.6, 0.4, 0.0, 0.0);
    const float endTimes[NUM_TEXTURES]   = float[NUM_TEXTURES](1.0, 0.8, 0.6, 0.4, 0.25);
    const float fadeTimes[NUM_TEXTURES]  = float[NUM_TEXTURES](0.05, 0.05, 0.05, 0.3, 0.05);
    const float baseAlpha[NUM_TEXTURES]  = float[NUM_TEXTURES](1.0, 1.0, 1.0, 0.7, 1.0);

    vec4 getTextureByIndex(int i, vec2 uv) {
        if (i == 0) return texture2D(dispose00, uv);
        if (i == 1) return texture2D(dispose01, uv);
        if (i == 2) return texture2D(dispose02, uv);
        if (i == 3) return texture2D(dispose03, uv);
        if (i == 4) return texture2D(dispose04, uv);
        return vec4(0.0);
    }

    vec4 invertColor(vec4 color) {
        return vec4(1.0 - color.r, 1.0 - color.g, 1.0 - color.b, color.a);
    }

    void main() {
        vec2 uv = vUV;

        vec4 finalColor = vec4(0.0);
        float totalWeight = 0.0;

        for (int i = 0; i < NUM_TEXTURES; i++) {
            float start = startTimes[i];
            float end   = endTimes[i];
            float fade  = fadeTimes[i];
            float alpha = baseAlpha[i];

            float w = smoothstep(start, start + fade, progress) *
                    (1.0 - smoothstep(end, end + fade, progress));

            vec4 tex = getTextureByIndex(i, uv);
            
            if (invertColors > 0.5) {
                tex = invertColor(tex);
            }
            
            w *= tex.a;
            finalColor += tex * w;
            totalWeight += w;
        }

        if (totalWeight < 0.001) discard;

        finalColor /= totalWeight;
        finalColor.a = totalWeight;
        gl_FragColor = finalColor;

    }
`;

export const PLAYER_AND_ENEMY_BULLETS_COLLIDE_FX = `
    precision highp float;

    varying vec2 vUV;

    uniform float progress;

    uniform sampler2D dispose00;
    uniform sampler2D dispose01;
    uniform sampler2D dispose02;
    uniform sampler2D dispose03;
    uniform sampler2D dispose04;

    const int NUM_TEXTURES = 5;

    const float startTimes[NUM_TEXTURES] = float[NUM_TEXTURES](0.0, 0.11, 0.21, 0.31, 0.41);
    const float endTimes[NUM_TEXTURES]   = float[NUM_TEXTURES](0.1, 0.2, 0.3, 0.4, 0.5);
    const float fadeTimes[NUM_TEXTURES]  = float[NUM_TEXTURES](0.25, 0.05, 0.05, 0.05, 0.05);
    const float baseAlpha[NUM_TEXTURES]  = float[NUM_TEXTURES](1.0, 1.0, 1.0, 1.0, 1.0);

    vec4 getTextureByIndex(int i, vec2 uv) {
        if (i == 0) return texture2D(dispose00, uv);
        if (i == 1) return texture2D(dispose01, uv);
        if (i == 2) return texture2D(dispose02, uv);
        if (i == 3) return texture2D(dispose03, uv);
        if (i == 4) return texture2D(dispose04, uv);
        return vec4(0.0);
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
            w *= tex.a; // учитываем прозрачность
            finalColor += tex * w;
            totalWeight += w;
        }

        if (totalWeight < 0.001) discard;

        finalColor /= totalWeight; // нормируем
        finalColor.a = totalWeight; // корректная альфа
        gl_FragColor = finalColor;
    }
`;

export const ENEMY_DESTROY_TEXTURES_FX = `
    precision highp float;

    varying vec2 vUV;
    uniform float progress;
    uniform float time;

    uniform sampler2D destroy00;
    uniform sampler2D destroy01;
    uniform sampler2D destroy02;
    uniform sampler2D destroy03;
    uniform sampler2D destroy04;
    uniform sampler2D destroy05;

    const int NUM_TEXTURES = 6;
    const int NUM_SEGMENTS = 10;

    vec4 getTextureByIndex(int i, vec2 uv) {
        if (i == 0) return texture2D(destroy00, uv);
        if (i == 1) return texture2D(destroy01, uv);
        if (i == 2) return texture2D(destroy02, uv);
        if (i == 3) return texture2D(destroy03, uv);
        if (i == 4) return texture2D(destroy04, uv);
        if (i == 5) return texture2D(destroy05, uv);
        return vec4(0.0);
    }

    int pseudoRandomTexture(int segmentIndex, float seed) {
        float x = sin(float(segmentIndex) * 12.9898 + seed * 78.233) * 43758.5453;
        return int(mod(floor(x), float(NUM_TEXTURES)));
    }

    vec4 redCircle(vec2 uv, float radius, float softness, float alpha) {
        vec2 center = vec2(0.5, 0.5);
        float dist = length(uv - center);
        float circleAlpha = smoothstep(radius, radius - softness, dist) * alpha;
        return vec4(1.0, 0.0, 0.0, circleAlpha);
    }

    void main() {
        vec2 uv = vUV;

        int currentSegment = int(round(progress * float(NUM_SEGMENTS)));

        if(currentSegment >= NUM_SEGMENTS) currentSegment = NUM_SEGMENTS - 1;
        if(currentSegment < 0) currentSegment = 0;

        int texIndex = pseudoRandomTexture(currentSegment, time);

        vec4 color = getTextureByIndex(texIndex, uv);

        float fadeIn  = smoothstep(0.0, 0.5, progress);
        float fadeOut = 1.0 - smoothstep(0.5, 1.0, progress);
        float circleAlpha = fadeIn * fadeOut;

        vec4 circle1 = redCircle(uv, 0.3, 0.4, circleAlpha * 1.00);
        vec4 circle2 = redCircle(uv, 0.1, 0.1, circleAlpha * 0.75);

        color = mix(color, circle1, circle1.a);
        color = mix(color, circle2, circle2.a);

        gl_FragColor = color;
    }
`;

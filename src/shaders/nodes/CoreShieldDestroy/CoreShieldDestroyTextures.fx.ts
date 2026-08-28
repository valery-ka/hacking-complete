export const CORE_SHIELD_DESTROY_TEXTURES_FX = `
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
    const int NUM_SEGMENTS = 3;

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

    void main() {
        vec2 uv = vUV;

        const float SATURATION_FACTOR = 1.5;
        const float CONTRAST_FACTOR   = 2.3;

        float segmentF = progress * float(NUM_SEGMENTS);
        int segment0 = int(floor(segmentF));
        if (segment0 >= NUM_SEGMENTS) segment0 = NUM_SEGMENTS - 1;

        int texIndex = pseudoRandomTexture(segment0, time);
        vec4 color = getTextureByIndex(texIndex, uv);

        vec3 avg = vec3((color.r + color.g + color.b) / 3.0);
        color.rgb = mix(avg, color.rgb, SATURATION_FACTOR);

        color.rgb = (color.rgb - 0.5) * CONTRAST_FACTOR + 0.5;

        color.a *= 0.3;

        gl_FragColor = color;
    }
`;

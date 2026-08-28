export const CUSTOM_FLARE_FX = `
    precision highp float;

    varying vec2 vUV;

    uniform float progress;
    uniform sampler2D flare;

    uniform vec3 color;

    uniform float scaleX;
    uniform float scaleY;

    float brightness = 2.0;

    void main() {
        vec2 uv = vUV * 2.0 - 1.0;

        uv.x /= scaleX;
        uv.y /= scaleY;

        uv = uv * 0.5 + 0.5;

        vec4 flareColor = texture2D(flare, uv);

        float fadePoint = 0.2;
        float fadeIn = smoothstep(0.0, fadePoint, progress);
        float fadeOut = 1.0 - smoothstep(fadePoint, 1.0, progress);
        float alphaFade = fadeIn * fadeOut;

        gl_FragColor = vec4(flareColor.rgb * color, flareColor.a * alphaFade * brightness);
    }
`;

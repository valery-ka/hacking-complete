export const RGB_SHADER = `
    precision highp float;

    varying vec2 vUV;
    uniform sampler2D textureSampler;
    uniform float time;

    uniform int type;       // 0 = абберация, 1 = горизонтальное размытие

    float hash(float n) {
        return fract(sin(n) * 43758.5453);
    }

    void main() {
        vec4 texColor = texture2D(textureSampler, vUV);

        float mask = 0.0;
        int bands = 20;

        float minWidth = 0.02;
        float maxWidth = 0.3;
        float minLength = 0.02;
        float maxLength = 0.2;

        float fps = 30.0;
        float frame = floor(time * fps);
        float freq = 0.1;

        for (int i = 0; i < bands; i++) {
            float fi = float(i);

            float rndL = hash(fi * 17.0 + frame * 1.37);
            if (rndL < freq) {
                float lengthL = mix(minLength, maxLength, hash(fi * 7.13 + frame * 2.11));
                float widthL  = mix(minWidth,  maxWidth,  hash(fi * 3.91 + frame * 3.77));
                float yStartL = hash(fi * 11.11 + frame * 4.19) * (1.0 - lengthL);
                float yEndL   = yStartL + lengthL;

                if (vUV.y > yStartL && vUV.y < yEndL && vUV.x < widthL) {
                    mask = 1.0;
                }
            }

            float rndR = hash(fi * 23.0 + frame * 5.61);
            if (rndR < freq) {
                float lengthR = mix(minLength, maxLength, hash(fi * 13.31 + frame * 6.73));
                float widthR  = mix(minWidth,  maxWidth,  hash(fi * 19.47 + frame * 7.29));
                float yStartR = hash(fi * 29.11 + frame * 8.53) * (1.0 - lengthR);
                float yEndR   = yStartR + lengthR;

                if (vUV.y > yStartR && vUV.y < yEndR && vUV.x > 1.0 - widthR) {
                    mask = 1.0;
                }
            }
        }

        vec3 finalColor = texColor.rgb;

        if (mask > 0.0) {
            if (type == 0) {
                float offset = 1.0;

                float r = texture2D(textureSampler, vUV + vec2(offset, 0.0)).r;
                float g = texture2D(textureSampler, vUV).g;
                float b = texture2D(textureSampler, vUV - vec2(offset, 0.0)).b;
                finalColor = vec3(r, g, b);
            } else if (type == 1) {
                float blurStrength = 100.0;
                int blurSamples = 10;
                float blurStep = blurStrength / float(blurSamples);
                vec3 blurredColor = vec3(0.0);

                for (int i = 0; i < blurSamples; i++) {
                    float offset = float(i) * blurStep - blurStrength * 0.5;
                    vec2 sampleUV = vUV + vec2(offset, 0.0);
                    blurredColor += texture2D(textureSampler, sampleUV).rgb;
                }
                blurredColor /= float(blurSamples);

                finalColor = blurredColor;
            }
        }

        gl_FragColor = vec4(finalColor, texColor.a);
    }
`;

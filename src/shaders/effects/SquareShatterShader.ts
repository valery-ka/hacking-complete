export const SQUARE_SHATTER_SHADER = `
    precision highp float;

    varying vec2 vUV;
    uniform sampler2D textureSampler;
    uniform float time;

    float hash(vec2 value) {
        return fract(sin(dot(value, vec2(12.9898, 78.233))) * 43758.5453);
    }

    void main() {
        const int edgeTears = 18;
        const int centerBlocks = 10;

        vec2 sampleUV = vUV;

        for (int i = 0; i < edgeTears; i++) {
            float id = float(i);

            // Own refresh rate and phase per tear, so they never blink in sync.
            float fps = mix(6.0, 26.0, hash(vec2(id, 0.37)));
            float frame = floor(time * fps + id * 7.13);
            vec2 seed = vec2(id * 3.71, frame);

            if (hash(seed + vec2(1.7, 9.2)) < 0.3) {
                float thickness = mix(0.003, 0.05, hash(seed + vec2(4.1, 2.3)));
                float centerY = hash(seed + vec2(8.4, 5.6));

                // Biased towards short tears with occasional long ones.
                float tearLength = mix(0.02, 0.4, pow(hash(seed + vec2(5.1, 3.3)), 2.0));
                float onLeft = step(hash(seed + vec2(2.4, 8.1)), 0.5);
                float edgeDistance = mix(1.0 - vUV.x, vUV.x, onLeft);

                if (abs(vUV.y - centerY) < thickness * 0.5 && edgeDistance < tearLength) {
                    float shift = mix(0.03, 0.35, hash(seed + vec2(3.7, 7.9)));
                    float direction = step(hash(seed + vec2(6.2, 1.4)), 0.5) * 2.0 - 1.0;

                    // Wrapping keeps the strip readable as duplicated content
                    // instead of stretching the edge pixels of the frame.
                    sampleUV = fract(
                        vUV + vec2(shift * direction, (hash(seed + vec2(9.5, 0.8)) - 0.5) * 0.04)
                    );
                }
            }
        }

        for (int j = 0; j < centerBlocks; j++) {
            float id = float(j);

            float fps = mix(5.0, 18.0, hash(vec2(id, 5.19)));
            float frame = floor(time * fps + id * 11.29);
            vec2 seed = vec2(id * 5.43 + 100.0, frame);

            if (hash(seed + vec2(0.9, 4.7)) < 0.18) {
                vec2 size = vec2(
                    mix(0.02, 0.16, hash(seed + vec2(2.2, 6.4))),
                    mix(0.02, 0.12, hash(seed + vec2(7.8, 1.1)))
                );
                vec2 center = vec2(
                    mix(0.2, 0.8, hash(seed + vec2(3.3, 8.8))),
                    mix(0.15, 0.85, hash(seed + vec2(6.1, 2.9)))
                );

                if (all(lessThan(abs(vUV - center), size * 0.5))) {
                    vec2 shift = vec2(
                        (hash(seed + vec2(4.6, 7.2)) - 0.5) * 0.5,
                        (hash(seed + vec2(8.3, 3.5)) - 0.5) * 0.2
                    );

                    sampleUV = fract(vUV + shift);
                }
            }
        }

        gl_FragColor = texture2D(textureSampler, sampleUV);
    }
`;

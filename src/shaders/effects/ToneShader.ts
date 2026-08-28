export const TONE_SHADER = `
    precision highp float;

    varying vec2 vUV;
    uniform sampler2D textureSampler;
    uniform vec3 toneColor;
    uniform float modeSwitch;

    void main(void) {
        vec4 color = texture2D(textureSampler, vUV);

        float brightness = dot(color.rgb, vec3(0.299, 0.587, 0.114));

        vec3 result;

        if (modeSwitch == 0.0) {
            if (brightness < 0.25) {
                result = toneColor * 0.3;
            } else if (brightness < 0.5) {
                result = toneColor * 0.6;
            } else if (brightness < 0.75) {
                result = mix(toneColor, vec3(1.0), 0.0);
            } else {
                result = mix(toneColor, vec3(1.0), 0.2);
            }
        } else {
            if (brightness < 0.25) {
                result = toneColor * 0.15;
            } else if (brightness < 0.5) {
                result = toneColor * 0.6;
            } else if (brightness < 0.75) {
                result = mix(toneColor, vec3(1.0), 0.0);
            } else {
                result = mix(toneColor, vec3(1.0), 0.1);
            }
        }

        gl_FragColor = vec4(modeSwitch == 0.0 ? result : mix(color.rgb, result, 0.75), 1.0);
    }
`;

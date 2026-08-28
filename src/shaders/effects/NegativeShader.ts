export const NEGATIVE_SHADER = `
    precision highp float;

    varying vec2 vUV;
    uniform sampler2D textureSampler;
    uniform float intensity;

    void main() {
        vec4 color = texture2D(textureSampler, vUV);

        float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
        float threshold = step(0.5, gray);

        vec3 binaryColor = vec3(threshold);
        vec3 negativeBinary = vec3(1.0) - binaryColor;
        vec3 finalColor = mix(color.rgb, negativeBinary, intensity);
        
        gl_FragColor = vec4(finalColor, color.a);
    }
`;

export const PIXELATION_SHADER = `
    precision highp float;

    varying vec2 vUV;

    uniform sampler2D textureSampler;
    uniform vec2 screenSize;
    uniform float pixelSize;

    void main() {
        vec2 pixelatedUV = floor(vUV * screenSize / pixelSize) * pixelSize / screenSize;
        gl_FragColor = texture2D(textureSampler, pixelatedUV);
    }
`;

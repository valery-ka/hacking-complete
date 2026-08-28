export const RADIAL_BLUR_SHADER = `
    precision highp float;

    varying vec2 vUV;
    uniform sampler2D textureSampler;
    uniform float strength;    

    void main() {
        const int samples = 8;
        
        vec2 uv = vUV;
        vec2 center = vec2(0.5, 0.5);
        vec2 toPixel = uv - center;
        float dist = length(toPixel);
        vec2 dir = normalize(toPixel);
        
        vec4 color = vec4(0.0, 0.0, 0.0, 0.0);
        
        for (int i = 0; i < samples; i++) {
            float offset = float(i) / float(samples) * strength * dist;
            color += texture2D(textureSampler, uv - dir * offset);
        }   
        
        gl_FragColor = color / float(samples);
    }
`;

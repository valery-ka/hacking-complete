export const DISTORTION_SHADER = `
    precision highp float;
    varying vec2 vUV;
    uniform sampler2D textureSampler;
    uniform float intensity;

    void main() {
        vec2 coord = 2.0 * vUV - 1.0;
        
        float r2 = coord.x * coord.x + coord.y * coord.y;
        vec2 distortedCoord = coord * (1.0 + intensity * r2);
        
        float maxDistortion = 1.0 + intensity;
        distortedCoord /= maxDistortion;
        vec2 finalUV = distortedCoord * 0.5 + 0.5;

        float edgeSoftness = 0.001;
        
        if (finalUV.x >= 0.0 && finalUV.x <= 1.0 && finalUV.y >= 0.0 && finalUV.y <= 1.0) {
            vec4 color = texture2D(textureSampler, finalUV);
            
            vec2 edgeDist = min(finalUV, 1.0 - finalUV) / (edgeSoftness * 2.0);
            float alpha = min(edgeDist.x, edgeDist.y);
            alpha = clamp(alpha, 0.0, 1.0);
            
            gl_FragColor = mix(vec4(0.0, 0.0, 0.0, 1.0), color, alpha);
        } else {
            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        }
    }
`;

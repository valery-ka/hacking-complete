export const AOE_DISC_OVERHEAT_FX = `
    precision highp float;

    varying vec2 vUV;

    vec3 color1 = vec3(1.0, 0.33, 0.2);
    vec3 color2 = vec3(1.0, 0.50, 0.2);
    
    uniform float alpha1;
    uniform float alpha2;

    float stripeWidth = 0.5;
    float stripeOffset = -0.015;
    
    void main() {
        float stripeFrequency = 50.0;
        
        float stripe = sin((vUV.y + stripeOffset) * stripeFrequency * 3.14159);
        
        float threshold = mix(-1.0, 1.0, stripeWidth);
        float pattern = step(threshold, stripe);
        
        vec3 finalColor = mix(color2, color1, pattern);
        float finalAlpha = mix(alpha2, alpha1, pattern);
        
        gl_FragColor = vec4(finalColor, finalAlpha);
    }
`;

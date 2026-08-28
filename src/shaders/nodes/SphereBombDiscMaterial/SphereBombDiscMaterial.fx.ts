export const SPHERE_BOMB_DISC_MATERIAL_FX = `
    precision highp float;

    varying vec2 vUV;

    vec3 color = vec3(0.87, 0.47, 0.34);

    float stripeWidth = 0.7;
    float stripeOffset = -0.015;
    
    void main() {
        float stripeFrequency = 30.0;
        
        float stripe = sin((vUV.y + stripeOffset) * stripeFrequency * 3.14159);
        
        float threshold = mix(-1.0, 1.0, stripeWidth);
        float alpha = step(threshold, stripe) * 0.7 + 0.2;

        gl_FragColor = vec4(color, alpha);
    }
`;

export const CORE_SHIELD_MATERIAL_FX = `
    precision highp float;

    varying vec2 vUV;

    uniform float time;

    vec3 color = vec3(0.96, 0.89, 0.73);
    float stripeWidth = 0.7;

    void main() {
        float stripeFrequency = 30.0;
        float speed = 0.2;
        
        float stripe = sin((vUV.y + time * speed) * stripeFrequency * 3.14159);
        
        float threshold = mix(-1.0, 1.0, stripeWidth);
        float alpha = step(threshold, stripe) * 0.7 + 0.2;

        gl_FragColor = vec4(color, alpha);
    }
`;

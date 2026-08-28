export const LAVA_WALL_MATERIAL_FX = `
    precision highp float;

    varying vec2 vUV;
    uniform float semitransparent;

    vec3 color1 = vec3(1.0, 0.33, 0.2);
    vec3 color2 = vec3(1.0, 0.50, 0.2);

    float stripeWidth = 0.4;

    void main() {
        float stripeFrequency = 6.0;
        float offsetY = 0.275;

        float stripe = sin((vUV.x - vUV.y + offsetY) * stripeFrequency * 3.14159);

        float threshold = mix(-1.0, 1.0, stripeWidth);

        vec3 color = stripe > threshold ? color2 : color1;
        
        float alpha = smoothstep(threshold - 0.1, threshold + 0.1, stripe);
        alpha = stripe > threshold ? semitransparent : 1.0;
        
        gl_FragColor = vec4(color, alpha);
    }
`;

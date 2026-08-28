export const AOE_DISC_SPEED_DOWN_PLAYER_FX = `
    precision highp float;

    varying vec2 vUV;

    uniform vec3 color;

    void main() {
        const float INNER_RADIUS = 0.99;
        const float OUTER_RADIUS = 1.00;
        const float INNER_GLOW   = 1.00;
        const float OUTER_GLOW   = 1.00;
        const float OPACITY      = 1.00;

        vec2 uv = vUV * 2.0 - 1.0;
        float dist = length(uv);

        float innerAlpha = smoothstep(
            INNER_RADIUS - INNER_GLOW,
            INNER_RADIUS + INNER_GLOW,
            dist
        );

        float outerAlpha = 1.0 - smoothstep(
            OUTER_RADIUS - OUTER_GLOW,
            OUTER_RADIUS + OUTER_GLOW,
            dist
        );

        float alpha = innerAlpha * outerAlpha * OPACITY;

        if (alpha < 0.01) discard;

        gl_FragColor = vec4(color, alpha);
    }
`;

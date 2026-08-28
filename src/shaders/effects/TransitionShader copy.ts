export const TRANSITION_SHADER = `
    precision highp float;

    varying vec2 vUV;
    uniform sampler2D textureSampler;
    uniform sampler2D menuTexture;
    uniform float progress;

    const int cols = 9;
    const int rows = 5;
    const float delta = 0.2;

    float hash(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
    }

    float getTriangleOffset(vec2 cellCoord, bool isTopTriangle) {
        vec2 seed = cellCoord * (isTopTriangle ? 1.0 : 2.0) + vec2(12.34, 56.78);
        
        if (!isTopTriangle) {
            seed += vec2(89.01, 23.45);
        }
        
        float random = hash(seed);
        return floor(random * 5.0) * delta;
    }

    float diamondMask(vec2 localUV) {
        vec2 center = vec2(0.5);
        vec2 d = abs(localUV - center);
        return step(d.x + d.y, 0.5);
    }

    void main(void) {
        vec2 uv = vec2(vUV.x, 1.0 - vUV.y);
        vec4 sceneColor = texture2D(textureSampler, vUV);
        vec4 menuColor = texture2D(menuTexture, uv);

        vec2 cellCoord = floor(uv * vec2(float(cols), float(rows)));
        int col = int(cellCoord.x);
        int row = int(cellCoord.y);

        vec2 localUV = fract(uv * vec2(float(cols), float(rows)));

        float mask = diamondMask(localUV);

        bool isTopTriangle = localUV.y < 0.5;

        float offset = getTriangleOffset(cellCoord, isTopTriangle);

        float localProgress = clamp((progress - offset) / delta, 0.0, 1.0);

        vec4 blended = mix(sceneColor, menuColor, menuColor.a * localProgress * mask);

        gl_FragColor = blended;
    }
`;

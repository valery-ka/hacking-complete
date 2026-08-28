export const GRID_SHADER = `
    precision highp float;

    varying vec2 vUV;
    uniform sampler2D textureSampler;
    uniform vec2 screenSize;
    uniform float cellSize;
    uniform float gridAlpha;

    void main(void) {
        vec4 sceneColor = texture2D(textureSampler, vUV);
        vec2 pixelCoord = vUV * screenSize;
        vec2 gridUV = mod(pixelCoord, cellSize);

        float border = 0.6;
        float isBorder = step(gridUV.x, border)
                    + step(gridUV.y, border)
                    + step(cellSize - gridUV.x, border)
                    + step(cellSize - gridUV.y, border);

        vec3 gridColor = mix(vec3(1.0), vec3(0.0), clamp(isBorder, 0.0, 1.0));
        vec3 multiplied = sceneColor.rgb * gridColor;
        vec3 finalColor = mix(sceneColor.rgb, multiplied, gridAlpha);

        gl_FragColor = vec4(finalColor, 1.0);
    }
`;

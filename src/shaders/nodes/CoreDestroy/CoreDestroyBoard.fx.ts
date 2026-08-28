export const CORE_DESTROY_BOARD_FX = `
    precision highp float;

    varying vec2 vUV;
    uniform float progress;

    const vec3 LIGHT = vec3(0.94, 0.93, 0.82);
    const vec3 DARK = vec3(0.08, 0.10, 0.11);

    const float minAlpha = 0.0;
    const float maxAlpha = 1.0;

    int getGridSizeForProgress(float p) {
        if (p < 0.1) return 4;
        if (p < 0.2) return 5;
        if (p < 0.3) return 6;
        if (p < 0.4) return 7;
        if (p < 0.5) return 0;
        if (p < 0.6) return 4;
        if (p < 0.7) return 5;
        if (p < 0.8) return 6;
        if (p < 0.9) return 7;
        return              0;
    }

    vec3 getColorForProgress(float p) {
        if (p < 0.5) return LIGHT;
        return              DARK;
    }

    void main() {
        int grid_size = getGridSizeForProgress(progress);

        vec2 grid_uv = vUV * float(grid_size);
        vec2 cell = floor(grid_uv);
        vec2 cell_center = (cell + 0.5) / float(grid_size);

        vec2 center = vec2(0.5);

        float dist = distance(cell_center, center);

        float max_dist = distance(vec2(0.0), center);
        float normalized_dist = dist / max_dist;

        float alpha = 1.0 - normalized_dist;

        alpha = mix(minAlpha, maxAlpha, alpha);
        alpha *= 0.15;

        vec3 color = getColorForProgress(progress);
        gl_FragColor = vec4(color, alpha);
    }
`;

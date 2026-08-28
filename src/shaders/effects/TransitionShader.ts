export const TRANSITION_SHADER = `
    precision highp float;

    varying vec2 vUV;

    uniform sampler2D textureSampler;
    uniform sampler2D menuTexture;

    uniform float progress;
    uniform vec2 viewportOffset;
    uniform vec2 viewportScale;

    const int   COLS  = 9;
    const int   ROWS  = 5;
    const float DELTA = 0.2;

    float hash(ivec2 p) {
        return fract(
            sin(dot(vec2(p), vec2(127.1, 311.7))) *
            43758.5453
        );
    }

    vec2 getGridUV(vec2 uv) {
        return vec2(
            uv.x * float(COLS),
            uv.y * float(ROWS)
        );
    }

    struct TriangleCell {
        ivec2 id;
    };

    TriangleCell getTriangleCell(vec2 gridUV) {
        TriangleCell cell;

        vec2 p = vec2(
            gridUV.x + gridUV.y,
            gridUV.y - gridUV.x
        );

        ivec2 base = ivec2(floor(p));
        vec2  frac = fract(p);

        bool isTop = (frac.x + frac.y) < 1.0;

        cell.id = base * 2 + ivec2(isTop ? 0 : 1, 0);
        return cell;
    }

    float getTriangleProgress(ivec2 triId, float progress) {
        float offset = hash(triId);
        offset = floor(offset * 5.0) * DELTA;

        return clamp(
            (progress - offset) / DELTA,
            0.0,
            1.0
        );
    }

    void main() {
        vec2 screenUV = viewportOffset + vUV * viewportScale;
        vec2 menuUV = vec2(screenUV.x, 1.0 - screenUV.y);

        vec4 sceneColor = texture2D(textureSampler, vUV);
        vec4 menuColor  = texture2D(menuTexture, menuUV);

        vec2 gridUV = getGridUV(menuUV);
        TriangleCell tri = getTriangleCell(gridUV);

        float localProgress = getTriangleProgress(tri.id, progress);

        float sceneFade = smoothstep(1.0, 0.0, progress * 0.75);

        vec3 fadeFrom = vec3(0.0);
        vec3 sceneRGB = mix(fadeFrom, sceneColor.rgb, sceneFade);

        vec4 sceneFinal = vec4(sceneRGB, sceneColor.a);

        gl_FragColor = mix(
            sceneFinal,
            menuColor,
            menuColor.a * localProgress
        );
    }
`;

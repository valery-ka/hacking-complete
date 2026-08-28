export const ENEMY_SPAWN_GROUND_FX = `
    precision highp float;

    varying vec2 vUV;
    uniform float progress;

    const float PI = 3.141592653589793;

    const vec3  COLOR1 = vec3(0.92, 0.91, 0.78);
    const vec3  COLOR2 = vec3(0.96, 0.51, 0.34);

    const float ALPHA1 = 1.0;
    const float ALPHA2 = 2.0;

    const float START_R1 = 0.20;
    const float MAX_R1   = 0.70;
    const float THICK1   = 0.01;

    const float START_R2 = 0.70;
    const float MAX_R2   = 0.75;
    const float THICK2   = 0.50;

    const float TRI_SIZE = 0.15;

    float circleAlpha(float dist, float r, float thickness) {
        float hh = thickness * 0.5;
        return smoothstep(r + hh, r - hh, dist);
    }

    vec2 rotate(vec2 p, float a) {
        float s = sin(a), c = cos(a);
        return vec2(c*p.x - s*p.y, s*p.x + c*p.y);
    }

    float inTri(vec2 p, vec2 a, vec2 b, vec2 c) {
        vec2 v0 = b - a;
        vec2 v1 = c - a;
        vec2 v2 = p - a;

        float d00 = dot(v0, v0);
        float d01 = dot(v0, v1);
        float d11 = dot(v1, v1);
        float d20 = dot(v2, v0);
        float d21 = dot(v2, v1);

        float denom = d00 * d11 - d01 * d01;
        float v = (d11*d20 - d01*d21) / denom;
        float w = (d00*d21 - d01*d20) / denom;
        float u = 1.0 - v - w;

        return step(0.0, u) * step(0.0, v) * step(0.0, w);
    }

    float trianglesAlpha(vec2 uv, float radius, float alphaMul) {
        float sum = 0.0;

        vec2 t0 = vec2(0.0,  TRI_SIZE);
        vec2 t1 = vec2(-TRI_SIZE, -TRI_SIZE);
        vec2 t2 = vec2( TRI_SIZE, -TRI_SIZE);

        for (int i = 0; i < 4; i++) {
            float ang = float(i) * (PI * 0.5);
            float offset = 0.2;
            vec2 center = vec2(cos(ang), sin(ang)) * (radius + offset);

            float rot = ang + PI * 1.5;
            vec2 v0 = rotate(t0, rot) + center;
            vec2 v1 = rotate(t1, rot) + center;
            vec2 v2 = rotate(t2, rot) + center;

            sum += inTri(uv, v0, v1, v2) * alphaMul;
        }

        return sum;
    }

    void main() {
        vec2 uv = vUV * 2.0 - 1.0;
        float dist = length(uv);

        float r1 = mix(START_R1, MAX_R1, min(progress / 0.6, 1.0));
        float r2 = mix(START_R2, MAX_R2, progress);

        float fade = progress > 0.6 ? 1.0 - (progress - 0.6) / 0.4 : 1.0;

        float a1 = circleAlpha(dist, r1, THICK1) * ALPHA1 * 3.0 * fade;
        float a2 = circleAlpha(dist, r2, THICK2) * ALPHA2 * (0.75 - progress) * fade;

        vec3 c1 = mix(COLOR1, COLOR2, smoothstep(0.5, 1.0, progress));

        float triA = trianglesAlpha(uv, r1, ALPHA1 * 3.0 * fade);

        float A = a1 + a2 + triA;
        if (A < 0.01) discard;

        vec3 C = (c1*a1 + COLOR2*a2 + c1*triA) / A;
        gl_FragColor = vec4(C, A);
    }
`;

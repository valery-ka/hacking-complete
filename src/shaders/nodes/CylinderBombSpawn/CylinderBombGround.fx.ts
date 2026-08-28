export const CYLINDER_BOMB_GROUND_FX = `
    precision highp float;

    varying vec2 vUV;
    uniform float progress;

    const float PI = 3.141592653589793;

    const vec3  COLOR1 = vec3(0.9);
    const vec3  COLOR2 = vec3(1.0);

    const float ALPHA1 = 1.0;
    const float ALPHA2 = 2.0;

    const float START_R1 = 0.60;
    const float MAX_R1   = 0.65;
    const float THICK1   = 0.30;

    const float START_R2 = 0.60;
    const float MAX_R2   = 0.65;
    const float THICK2   = 0.30;

    const float TRI_SIZE = 0.02;

    float circleAlpha(float dist, float r, float thickness) {
        float hh = thickness * 0.5;
        return smoothstep(r + hh, r - hh, dist);
    }

    vec2 rotate(vec2 p, float a) {
        float s = sin(a), c = cos(a);
        return vec2(c*p.x - s*p.y, s*p.x + c*p.y);
    }

    // Function to calculate distance from point to triangle edge
    float distToTriangleEdge(vec2 p, vec2 a, vec2 b) {
        vec2 ab = b - a;
        vec2 ap = p - a;
        
        float ab2 = dot(ab, ab);
        float ap_dot_ab = dot(ap, ab);
        
        float t = clamp(ap_dot_ab / ab2, 0.0, 1.0);
        vec2 closest = a + t * ab;
        
        return length(p - closest);
    }

    // Function to calculate distance to triangle (interior + exterior)
    float distToTriangle(vec2 p, vec2 a, vec2 b, vec2 c) {
        // Barycentric coordinates to determine if point is inside
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

        // If inside triangle, distance is 0
        if (u >= 0.0 && v >= 0.0 && w >= 0.0) {
            // For interior points, return negative distance to indicate inside
            // Use the minimum distance to any edge as a measure
            float d1 = distToTriangleEdge(p, a, b);
            float d2 = distToTriangleEdge(p, b, c);
            float d3 = distToTriangleEdge(p, c, a);
            return -min(min(d1, d2), d3);
        } else {
            // For exterior points, calculate distance to each edge and take minimum
            float d1 = distToTriangleEdge(p, a, b);
            float d2 = distToTriangleEdge(p, b, c);
            float d3 = distToTriangleEdge(p, c, a);
            
            // Also consider distances to vertices for corner cases
            float d4 = length(p - a);
            float d5 = length(p - b);
            float d6 = length(p - c);
            
            return min(min(min(min(min(d1, d2), d3), d4), d5), d6);
        }
    }

    float triAlpha(vec2 p, vec2 a, vec2 b, vec2 c, float blur) {
        float dist = distToTriangle(p, a, b, c);
        
        // For interior points (negative distance), use smoothstep from -blur to 0
        // For exterior points, use smoothstep from 0 to blur
        if (dist < 0.0) {
            // Inside triangle - fade out as we move inward from the edge
            return smoothstep(-blur, 0.0, -dist);
        } else {
            // Outside triangle - fade out as we move away from the edge
            return smoothstep(blur, 0.0, dist);
        }
    }

    float trianglesAlpha(vec2 uv, float radius, float alphaMul) {
        float sum = 0.0;

        vec2 t0 = vec2(0.0, -TRI_SIZE);
        vec2 t1 = vec2(-TRI_SIZE, TRI_SIZE);
        vec2 t2 = vec2( TRI_SIZE, TRI_SIZE);

        const int TRI_COUNT = 3;
        float blur = 0.2; // Smaller blur value for more precise control

        for (int i = 0; i < TRI_COUNT; i++) {
            float ang = float(i) * (2.0 * PI / float(TRI_COUNT));
            float offset = 0.2;

            vec2 center = vec2(cos(ang), sin(ang)) * (radius + offset);
            float rot = ang + PI * 1.5;

            vec2 v0 = rotate(t0, rot) + center;
            vec2 v1 = rotate(t1, rot) + center;
            vec2 v2 = rotate(t2, rot) + center;

            sum += triAlpha(uv, v0, v1, v2, blur) * alphaMul;
        }

        return sum;
    }

    void main() {
        vec2 uv = vUV * 2.0 - 1.0;
        float dist = length(uv);

        float r1 = mix(START_R1, MAX_R1, min(progress / 0.6, 1.0));
        float r2 = mix(START_R2, MAX_R2, progress);

        float fade = progress > 0.6 ? 1.0 - (progress - 0.6) / 0.4 : 1.0;

        float a1 = circleAlpha(dist, r1, THICK1) * ALPHA1 * (0.75 - progress) * fade;
        float a2 = circleAlpha(dist, r2, THICK2) * ALPHA2 * (0.75 - progress) * fade;

        vec3 c1 = mix(COLOR1, COLOR2, smoothstep(0.5, 1.0, progress));

        float triA = trianglesAlpha(uv, r1 - 0.2, ALPHA1 * 3.0 * fade);

        float A = a1 + a2 + triA;
        if (A < 0.01) discard;

        vec3 C = (c1*a1 + COLOR2*a2 + c1*triA) / A;
        gl_FragColor = vec4(C, A);
    }
`;

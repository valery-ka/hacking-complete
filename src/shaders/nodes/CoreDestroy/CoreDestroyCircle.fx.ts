export const CORE_DESTROY_CIRCLE_FX = `
    precision highp float;

    varying vec2 vUV;
    uniform float progress;

    const float PI = 3.141592653589793;

    const vec3 COLOR1 = vec3(1.0);
    const vec3 COLOR2 = vec3(1.0);
    const vec3 COLOR3 = vec3(0.0);
    const vec3 COLOR4 = vec3(0.0);

    float ringGlow(float dist, float radius, float glowSize) {
        return exp(-pow((dist - radius) / glowSize, 2.0));
    }

    float ringAlpha(float dist, float innerR, float outerR, float glow) {
        float base = smoothstep(innerR - 0.01, innerR, dist) *
                    (1.0 - smoothstep(outerR, outerR + 0.01, dist));
        return max(base, glow);
    }

    struct RingResult {
        vec3 color;
        float alpha;
    };

    RingResult createCircle(
        float dist,
        vec3 circleColor,
        float minRadius,
        float maxRadius,
        float centerOffset,
        float glowIntensity,
        float progress,
        float aRing
    ) {
        RingResult result;
        
        float currentMaxRadius = minRadius + (maxRadius - minRadius) * progress;
        float ringCenter = currentMaxRadius * centerOffset;
        
        float glow = ringGlow(dist, ringCenter, ringCenter) * glowIntensity;
        float alpha = ringAlpha(dist, 0.0, currentMaxRadius, glow);
        
        vec3 glowColor = circleColor * glow * glowIntensity;
        
        result.color = circleColor + glowColor;
        result.alpha = alpha * aRing;
        
        return result;
    }

    RingResult createThickRing(
        float dist,
        vec3  ringColor,
        float minInnerRadius,
        float maxOuterRadius,
        float ringThickness,
        float progress,
        float opacity
    ) {
        RingResult result;
        
        float currentInnerRadius = minInnerRadius + (maxOuterRadius - ringThickness - minInnerRadius) * progress;
        float currentOuterRadius = currentInnerRadius + ringThickness;
        
        float alpha = smoothstep(currentInnerRadius - 0.01, currentInnerRadius, dist) *
                     (1.0 - smoothstep(currentOuterRadius, currentOuterRadius + 0.01, dist));
        
        result.color = ringColor;
        result.alpha = alpha * opacity;
        
        return result;
    }

    void main() {
        vec2 uv = vUV * 2.0 - 1.0;
        float dist = length(uv);

        RingResult ring1 = createCircle(dist, COLOR1, 0.15, 0.30, 0.30, 20.0, progress, 1.0);
        RingResult ring2 = createCircle(dist, COLOR2, 0.25, 0.50, 0.50, 1.0, progress, 0.5);
        RingResult ring3 = createCircle(dist, COLOR3, 0.35, 0.70, 0.30, 1.0, progress, 0.25);
        RingResult ring4 = createThickRing(dist, COLOR4, 0.50, 1.00, 0.01, progress, 1.0);

        vec3 finalColor = ring1.color * ring1.alpha + 
                         ring2.color * ring2.alpha + 
                         ring3.color * ring3.alpha +
                         ring4.color * ring4.alpha;
        
        float alpha = max(ring1.alpha, max(ring2.alpha, max(ring3.alpha, ring4.alpha)));

        if (alpha < 0.01) discard;

        float fade = clamp(0.0 - (progress - 0.75)/0.25, 0.0, 1.0);
        alpha *= fade;

        gl_FragColor = vec4(finalColor, alpha);
    }
`;

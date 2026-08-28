export const RING_EFFECT_FX = `
    precision highp float;

    varying vec2 vUV;
    uniform float progress;

    struct RingSegment {
        float innerStart, innerEnd;
        float outerStart, outerEnd;
        float innerGlow, outerGlow;
        vec2 innerOffsetStart, innerOffsetEnd;
        float segStart, segEnd;
    };

    RingSegment getSegment(float p) {
        if (p <= 0.12) {
            return RingSegment(
                0.4, 0.4,
                0.55, 0.55,
                0.02 , 0.02,
                vec2(0.0, 0.0), vec2(0.0, 0.0),
                0.0, 0.12
            );
        } else if (p <= 0.6) {
            return RingSegment(
                0.52, 0.65,
                0.55, 0.75,
                0.06, 0.06,
                vec2(0.0, 0.0), vec2(-0.005, -0.075),
                0.13, 0.6
            );
        } else {
            return RingSegment(
                0.65, 0.90,
                0.75, 0.90,
                0.01, 0.04,
                vec2(-0.005, -0.075), vec2(0.0, 0.0),
                0.61, 1.0
            );
        }
    }

    void main() {
        vec2 uv = vUV * 2.0 - 1.0;

        RingSegment seg = getSegment(progress);

        float localProgress = clamp(
            (progress - seg.segStart) / (seg.segEnd - seg.segStart),
            0.0, 1.0
        );

        vec2 innerRingOffset = mix(seg.innerOffsetStart, seg.innerOffsetEnd, localProgress);

        float distInner = length(uv - innerRingOffset);
        float distOuter = length(uv);

        float innerRadius = mix(seg.innerStart, seg.innerEnd, localProgress);
        float outerRadius = mix(seg.outerStart, seg.outerEnd, localProgress);

        float alphaInner = smoothstep(innerRadius - seg.innerGlow, innerRadius + seg.innerGlow, distInner);
        float alphaOuter = 1.0 - smoothstep(outerRadius - seg.outerGlow, outerRadius + seg.outerGlow, distOuter);
        float alpha = alphaInner * alphaOuter;

        float glowInner = exp(-pow((distInner - innerRadius) / seg.innerGlow, 2.0));
        float glowOuter = exp(-pow((distOuter - outerRadius) / seg.outerGlow, 2.0));

        float combinedGlow = glowInner + glowOuter;
        alpha = clamp(alpha + combinedGlow * 0.6, 0.0, 1.0);

        if (alpha < 0.01) {
            discard;
        }

        vec3 ringColor = vec3(1.0, 0.98, 0.95);
        ringColor += combinedGlow * 0.075;

        gl_FragColor = vec4(ringColor, alpha);
    }
`;

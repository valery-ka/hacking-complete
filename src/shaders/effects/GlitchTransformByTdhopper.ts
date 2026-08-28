// Provided by tdhopper. Shadertoy link:
// https://www.shadertoy.com/view/XtyXzW

export const GLITCH_TRANSFORM_BY_TDHOPPER = `
    precision highp float;

    varying vec2 vUV;
    uniform sampler2D textureSampler;
    uniform vec2 screenSize;
    uniform vec2 boxCenter;
    uniform vec2 boxRadius;
    uniform float time;

    const float GAMMA = 2.2;

    vec3 gamma(vec3 color, float g) {
        return pow(color, vec3(g));
    }

    vec3 linearToScreen(vec3 linearRGB) {
        return gamma(linearRGB, 1.0 / GAMMA);
    }

    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
    }

    const float glitchScale = 0.25;

    vec2 glitchCoord(vec2 p, vec2 gridSize) {
        vec2 coord = floor(p / gridSize) * gridSize;;
        coord += (gridSize / 2.0);
        return coord;
    }


    struct GlitchSeed {
        vec2 seed;
        float prob;
    };
        
    float fBox2d(vec2 p, vec2 b) {
    vec2 d = abs(p) - b;
    return min(max(d.x, d.y), 0.0) + length(max(d, 0.0));
    }

    GlitchSeed glitchSeed(vec2 p, float speed) {
        float seedTime = floor(time * speed);
        vec2 seed = vec2(
            1. + mod(seedTime / 100.0, 100.0),
            1. + mod(seedTime, 100.0)
        ) / 100.0;
        seed += p;

        float prob = rand(seed); 

        return GlitchSeed(seed, prob);
    }

    float shouldApply(vec2 seed, float prob) {
        float baseRand = rand(seed);
        float adjusted = mix(baseRand, 1.0, prob - 0.5);
        return round(mix(adjusted, 0.0, (1.0 - prob) * 0.5));
    }

    vec4 swapCoords(vec2 seed, vec2 groupSize, vec2 subGrid, vec2 blockSize) {
        vec2 rand2 = vec2(rand(seed), rand(seed+.1));
        vec2 range = subGrid - (blockSize - 1.);
        vec2 coord = floor(rand2 * range) / subGrid;
        vec2 bottomLeft = coord * groupSize;
        vec2 realBlockSize = (groupSize / subGrid) * blockSize;
        vec2 topRight = bottomLeft + realBlockSize;
        topRight -= groupSize / 2.;
        bottomLeft -= groupSize / 2.;
        return vec4(bottomLeft, topRight);
    }

    float isInBlock(vec2 pos, vec4 block) {
        vec2 a = sign(pos - block.xy);
        vec2 b = sign(block.zw - pos);
        return min(sign(a.x + a.y + b.x + b.y - 3.), 0.);
    }

    vec2 moveDiff(vec2 pos, vec4 swapA, vec4 swapB) {
        vec2 diff = swapB.xy - swapA.xy;
        return diff * isInBlock(pos, swapA);
    }

    void swapBlocks(inout vec2 xy, vec2 groupSize, vec2 subGrid, vec2 blockSize, vec2 seed, float apply) {
        
        vec2 groupOffset = glitchCoord(xy, groupSize);
        vec2 pos = xy - groupOffset;
        
        vec2 seedA = seed * groupOffset;
        vec2 seedB = seed * (groupOffset + .1);
        
        vec4 swapA = swapCoords(seedA, groupSize, subGrid, blockSize);
        vec4 swapB = swapCoords(seedB, groupSize, subGrid, blockSize);
        
        vec2 newPos = pos;
        newPos += moveDiff(pos, swapA, swapB) * apply;
        newPos += moveDiff(pos, swapB, swapA) * apply;
        pos = newPos;
        
        xy = pos + groupOffset;
    }

    void staticNoise(inout vec2 p, vec2 groupSize, float grainSize, float contrast, float time) {
        vec2 seedCoord = glitchCoord(p, groupSize);
        vec2 seed = vec2(1.0 + floor(time * 5.0 / 100.0), 1.0 + mod(time * 5.0, 100.0)) / 100.0;
        seed += seedCoord;

        float prob = 0.25;
        float apply = shouldApply(seed, prob);
        if (apply > 0.5) {
            vec2 offset = vec2(rand(seed), rand(seed + 0.1));
            offset = round(offset * 2.0 - 1.0);
            offset *= contrast;
            p += offset;
        }
    }

    void glitchSwap(inout vec2 p, float time) {
        float scale = glitchScale;
        float speed = 5.0;

        vec2 groupSize;
        vec2 subGrid;
        vec2 blockSize;
        vec2 seed;
        float apply;
        float apply2;

        groupSize = vec2(0.6) * scale;
        subGrid = vec2(2.0);
        blockSize = vec2(1.0);

        seed = glitchCoord(p, groupSize) / 10.0 + vec2(floor(time * speed / 100.0), mod(time * speed, 100.0)) / 100.0;
        apply = shouldApply(seed, 0.3);
        swapBlocks(p, groupSize, subGrid, blockSize, seed, apply);

        groupSize = vec2(0.8) * scale;
        subGrid = vec2(3.0);
        blockSize = vec2(1.0);

        seed = glitchCoord(p, groupSize) / 10.0 + vec2(floor(time * speed / 100.0), mod(time * speed, 100.0)) / 100.0;
        apply = shouldApply(seed, 0.3);
        swapBlocks(p, groupSize, subGrid, blockSize, seed, apply);

        groupSize = vec2(0.2) * scale;
        subGrid = vec2(6.0);
        blockSize = vec2(1.0);

        seed = glitchCoord(p, groupSize) / 10.0 + vec2(floor(time * speed / 100.0), mod(time * speed, 100.0)) / 100.0;
        apply = shouldApply(seed, 0.3);
        apply2 = shouldApply(seed, 0.25);

        for (int i = 0; i < 6; i++) {
            swapBlocks(p, groupSize, subGrid, blockSize, seed + float(i), apply * apply2);
        }

        groupSize = vec2(1.2, 0.2) * scale;
        subGrid = vec2(9.0, 2.0);
        blockSize = vec2(3.0, 1.0);

        seed = glitchCoord(p, groupSize) / 10.0 + vec2(floor(time * speed / 100.0), mod(time * speed, 100.0)) / 100.0;
        apply = shouldApply(seed, 0.3);
        swapBlocks(p, groupSize, subGrid, blockSize, seed, apply);
    }

    void glitchStatic(inout vec2 p) {
        staticNoise(p, vec2(0.5, 0.25/2.0) * glitchScale, 0.2 * glitchScale, 2.0, time);
    }

    void glitchColor(vec2 p, inout vec3 color, vec2 screenSize) {
        vec2 groupSize = vec2(0.75, 0.125) * glitchScale;
        vec2 subGrid = vec2(0, 6);
        float speed = 5.0;
        GlitchSeed seed = glitchSeed(glitchCoord(p, groupSize), speed);
        seed.prob *= 0.3;

        if (shouldApply(seed.seed, seed.prob) > 0.5) {
            vec2 co = mod(p, groupSize) / groupSize;
            co *= subGrid;
            float a = max(co.x, co.y);

            vec3 colorA = vec3(0.50, 0.49, 0.45);
            vec3 colorB = vec3(0.83, 0.82, 0.76);

            float mask = floor(mod(a, 2.0)); // 0 или 1
            color = mix(colorA, colorB, mask);
        }
    }

    uniform float animationTime;
    float maskPixelSize = 64.0;

    float animatedPixelMaskInBox(vec2 uv, vec2 boxCenter, vec2 boxRadius, float pixelSize, float time) {
        vec2 px = uv * screenSize;
        if (px.x < boxCenter.x - boxRadius.x || px.x > boxCenter.x + boxRadius.x ||
            px.y < boxCenter.y - boxRadius.y || px.y > boxCenter.y + boxRadius.y) {
            return 0.0;
        }
        
        vec2 localPos = px - (boxCenter - boxRadius);
        vec2 gridCoord = floor(localPos / pixelSize);

        vec2 animatedSeed = gridCoord + vec2(floor(time * 20.0));
        float r = rand(animatedSeed);
        
        return step(0.05, r);
    }

    void main(void) {
        vec2 p = vUV;
        vec3 color = texture2D(textureSampler, p).rgb;

        float mask = animatedPixelMaskInBox(p, boxCenter, boxRadius, maskPixelSize, time);

        if (mask > 0.5 && animationTime > 0.02) {
            glitchSwap(p, time);
            glitchStatic(p);
            color = texture2D(textureSampler, p).rgb;
            glitchColor(p, color, screenSize);
        }

        gl_FragColor = vec4(color, 1.0);
    }
`;

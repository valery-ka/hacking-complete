// Provided by igneus. Shadertoy link:
// https://www.shadertoy.com/view/lfscD7

export const HEX_GLITCH_BY_IGNEUS = `
    precision highp float;

    varying vec2 vUV;

    uniform sampler2D textureSampler;
    uniform float iTime;
    uniform float iFrame;
    uniform vec2 iResolution;
    uniform float glitchIntensity;

    #define kScreenDownsample 1
    #define kCaptureTimeDelay 0.0
    #define kCaptureTimeSpeed 2.0

    vec2 gResolution;
    vec2 gFragCoord;
    float gTime;
    uvec4 rngSeed;
    float gDxyDuv;

    void SetGlobals(vec2 fragCoord, vec2 resolution, float time)
    {
        gFragCoord = fragCoord;
        gResolution = resolution;
        gTime = time;
        gDxyDuv = 1.0 / gResolution.x;
    }

    #define kTwoPi                 (2.0 * 3.14159265359)
    #define kOne                   vec3(1.0)
    #define kZero                  vec3(0.0)

    float toRad(float deg)         { return kTwoPi * deg / 360.0; }
    float sqr(float a)             { return a * a; }
    vec3 sqr(vec3 a)               { return a * a; }
    float sin01(float a)           { return 0.5 * sin(a) + 0.5; }
    float cos01(float a)           { return 0.5 * cos(a) + 0.5; }
    float saturate(float a)        { return clamp(a, 0.0, 1.0); }
    float cwiseMax(vec3 v)         { return (v.x > v.y) ? ((v.x > v.z) ? v.x : v.z) : ((v.y > v.z) ? v.y : v.z); }
    float cwiseMin(vec3 v)         { return (v.x < v.y) ? ((v.x < v.z) ? v.x : v.z) : ((v.y < v.z) ? v.y : v.z); }


    mat3 WorldToViewMatrix(float rot, vec2 trans, float sca)
    {   
        return mat3(vec3(cos(rot) / sca, sin(rot) / sca, trans.x), 
                    vec3(-sin(rot) / sca, cos(rot) / sca, trans.y),
                    vec3(1.0));
    }

    vec2 TransformScreenToWorld(vec2 p)
    {   
        return (p - vec2(gResolution.xy) * 0.5) / float(gResolution.y); 
    }

    vec3 Cartesian2DToBarycentric(vec2 p)
    {    
        return vec3(p, 0.0) * mat3(vec3(0.0, 1.0 / 0.8660254037844387, 0.0),
                            vec3(1.0, 0.5773502691896257, 0.0),
                            vec3(-1.0, 0.5773502691896257, 0.0));    
    }

    vec2 Cartesian2DToHexagonalTiling(in vec2 uv, out vec3 bary, out ivec2 ij)
    {    
        #define kHexRatio vec2(1.5, 0.8660254037844387)
        vec2 uvClip = mod(uv + kHexRatio, 2.0 * kHexRatio) - kHexRatio;
        
        ij = ivec2((uv + kHexRatio) / (2.0 * kHexRatio)) * 2;
        if(uv.x + kHexRatio.x <= 0.0) ij.x -= 2;
        if(uv.y + kHexRatio.y <= 0.0) ij.y -= 2;
        
        bary = Cartesian2DToBarycentric(uvClip);
        if(bary.x > 0.0)
        {
            if(bary.z > 1.0) { bary += vec3(-1.0, 1.0, -2.0); ij += ivec2(-1, 1); }
            else if(bary.y > 1.0) { bary += vec3(-1.0, -2.0, 1.0); ij += ivec2(1, 1); }
        }
        else
        {
            if(bary.y < -1.0) { bary += vec3(1.0, 2.0, -1.0); ij += ivec2(-1, -1); }
            else if(bary.z < -1.0) { bary += vec3(1.0, -1.0, 2.0); ij += ivec2(1, -1); }
        }

        return vec2(bary.y * 0.5773502691896257 - bary.z * 0.5773502691896257, bary.x);
    }

    float SmoothStep(float x)                   { return mix(0.0, 1.0, x * x * (3.0 - 2.0 * x)); }

    float PaddedSmoothStep(float x, float a, float b)
    { 
        return SmoothStep(saturate(x * (a + b + 1.0) - a));
    }

    float KickDrop(float t, vec2 p0, vec2 p1, vec2 p2, vec2 p3)
    {
        if(t < p1.x)
        {
            return mix(p0.y, p1.y, max(0.0, exp(-sqr((t - p1.x)*2.145966026289347/(p1.x-p0.x))) - 0.01) / 0.99);
        }
        else if(t < p2.x)
        {
            return mix(p1.y, p2.y, (t - p1.x) / (p2.x - p1.x));
        }
        else
        {  
            return mix(p3.y, p2.y, max(0.0, exp(-sqr((t - p2.x)*2.145966026289347/(p3.x-p2.x))) - 0.01) / 0.99);
        }
    }

    uvec4 PCGAdvance()
    {
        rngSeed = rngSeed * 1664525u + 1013904223u;
        
        rngSeed.x += rngSeed.y*rngSeed.w; 
        rngSeed.y += rngSeed.z*rngSeed.x; 
        rngSeed.z += rngSeed.x*rngSeed.y; 
        rngSeed.w += rngSeed.y*rngSeed.z;
        
        rngSeed ^= rngSeed >> 16u;
        
        rngSeed.x += rngSeed.y*rngSeed.w; 
        rngSeed.y += rngSeed.z*rngSeed.x; 
        rngSeed.z += rngSeed.x*rngSeed.y; 
        rngSeed.w += rngSeed.y*rngSeed.z;
        
        return rngSeed;
    }

    vec4 Rand(sampler2D sampler)
    {
        return texelFetch(sampler, (ivec2(gFragCoord) + ivec2(PCGAdvance() >> 16)) % 1024, 0);
    }

    vec4 Rand()
    {
        return vec4(PCGAdvance()) / float(0xffffffffu);
    }

    void PCGInitialise(uint seed)
    {    
        rngSeed = uvec4(20219u, 7243u, 12547u, 28573u) * seed;
    }

    uint RadicalInverse(uint i)
    {
        i = ((i & 0xffffu) << 16u) | (i >> 16u);
        i = ((i & 0x00ff00ffu) << 8u) | ((i & 0xff00ff00u) >> 8u);
        i = ((i & 0x0f0f0f0fu) << 4u) | ((i & 0xf0f0f0f0u) >> 4u);
        i = ((i & 0x33333333u) << 2u) | ((i & 0xccccccccu) >> 2u);    
        i = ((i & 0x55555555u) << 1u) | ((i & 0xaaaaaaaau) >> 1u);        
        return i;
    }

    float HaltonBase2(uint i)
    {    
        return float(RadicalInverse(i)) / float(0xffffffffu);
    }

    #define kFNVPrime              0x01000193u
    #define kFNVOffset             0x811c9dc5u

    uint HashCombine(uint a, uint b)
    {
        return (((a << (31u - (b & 31u))) | (a >> (b & 31u)))) ^
                ((b << (a & 31u)) | (b >> (31u - (a & 31u))));
    }

    uint HashOf(uint i)
    {
        uint h = (kFNVOffset ^ (i & 0xffu)) * kFNVPrime;
        h = (h ^ ((i >> 8u) & 0xffu)) * kFNVPrime;
        h = (h ^ ((i >> 16u) & 0xffu)) * kFNVPrime;
        h = (h ^ ((i >> 24u) & 0xffu)) * kFNVPrime;
        return h;
    }

    uint HashOf(uint a, uint b) { return HashCombine(HashOf(a), HashOf(b)); }
    uint HashOf(uint a, uint b, uint c) { return HashCombine(HashCombine(HashOf(a), HashOf(b)), HashOf(c)); }
    uint HashOf(uint a, uint b, uint c, uint d) { return HashCombine(HashCombine(HashOf(a), HashOf(b)), HashCombine(HashOf(c), HashOf(d))); }

    float HashToFloat(uint i)
    {    
        return float(i) / float(0xffffffffu);
    }

    vec3 Hue(float phi)
    {
        float phiColour = 6.0 * phi;
        int i = int(phiColour);
        vec3 c0 = vec3(((i + 4) / 3) & 1, ((i + 2) / 3) & 1, ((i + 0) / 3) & 1);
        vec3 c1 = vec3(((i + 5) / 3) & 1, ((i + 3) / 3) & 1, ((i + 1) / 3) & 1);             
        return mix(c0, c1, phiColour - float(i));
    }

    float CIEXYZGauss(float lambda, float alpha, float mu, float sigma1, float sigma2)
    {
    return alpha * exp(sqr(lambda - mu) / (-2.0 * sqr(lambda < mu ? sigma1 : sigma2)));
    }

    vec3 SampleSpectrum(float delta)
    {
        float lambda = mix(3800.0, 7000.0, delta);    

        #define kRNorm (7000.0 - 3800.0) / 1143.07
        #define kGNorm (7000.0 - 3800.0) / 1068.7
        #define kBNorm (7000.0 - 3800.0) / 1068.25

        vec3 xyz;
        xyz.x = (CIEXYZGauss(lambda, 1.056, 5998.0, 379.0, 310.0) +
                CIEXYZGauss(lambda, 0.362, 4420.0, 160.0, 267.0) +
                CIEXYZGauss(lambda, 0.065, 5011.0, 204.0, 262.0)) * kRNorm;
        xyz.y = (CIEXYZGauss(lambda, 0.821, 5688.0, 469.0, 405.0) +
                CIEXYZGauss(lambda, 0.286, 5309.0, 163.0, 311.0)) * kGNorm;
        xyz.z = (CIEXYZGauss(lambda, 1.217, 4370.0, 118.0, 360.0) +
                CIEXYZGauss(lambda, 0.681, 4590.0, 260.0, 138.0)) * kBNorm;

        vec3 rgb;
        rgb.r = (2.04159 * xyz.x - 0.5650 * xyz.y - 0.34473 * xyz.z) / (2.0 * 0.565);
        rgb.g = (-0.96924 * xyz.x + 1.87596 * xyz.y + 0.04155 * xyz.z) / (2.0 * 0.472);
        rgb.b = (0.01344 * xyz.x - 0.11863 * xyz.y + 1.01517 * xyz.z) / (2.0 * 0.452);

        return rgb;
    }

    vec3 Overlay(vec3 a, vec3 b)
    {
        //return (luminance(a) < 0.5) ? (2.0 * a * b) : (1.0 - 2.0 * (1.0 - a) * (1.0 - b));
        return vec3((a.x < 0.5) ? (2.0 * a.x * b.x) : (1.0 - 2.0 * (1.0 - a.x) * (1.0 - b.x)),
                    (a.y < 0.5) ? (2.0 * a.y * b.y) : (1.0 - 2.0 * (1.0 - a.y) * (1.0 - b.y)),
                    (a.z < 0.5) ? (2.0 * a.z * b.z) : (1.0 - 2.0 * (1.0 - a.z) * (1.0 - b.z)));
    }

    vec3 HSVToRGB(vec3 hsv)
    {
        return mix(vec3(0.0), mix(vec3(1.0), Hue(hsv.x), hsv.y), hsv.z);
    }

    vec3 RGBToHSV( vec3 rgb)
    {
        // Value
        vec3 hsv;
        hsv.z = cwiseMax(rgb);

        // Saturation
        float chroma = hsv.z - cwiseMin(rgb);
        hsv.y = (hsv.z < 1e-10) ? 0.0 : (chroma / hsv.z);

        // Hue
        if (chroma < 1e-10)        { hsv.x = 0.0; }
        else if (hsv.z == rgb.x)    { hsv.x = (1.0 / 6.0) * (rgb.y - rgb.z) / chroma; }
        else if (hsv.z == rgb.y)    { hsv.x = (1.0 / 6.0) * (2.0 + (rgb.z - rgb.x) / chroma); }
        else                        { hsv.x = (1.0 / 6.0) * (4.0 + (rgb.x - rgb.y) / chroma); }
        hsv.x = fract(hsv.x + 1.0);

        return hsv;
    }

    vec3 Render(vec2 uvScreen, int idx, int maxSamples, bool isDisplaced, float jpegDamage, out float blend) {
        #define kMBlurGain      (isDisplaced ? 100. : 10.0)
        #define kZoomOrder      2
        #define kEndPause       0.0
        #define kSpeed          0.3
        
        vec4 xi = Rand(textureSampler);
        uint hash = HashOf(uint(98796523), uint(gFragCoord.x), uint(gFragCoord.y));        
        xi.y = (float(idx) + HaltonBase2(uint(idx) + hash)) / float(maxSamples);
        xi.x = xi.y;
        float time = 1. * max(0.0, iTime - kCaptureTimeDelay);
        time = (time * kCaptureTimeSpeed + xi.y * kMBlurGain / 60.0) * kSpeed; 
        
        float phase = fract(time);
        int interval = int(time) & 1;    
        interval <<= 1;
        float morph;
        float warpedTime;
        float spectrumBlend;
        #define kIntervalPartition 0.85
        if(phase < kIntervalPartition)
        {
            float y = (interval == 0) ? uvScreen.y : (iResolution.y - uvScreen.y);
            warpedTime = (phase / kIntervalPartition) - 0.2 * sqrt(y / iResolution.y) - 0.1;
            phase = fract(warpedTime);
            morph = 1.0 - PaddedSmoothStep(sin01(kTwoPi * phase), 0., 0.4);
            blend = float(interval / 2) * 0.5;
            if(interval == 2) { warpedTime *= 0.5; }
        }
        else
        {
            time -=  0.8 * kSpeed * xi.y * kMBlurGain / 60.0;
            warpedTime = time;
            phase = (fract(time) - kIntervalPartition) / (1.0 - kIntervalPartition);
            morph = 1.0;
            blend = (KickDrop(phase, vec2(0.0, 0.0), vec2(0.2, -0.1), vec2(0.3, -0.1), vec2(0.7, 1.0)) + float(interval / 2)) * 0.5;        
            interval++;
        }
        
        float beta = abs(2.0 * max(0.0, blend) - 1.0);
        
        #define kMaxIterations  2
        #define kTurns 7
        #define kNumRipples 5
        #define kRippleDelay (float(kNumRipples) / float(kTurns))
        #define kThickness mix(0.5, 0.4, morph)
        #define kExponent mix(0.05, 0.55, morph)
        
        float expMorph = pow(morph, 0.3);
        #define kZoom 0.35
        #define kScale mix(2.6, 1.1, expMorph)

        mat3 M = WorldToViewMatrix(blend * kTwoPi, vec2(0.0), kZoom);
        vec2 uvView = TransformScreenToWorld(uvScreen);
        int invert = 0;
        
        uvView /= 1.0 + 0.05 * length(uvView) * xi.z;
        uvView = (vec3(uvView, 1.0) * M).xy; 
        
        vec3 bary;
        ivec2 ij;
        Cartesian2DToHexagonalTiling(uvView / 1.4, bary, ij);    
        float len = cwiseMax(abs(bary));
        
        vec2 uvViewWarp = uvView;
        uvViewWarp.y *= mix(1.0, 0.1, sqr(1.0 - morph) * xi.y * saturate(sqr(0.5 * (1.0 + uvView.y))));   
        
        float theta = toRad(30.0) * beta;
        mat2 r = mat2(vec2(cos(theta), -sin(theta)), vec2(sin(theta), cos(theta)));
        uvViewWarp = r * uvViewWarp;    

        vec3 sigma = vec3(0.0);
        for(int iterIdx = 0; iterIdx < kMaxIterations; ++iterIdx)
        {   
            vec3 bary;
            ivec2 ij;
            Cartesian2DToHexagonalTiling(uvViewWarp, bary, ij);        
                            
            if(!isDisplaced && ij != ivec2(0)) { break; }   
            
            int subdiv = 1 + int(exp(-sqr(10. * mix(-1., 1., phase))) * 100.);
            
            float theta = kTwoPi * (floor(cos01(kTwoPi * phase) * 12.) / 6.);
            Cartesian2DToHexagonalTiling(uvViewWarp * (0.1 + float(subdiv)) - kHexRatio.y * vec2(sin(theta), cos(theta)) * floor(0.5 + sin01(kTwoPi * phase) * 2.) / 2., bary, ij);        
            uint hexHash = HashOf(uint(phase * 6.), uint(subdiv), uint(ij.x), uint(ij.y));
            if(hexHash % 2u == 0u)
            {
                float alpha = PaddedSmoothStep(sin01(phase * 20.0), 0.2, 0.75);
                float dist = mix(cwiseMax(abs(bary)), length(uvView) * 2.5, 1.0 - alpha);
                float hashSum = bary[hexHash % 3u] + bary[(hexHash + 1u) % 3u];

                if( dist > 1.0 - 0.02 * float(subdiv)) { invert = invert ^ 1; }
                else if( fract(20. / float(subdiv) * hashSum) < 0.5)  { invert = invert ^ 1; }
                if(iterIdx == 0) break;
            }
            
            float sigma = 0.0, sigmaWeight = 0.0;
            for(int j = 0; j < kTurns; ++j)
            {   
                float delta = float(j) / float(kTurns);
                float theta = kTwoPi * delta;
                for(int i = 0; i < kNumRipples; ++i)
                {
                    float l = length(uvViewWarp - vec2(cos(theta), sin(theta))) * 0.5;
                    float weight = log2(1.0 / (l + 1e-10));
                    sigma += fract(l - pow(fract((float(j) + float(i) / kRippleDelay) / float(kTurns) + warpedTime), kExponent)) * weight;
                    sigmaWeight += weight;
                }            
            }
            invert = invert ^ int((sigma / sigmaWeight) > kThickness);
        
            theta = kTwoPi * (floor(cos01(kTwoPi * -phase) * 5. * 6.) / 6.);
            uvViewWarp = r * (uvViewWarp + vec2(cos(theta), sin(theta)) * 0.5);
            uvViewWarp *= kScale; 
        }
        
        sigma = vec3(float(invert != 0));
        
        return vec3(sigma) * 1.0;
    }

    bool Interfere(inout vec2 xy, inout vec3 tint, in vec2 res)
    {
        #define kStatic true
        #define kStaticFrequency 0.1
        #define kStaticLowMagnitude 0.01
        #define kStaticHighMagnitude 0.02
        
        #define kVDisplace true
        #define kVDisplaceFrequency 0.07
        
        #define kHDisplace true
        #define kHDisplaceFrequency 0.25
        #define kHDisplaceVMagnitude 0.1
        #define kHDisplaceHMagnitude 0.5
        
    float frameHash = HashToFloat(HashOf(uint(floor(iFrame / (10.0 / kCaptureTimeSpeed)))));
    bool isDisplaced = false;

    if(kStatic)
    {
        float interP = 0.01;
        float displacement = res.x * kStaticLowMagnitude;

        if(frameHash < kStaticFrequency)
        {
            interP = 0.5;
            displacement = kStaticHighMagnitude * res.x;
            tint = vec3(0.5);
        }

        PCGInitialise(
            HashOf(
                uint(floor(xy.y / 2.0)), 
                uint(floor(iFrame / (60.0 / (24.0 * kCaptureTimeSpeed))))
            )
        );
        vec4 xi = Rand();
        if(xi.x < interP) 
        {  
            float mag = mix(-1.0, 1.0, xi.y);        
            xy.x -= displacement * sign(mag) * sqr(abs(mag)); 
        }
    }

    if(kVDisplace && frameHash > 1.0 - kVDisplaceFrequency)
    {
        float dispX = HashToFloat(HashOf(8783u, uint(floor(iFrame / (10.0 / kCaptureTimeSpeed)))));
        float dispY = HashToFloat(HashOf(364719u, uint(floor(iFrame / (12.0 / kCaptureTimeSpeed)))));

        if(xy.y < dispX * res.y) 
        { 
            xy.y -= mix(-1.0, 1.0, dispY) * res.y * 0.2; 
            isDisplaced = true;
            tint = vec3(3.0);
        }
    }
    else if(kHDisplace && frameHash > 1.0 - kHDisplaceFrequency - kVDisplaceFrequency)
    {
        float dispX = HashToFloat(HashOf(147251u, uint(floor(iFrame / (9.0 / kCaptureTimeSpeed)))));
        float dispY = HashToFloat(HashOf(287512u, uint(floor(iFrame / (11.0 / kCaptureTimeSpeed)))));
        float dispZ = HashToFloat(HashOf(8756123u, uint(floor(iFrame / (7.0 / kCaptureTimeSpeed)))));    

        if(xy.y > dispX * res.y && xy.y < (dispX + mix(0.0, kHDisplaceVMagnitude, dispZ)) * res.y) 
        { 
            xy.x -= mix(-1.0, 1.0, dispY) * res.x * kHDisplaceHMagnitude; 
            isDisplaced = true;
            tint = vec3(3.0);
        }
    }
        
        return isDisplaced;
    }

    void main() {
        vec2 uv = vUV;
        vec2 xy = uv * iResolution.xy;

        SetGlobals(xy, iResolution.xy, iTime);

        vec3 tint = vec3(1.0);

        vec2 xyInterfere = xy;
        bool isDisplaced = Interfere(xyInterfere, tint, iResolution.xy);

        // Sample displaced UVs so bands shift content rather than only posterising in place.
        vec2 uvSample = clamp(xyInterfere / iResolution.xy, vec2(0.0), vec2(1.0));
        vec3 original = texture2D(textureSampler, uvSample).rgb;

        float blend = 0.0;
        vec3 effect = Render(xyInterfere, 0, 1, isDisplaced, 0.0, blend);

        vec3 rgb = mix(original, effect * 0.3, 0.0001);

        if (isDisplaced) {
            // More levels + round: keeps dark loading UI (~0.1) from collapsing to black
            // without the old tint*3 blowout that turned game-scene bands white.
            #define kColourQuantisation 10.0
            rgb = floor(rgb * kColourQuantisation + 0.5) / kColourQuantisation;
        }

        gl_FragColor = vec4(rgb, 1.0);
    }
`;

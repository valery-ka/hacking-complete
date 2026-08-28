export const SHATTER_SHADER = `
    precision highp float;
    varying vec2 vUV;
    uniform sampler2D textureSampler;
    uniform float time;

    float rand(float x){ 
        return fract(sin(x*12.9898)*43758.5453); 
    }

    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
    }

    void main(void){
        vec2 uv = vUV;
        
        float band = floor(uv.y * 5.0);
        if(rand(band + floor(time*2.0)) > 0.95){
            uv.y += 0.1 * (rand(band*10.0 + time) - 0.5);
            uv.x += 0.5 * (rand(band*10.0 + time*0.1) - 0.5);
        }
        
        vec4 col;
        col.r = texture2D(textureSampler, uv + vec2(0.005,0.0)).r;
        col.g = texture2D(textureSampler, uv).g;
        col.b = texture2D(textureSampler, uv - vec2(0.005,0.0)).b;
        col.a = 1.0;
        
        float scanLine = sin(uv.y * 10.0 + time * 5.0) * 0.1;
        
        float noiseIntensity = rand(floor(uv.y * 200.0) + time * 10.0);
        float noiseTrigger = rand(floor(time * 3.0));
        
        float whiteLine = 0.0;
        if(rand(floor(uv.y * 50.0) + floor(time * 5.0)) > 0.998) {
            whiteLine = 0.3 * rand(uv.y + time);
        }
        
        float grayNoise = 0.0;
        if(noiseTrigger > 0.7) {
            grayNoise = (rand(uv + time) - 0.5) * 0.15 * noiseIntensity;
        }
        
        float flicker = 0.95 + 0.05 * rand(floor(time * 20.0));
        
        col.rgb += scanLine + whiteLine + grayNoise;
        col.rgb *= flicker;
        
        col.rgb = clamp(col.rgb, 0.0, 1.0);
        
        gl_FragColor = col;
    }
`;

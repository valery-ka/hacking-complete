// Provided by dyvoid. Shadertoy link:
// https://www.shadertoy.com/view/XtK3W3

export const VIDEO_GLITCH_BY_DYVOID = `
    precision highp float;

    varying vec2 vUV;
    uniform vec2 iResolution;
    uniform float iTime;
    uniform float iFrame;
    uniform sampler2D textureSampler;

    vec3 mod289(vec3 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
    }

    vec2 mod289(vec2 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
    }

    vec3 permute(vec3 x) {
        return mod289(((x*34.0)+1.0)*x);
    }

    float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                            0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                            -0.577350269189626,  // -1.0 + 2.0 * C.x
                            0.024390243902439); // 1.0 / 41.0
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);

        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;

        i = mod289(i);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
                + i.x + vec3(0.0, i1.x, 1.0 ));

        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;

        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;

        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
    }

    float rand(vec2 co) {
        return fract(sin(dot(co.xy,vec2(12.9898,78.233))) * 43758.5453);
    }

    void main(void)
    {
        vec2 uv = vUV;
        vec2 fragCoord = uv * iResolution.xy;
        
        float time1 = iTime * 0.1;
        float time2 = iTime;
        float time3 = iTime;
        
        float noise = max(0.0, snoise(vec2(time1, uv.y * 0.3)) - 0.3) * (1.0 / 0.7);
        
        noise = noise + (snoise(vec2(time2*10.0, uv.y * 2.4)) - 0.5) * 0.15;
        
        float xpos = uv.x - noise * noise * 0.25;
        vec4 originalColor = texture2D(textureSampler, vec2(xpos, uv.y));
        
        gl_FragColor = originalColor;
        gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(rand(vec2(uv.y * time3))), noise * 0.3).rgb;
        
        if (floor(mod(fragCoord.y * 0.25, 2.0)) == 0.0)
        {
            gl_FragColor.rgb *= 1.0 - (0.15 * noise);
        }
        
        vec4 texG = texture2D(textureSampler, vec2(xpos + noise * 0.05, uv.y));
        vec4 texB = texture2D(textureSampler, vec2(xpos - noise * 0.05, uv.y));
        
        gl_FragColor.g = mix(gl_FragColor.r, texG.g, 0.25);
        gl_FragColor.b = mix(gl_FragColor.r, texB.b, 0.25);
    }
`;

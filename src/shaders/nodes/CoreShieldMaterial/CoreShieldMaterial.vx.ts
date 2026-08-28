export const CORE_SHIELD_MATERIAL_VX = `
	attribute vec3 position;
	attribute vec2 uv;

	attribute vec2 uv_offset;
    attribute vec3 tint;
    attribute vec4 world0;
    attribute vec4 world1;
    attribute vec4 world2;
    attribute vec4 world3;

	uniform mat4 world;
	uniform mat4 viewProjection;
    
	varying vec2 vUV;
    varying vec3 vTint;
    
	void main(void) {
        #include<instancesVertex>

        vec4 worldPos = finalWorld * vec4(position, 1.0);
        gl_Position = viewProjection * worldPos;
        vUV = uv;
        vTint = tint;
	}
`;

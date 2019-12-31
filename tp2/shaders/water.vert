
attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;
uniform sampler2D uSampler2;

uniform float normScale;
uniform float time;
uniform float texscale;

void main() {
	vec3 offset=vec3(0.0,0.0,0.0);

    vTextureCoord = aTextureCoord*vec2(texscale, texscale);
    
    vTextureCoord = vTextureCoord + vec2(time, time);

	vec4 color = texture2D(uSampler2, vTextureCoord);
	float value = (color.r + color.g + color.b)/3.0-1.0;

	offset=aVertexNormal * normScale * value;

	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition+offset, 1.0);
}
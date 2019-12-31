#ifdef GL_ES
precision highp float;
#endif

struct lightProperties {
    vec4 position;                  
    vec4 ambient;                   
    vec4 diffuse;                   
    vec4 specular;                  
    vec4 half_vector;
    vec3 spot_direction;            
    float spot_exponent;            
    float spot_cutoff;              
    float constant_attenuation;     
    float linear_attenuation;       
    float quadratic_attenuation;    
    bool enabled;                   
};

#define NUMBER_OF_LIGHTS 6
uniform lightProperties uLight[NUMBER_OF_LIGHTS];

varying vec2 vTextureCoord;

uniform sampler2D uSampler;

void main() {
	vec4 color = vec4(1.0, 1.0, 1.0, 1.0);
	for(int i = 0; i < NUMBER_OF_LIGHTS; i++)
		if(!uLight[i].enabled)
			color = color * uLight[i].diffuse;
	
	gl_FragColor = color * texture2D(uSampler, vTextureCoord);
}

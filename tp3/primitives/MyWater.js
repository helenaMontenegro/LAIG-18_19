/**
 * MyWater class, representing the cylinder.
 */
class MyWater extends CGFobject
{
	
	constructor(scene, idtexture, idwavemap, parts, heightscale, texscale)
	{	
        super(scene);
        this.plane = new MyPlane(this.scene, parts, parts);
        this.shader=new CGFshader(this.scene.gl, "shaders/water.vert", "shaders/water.frag");
        this.shader.setUniformsValues({uSampler2: 1});
        this.shader.setUniformsValues({normScale: heightscale});
        this.shader.setUniformsValues({texscale: texscale});
        this.heightMap=this.scene.graph.textures[idwavemap];
        this.texture=this.scene.graph.textures[idtexture];
        this.t = 0;
	};
    
    /**
    *Display of the water
    */
    display()
    {
        this.t = this.t + this.scene.deltaT;
        this.shader.setUniformsValues({time: this.t/25.0});
        this.scene.setActiveShader(this.shader);
        this.heightMap.bind(1);
        this.scene.pushMatrix();
            this.scene.scale(70,80,1);
            this.texture.bind(0);
            this.plane.display();
        this.scene.popMatrix();
        this.scene.setActiveShader(this.scene.defaultShader);
    };
};
/**
 * MyTerrain class, representing the terrain.
 */
class MyTerrain extends CGFobject
{
    constructor(scene,idtexture, idheightmap, parts, heightscale)
	{	
        super(scene);
        this.plane = new MyPlane(this.scene, parts, parts);
        this.shader=new CGFshader(this.scene.gl, "shaders/terrain.vert", "shaders/terrain.frag");
        this.shader.setUniformsValues({uSampler2: 1});
        this.shader.setUniformsValues({normScale: heightscale});
        this.heightMap=this.scene.graph.textures[idheightmap];
        this.texture=this.scene.graph.textures[idtexture];
	};
    /**
    *Display of the Terrain
    */
    display()
    {
        this.scene.setActiveShader(this.shader);
        this.heightMap.bind(1);
        this.scene.pushMatrix();
            this.scene.scale(60,70,1);
            this.texture.bind(0);
            this.plane.display();
        this.scene.popMatrix();
        this.scene.setActiveShader(this.scene.defaultShader);
    };
};
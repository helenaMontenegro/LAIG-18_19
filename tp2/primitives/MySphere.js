/**
 * MySphere class, representing the Sphere.
 */
class MySphere extends CGFobject
{
    /**
    * MySphere
    * @constructor
    * @param scene the scene where the sphere belongs to
    * @param radius the sphere
    * @param slices sphere parallels
    * @param stacks sphere meridians
    */
	constructor(scene, radius, slices, stacks)
	{	
		super(scene);
		this.radius = radius;
		this.sphere = new MyUnitSphere(scene, slices, stacks);
	};
    
    /**
     *Displays the sphere with the appropriate radius.
     */
    display()
    {
        this.scene.pushMatrix();
            this.scene.scale(this.radius, this.radius, this.radius);
            this.sphere.display();
        this.scene.popMatrix();
    };
};
/**
 * MyCylinder class, representing the cylinder.
 */
class MyCylinder extends CGFobject
{
	/**
 	* MyCylinder
 	* @constructor
 	* @param scene the scene where the cylinder belongs to
    * @param base the cylinder base
    * @param top the cylinder top
    * @param height the cylinder height
    * @param slices cylinder divisions on circumferences
    * @param stacks cylinder divisions according to z axis
 	*/
	constructor(scene, base, top, height, slices, stacks)
	{	
		super(scene);
		this.height = height;
		this.base = base;
		this.top = top;
		this.body = new MyCylinderBody(scene, base, top, slices, stacks);
	    this.cylinderBase = new MyCylinderBase(scene,slices);
	    this.cylinderTop = new MyCylinderBase(scene,slices);
	};
    
    /**
    *Display of the cylinder
    */
    display()
    {
        this.scene.pushMatrix();
            //Displaying the top of the cylinder
            this.scene.pushMatrix();
                this.scene.translate(0, 0, this.height);
                this.scene.scale(this.top, this.top, 1);
                this.cylinderBase.display();
            this.scene.popMatrix();

            //Displaying the bottom of the cylinder
            this.scene.pushMatrix();
                this.scene.rotate(Math.PI, 1, 0, 0);
                this.scene.scale(this.base, this.base, 1);
                this.cylinderBase.display();
            this.scene.popMatrix();   
                     
			//Displaying the body of the cylinder
            this.scene.scale(1, 1, this.height);
            this.body.display();
        this.scene.popMatrix();
    };
};
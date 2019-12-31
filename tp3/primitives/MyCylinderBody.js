/**
 * MyCylinderBody class, representing the cylinder body.
 */
class MyCylinderBody extends CGFobject
{
	/**
 	* MyCylinderBody
 	* @constructor
 	* @param scene the scene where the cylinder`s body belongs to
    * @param base the cylinder`s body base
    * @param top the cylinder`s top
    * @param slices cylinder divisions on circumferences
    * @param stacks cylinder divisions according to z axis
 	*/
	constructor(scene, base, top, slices, stacks)
	{
		super(scene);
		this.base = base;
		this.top = top;
		this.slices = slices;
		this.stacks = stacks;
		this.initBuffers();
	};

	/**
	 * Fill the buffer with the values that define a cylinder`s body.
	 * this.angle is the increment on the angle to draw each slice and
	 *  this.angle2 will be incremented according to this.angle.
	 * baseIncrement is the variable that will change the radius of the cylinder
	 *  in each stack, when the radius for the top and the one for the base are different.
	 */

	initBuffers() 
	{
		this.angle = 360/this.slices * Math.PI / 180;
		this.vertices = [
		];

		this.indices = [
		];

		this.normals = [
		];

		this.texCoords = [];
		this.angle2 = this.angle;
		var n = 0;
		var baseIncrement = (this.base-this.top)/this.stacks;
		var b=this.base;
		for(var j = 0; j < this.stacks; j++)
		{
			for(var i = 0; i <= this.slices; i++)
			{
				this.vertices.push(Math.cos(this.angle2)*b, Math.sin(this.angle2)*b, j/this.stacks);
				this.vertices.push(Math.cos(this.angle2)*(b-baseIncrement), Math.sin(this.angle2)*(b-baseIncrement), (j+1)/this.stacks);
				this.normals.push(Math.cos(this.angle2)*b, Math.sin(this.angle2)*b, 0);
				this.normals.push(Math.cos(this.angle2)*(b-baseIncrement), Math.sin(this.angle2)*(b-baseIncrement), 0);
				this.angle2 = this.angle2 + this.angle;
				this.texCoords.push(i/this.slices,j/this.stacks);
				this.texCoords.push(i/this.slices,(j+1)/this.stacks);
			}
			b -= baseIncrement;
			this.angle2=this.angle;

			for(var i = 0; i <= this.slices * 2; i=i+2)
			{
				if (i != this.slices*2)
				{
					this.indices.push(n, n+2, n+1);
					this.indices.push(n+3, n+1, n+2);
				}
				n+=2;
			}
		}
		
		this.primitiveType=this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};
};

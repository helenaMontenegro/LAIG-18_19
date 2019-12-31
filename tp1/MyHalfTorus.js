/**
 * MyHalfTorus Class which creates half a Torus.
 */
class MyHalfTorus extends CGFobject
{
	/**
	 * Constructor of this class.
	 * We interpreted the outer to be the outside radius of the Torus and
     * inner the inside radius. Therefore, this.outer = outer+inner and
     * this.inner = outer-inner. 
	 * Also, in this function, we aren't taking into consideration this.outer
	 * and we're drawing the half Torus with outer=1 and inner being a fraction:
	 * this.inner = (outer-inner)/this.outer
	 */
	constructor(scene, inner, outer, slices, loops)
	{
		super(scene);
		this.slices = slices;
		this.stacks = loops;
		this.outer = outer+inner;
		this.inner = (outer-inner)/this.outer; //smaller radius from 0 to 1.
		this.initBuffers();
	};

	/**
	 * Function that creates the half Torus.
	 * this.angle represents the increment the angles should take to draw 
	 *  the half Torus' slices.
	 * this.angle2 represents the angle that is being incremented with 
	 *  this.angle.
	 * this.angle3 represents the increment the angles should take to 
	 *  draw the half Torus.
	 * this.angle4 is the angle incremented by this.angle3.
	 * this.angle5 is the angle that only affects the z coordinate and that is 
	 *  incremented while z is growing (this.direction=false) or decremented
	 * 	while z is decreasing (this.direction=true)
	 * The cycle with var j draws the stacks (loops) and the var with i
	 *  draws the slices. After drawing every slice in one stack, the indices
	 *  are calculated.
	 */
	initBuffers() 
	{
		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];
		
		this.angle = 360/this.slices* Math.PI / 180;
		this.angle2 = this.angle;
		this.angle3 = Math.acos(this.inner)/this.stacks;
		this.angle4 = 90*degToRad;
		this.angle5 = 90*degToRad;
		this.direction = true; //z growing -> false; z decreasing -> true

		var n = 0;
		for(var j = 0; j < this.stacks-1; j++)
		{

		    if(j == this.stacks/2-1) 
		      this.direction = false; 
			for(var i = 0; i < this.slices; i++)
			{		      
				this.vertices.push(Math.sin(this.angle4)*Math.cos(this.angle2), Math.sin(this.angle4)*Math.sin(this.angle2), Math.cos(this.angle5));
				this.normals.push(Math.sin(this.angle4)*Math.cos(this.angle2), Math.sin(this.angle4)*Math.sin(this.angle2), Math.cos(this.angle5));
				this.texCoords.push(1-(Math.sin(this.angle4)*Math.cos(this.angle2)+1)/2, (Math.sin(this.angle4)*Math.sin(this.angle2)+1)/2);
				this.angle4 = this.angle4 - this.angle3;
				if(this.direction)
						this.angle5 = this.angle5 - this.angle3;
				else
				     this.angle5 = this.angle5 + this.angle3;
				this.vertices.push(Math.sin(this.angle4)*Math.cos(this.angle2), Math.sin(this.angle4)*Math.sin(this.angle2), Math.cos(this.angle5));
				this.normals.push(Math.sin(this.angle4)*Math.cos(this.angle2), Math.sin(this.angle4)*Math.sin(this.angle2), Math.cos(this.angle5));
				this.texCoords.push(1-(Math.sin(this.angle4)*Math.cos(this.angle2)+1)/2, (Math.sin(this.angle4)*Math.sin(this.angle2)+1)/2);
				this.angle2 = this.angle2 + this.angle;
				this.angle4 = this.angle4 + this.angle3;
				if(this.direction)
						this.angle5 = this.angle5 + this.angle3;
				else
				     this.angle5 = this.angle5 - this.angle3;
			}

        	this.angle4 = this.angle4 - this.angle3;
		 	if(j < this.stacks/2-1)
			  	this.angle5 = this.angle5 - this.angle3;
		 	else 
		      	this.angle5 = this.angle5 + this.angle3;

			for(var i = 0; i < this.slices * 2; i=i+2)
			{
				if (i != this.slices*2 - 2)
				{
					this.indices.push(n, n+2, n+1);
					this.indices.push(n+3, n+1, n+2);
				}
				else
				{
					this.indices.push(n-this.slices*2+3, n, n-this.slices*2+2);
					this.indices.push(n, n-this.slices*2+3, n+1);
				}
				n+=2;
			}
		}
		this.primitiveType=this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};
};
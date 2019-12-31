/**
 * MyUnitSphere - responsible for drawing a sphere with radius = 1.
 */

class MyUnitSphere extends CGFobject
{
	/**
	 * The constructor recieves the numebr of slices and stacks.
	 */
	constructor(scene, slices, stacks)
	{
		super(scene);
		this.slices = slices;
		this.stacks = stacks;
		this.initBuffers();
	};

	/**
	 * Function that builds the sphere.
	 * this.angle is the angle increment according to the number of slices.
	 * this.angle2 is going to be incremented in each slice with this.angle.
	 * this.angle3 is the angle increment (decrement in this case) according 
	 *  to the number of stacks.
	 * this.angle4 is the angle that will be decremented with this.angle3.
	 */
	initBuffers() 
	{
		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];
		
		this.angle = 360/this.slices * Math.PI / 180;
		this.angle2 = this.angle;
		this.angle3 = 180/this.stacks * degToRad;
		this.angle4 = 180*degToRad;

		var n = 0;
		for(var j = 0; j < this.stacks-1; j++)
		{
			for(var i = 0; i < this.slices; i++)
			{
				this.vertices.push(Math.sin(this.angle4)*Math.cos(this.angle2), Math.sin(this.angle4)*Math.sin(this.angle2), Math.cos(this.angle4));
				this.normals.push(Math.sin(this.angle4)*Math.cos(this.angle2), Math.sin(this.angle4)*Math.sin(this.angle2), Math.cos(this.angle4));
				this.texCoords.push(1-(Math.sin(this.angle4)*Math.cos(this.angle2)+1)/2, (Math.sin(this.angle4)*Math.sin(this.angle2)+1)/2);
				this.angle4 = this.angle4 - this.angle3;
				this.vertices.push(Math.sin(this.angle4)*Math.cos(this.angle2), Math.sin(this.angle4)*Math.sin(this.angle2), Math.cos(this.angle4));
				this.normals.push(Math.sin(this.angle4)*Math.cos(this.angle2), Math.sin(this.angle4)*Math.sin(this.angle2), Math.cos(this.angle4));
				this.texCoords.push(1-(Math.sin(this.angle4)*Math.cos(this.angle2)+1)/2, (Math.sin(this.angle4)*Math.sin(this.angle2)+1)/2);
				this.angle2 = this.angle2 + this.angle;
				this.angle4 = this.angle4 + this.angle3;
			}

			this.angle4 = this.angle4 - this.angle3;

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
		
		this.vertices.push(0, 0, 1);
		this.normals.push(0, 0, 1);
		this.texCoords.push(0.5,0.5);
		var k = n;
		var y = n-1;
		for(var m = 0; m < this.slices; m++)
		{
			n-=2;
			if(m != this.slices - 1)
				this.indices.push(k, n-1, n+1);
			else
				this.indices.push(k, y, n+1);
		}
		this.primitiveType=this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};
};

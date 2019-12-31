/**
 * MyRectangle class, responsible for drawing a rectangle.
 */
class MyRectangle extends CGFobject
{
	/**
	 * Constructor for the rectangle which receives the coordinates for
	 *  the rectangle.
	 */
	constructor(scene, x1, x2, y1, y2, minS, maxS, minT, maxT) 
	{
		super(scene);
		this.x1 = x1;
		this.x2 = x2;
		this.y1 = y1;
		this.y2 = y2;
		this.minS = minS;
		this.maxS = maxS;
		this.minT = minT;
		this.maxT = maxT;
		this.initBuffers();
	};
	/**
	 * Function that builds the rectangle according to its coordinates.
	 */
	initBuffers() 
	{
		this.vertices = [
			this.x1, this.y1, 0,
			this.x2, this.y1, 0,
			this.x1, this.y2, 0,
			this.x2, this.y2, 0
		];

		this.indices = [
			0, 1, 2, 
			3, 2, 1
		];

		this.normals = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1
		];

		this.texCoords = [
			this.minS, this.maxT,
			this.maxS, this.maxT,
			this.minS, this.minT,
			this.maxS, this.minT
		];

			
		this.primitiveType=this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};

	/**
	 * Function that alters the maxS and maxT according to length_s and length_t.
	 */
	alterLengthST(length_s, length_t)
	{
		this.maxS=(this.x2-this.x1)/length_s;
		this.maxT=(this.y2-this.y1)/length_t;
		this.texCoords = [
			this.minS, this.maxT,
			this.maxS, this.maxT,
			this.minS, this.minT,
			this.maxS, this.minT
		];
		this.initGLBuffers();
	};
};

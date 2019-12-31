/**
 * MyTriangle class responsible for drawing a triangle.
 */
class MyTriangle extends CGFobject
{
	/**
	 * Constructor of the triangle. It receives the coordinates
	 * for the three points of the triangle and makes vectorr for them.
	 */
	constructor(scene,x1,y1,z1,x2,y2,z2,x3,y3,z3)
	{
		super(scene);
		
		this.v1 = vec3.fromValues(x1, y1, z1);
		this.v2 = vec3.fromValues(x2, y2, z2);
		this.v3 = vec3.fromValues(x3, y3, z3);

		this.initBuffers();
	};

	/**
	 * The triangle is initialized here.
	 * In the textures, the maxS and maxT are equal to the size
	 * if the edge between points 2 and 3 (this.c). This way, this edge
	 * is coincident with the bottom of the texture.
	 */
	initBuffers() 
	{
		this.vertices = [
			this.v1[0],this.v1[1],this.v1[2],
			this.v2[0],this.v2[1],this.v2[2],
			this.v3[0],this.v3[1],this.v3[2]
		];

		this.indices = [0, 1, 2];

		// vector AB =B-A
		var AB = vec3.create();
		vec3.sub(AB, this.v2, this.v1);

		// vector AC =C-A
		var AC = vec3.create();
		vec3.sub(AC, this.v3, this.v1);

		// vector BC =C-B
		var BC = vec3.create();
		vec3.sub(BC, this.v3, this.v2);

		var Normals = vec3.create();
		vec3.cross(Normals, AB, BC);
		vec3.normalize(Normals, Normals);

		this.normals = [
			Normals[0], Normals[1], Normals[2],
			Normals[0], Normals[1], Normals[2],
			Normals[0], Normals[1], Normals[2],
		];
		
		this.a = vec3.length(AC); 
		this.b = vec3.length(AB); 
		this.c = vec3.length(BC);
		this.maxS1=this.c;
		this.maxT1=this.c;
		var cosB = (Math.pow(this.a,2) - Math.pow(this.b,2) + Math.pow(this.c,2))/(2*this.a*this.c);
		this.xA = this.c-this.a*cosB;
		this.aux = Math.sqrt(Math.pow(this.a,2)-Math.pow(this.a*cosB, 2));
		this.yA = this.maxT1-this.aux;
		
		this.originalTexCoords = [
			this.xA, this.yA,
			0, this.maxT1,
			this.c, this.maxT1
		];

		this.texCoords = this.originalTexCoords.slice(0);

		this.primitiveType=this.scene.gl.TRIANGLES;

		this.initGLBuffers();
	};

	/**
	 * Function to adjust the texture coordinates according to length_s
	 * and length_t, in which all the variables in the original texture
	 * coordinates are divided by length_s or length_t.
	 */
	alterLengthST(length_s, length_t)
		{
			this.maxS=this.maxS1/length_s;
			this.maxT=this.maxT1/length_t;
			this.xA1=this.xA/length_s;
			this.yA1=this.yA/length_t;
			this.c=this.maxS;
			this.originalTexCoords = [
				this.xA1, this.yA1,
				0, this.maxT,
				this.c, this.maxT
			];
			this.texCoords = this.originalTexCoords.slice(0);
			this.initGLBuffers();
		};
};

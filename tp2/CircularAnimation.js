class CircularAnimation extends Animation //add transformations to object's matrix
{
	constructor(scene, center, radius, initialAngle, rotationAngle, totalTime) 
	{
		super(scene);
		this.center = center;
		this.radius=radius;
		this.initialAngle = initialAngle;
		this.rotationAngle = rotationAngle;
		this.totalTime = totalTime;
		this.auxAngle=this.initialAngle; //angulo ja percorrido
		this.dAngle = 0;
	};

	reset()
	{
		this.auxAngle = this.initialAngle;
		this.dAngle=0;
		this.end=false;
	}

	update(deltaT)
	{
		if(this.auxAngle > (this.initialAngle + this.rotationAngle))
		{
			this.end=true;
			return;
		}
		this.dAngle = this.rotationAngle*deltaT/this.totalTime;
		this.auxAngle+=this.dAngle;
	};

	apply(){
		this.scene.translate(this.center[0], this.center[1], this.center[2]);
		this.scene.rotate(this.auxAngle, 0, 1, 0);
		this.scene.translate(0, 0, this.radius);
		this.scene.rotate(90*degToRad, 0,1,0);
	};
};
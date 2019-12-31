/**
 * MyTorus Class which joins two halfTorus to build one complete Torus.
 */
class MyTorus extends CGFobject
{
    /**
     * Constructor for this class.
     * We interpreted the outer to be the outside radius of the Torus and
     * inner the inside radius. Therefore, this.outer = outer+inner and
     * this.inner = outer-inner.
     */
	constructor(scene, inner, outer, slices, loops)
	{	
		super(scene);
		this.outer = outer+inner;
	    this.half1 = new MyHalfTorus(scene,inner, outer, slices, loops);
	    this.half2 = new MyHalfTorus(scene,inner, outer, slices, loops);
	};
    
    /**
     * Display function which puts both halfs of the Torus together.
     * The outer on MyHalfTorus is the unity, and the inner there is a fraction
     * calculated with the actually outer value. In this function the size of
     * the Torus is corrected using a scale transformation.
     */
    display()
    {
        this.scene.pushMatrix();
            this.scene.scale(this.outer, this.outer, 0.5*this.outer);
            this.half1.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
            this.scene.rotate(-180*degToRad, 1, 0, 0);
            this.scene.scale(this.outer, this.outer, 0.5*this.outer);
            this.half2.display();
        this.scene.popMatrix();
    };
};
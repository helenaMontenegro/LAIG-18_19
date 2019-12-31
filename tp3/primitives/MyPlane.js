/**
 * MyPlane class, representing the plane.
 */
class MyPlane extends CGFobject
{	
	constructor(scene, npartsU, npartsV)
	{	
		super(scene);
	
        
        var controlpoints=[
            [
                 [-0.5, -0.5, 0.0, 1 ],
                 [-0.5,  0.5, 0.0, 1 ]
                
            ],
            [ 
                 [ 0.5, -0.5, 0.0, 1 ],
                 [ 0.5,  0.5, 0.0, 1 ]							 
            ]
        ];

        var nurbsSurface = new CGFnurbsSurface(1, 1, controlpoints);

        this.plane = new CGFnurbsObject(this.scene, npartsU, npartsV, nurbsSurface ); 
	};
    
    /**
    *Display of the cylinder
    */
    display()
    {
        this.plane.display();
    };
};
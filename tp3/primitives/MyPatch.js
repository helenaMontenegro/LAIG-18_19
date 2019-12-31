/**
 * MyPatch class, representing the patch.
 */
class MyPatch extends CGFobject
{
	
	constructor(scene, npointsU, npointsV, npartsU, npartsV, controlpoints)
	{	
        super(scene);
        
		var nurbsSurface = new CGFnurbsSurface(npointsU-1, npointsV-1, controlpoints);

		this.patch = new CGFnurbsObject(this.scene, npartsU, npartsV, nurbsSurface);
	};
    
    /**
    *Display of the patch
    */
    display()
    {
        this.patch.display();
    };
};
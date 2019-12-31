/**
 * MyCylinder2 class, representing the cylinder.
 */
class MyCylinder2 extends CGFobject
{
	
	constructor(scene, base, top, height, slices, stacks)
	{	
        super(scene);
        
        var controlpoints = [
            //down
            [
                [-base,0,0,1],
                [-top,0,height,1]
            ],
            [
                [-base,-base,0,1],
                [-top,-top, height,1]
            ],
            [
                [0,-base,0,1],
                [0,-top, height,1]
            ],
            [
                [base,-base,0,1],
                [top,-top, height,1]
            ],
            [
                [base,0,0,1],
                [top,0, height,1]
            ],
            //up
            [
                [base,base,0,1],
                [top,top, height,1]
            ],
            [
                [0,base,0,1],
                [0,top, height,1]
            ],
            [
                [-base,base,0,1],
                [-top,top, height,1]
            ],
            //repeated node
            [
                [-base,0,0,1],
                [-top,0,height,1]
            ]
        ];

        this.cylinder2 = new MyPatch(this.scene, 9, 2, slices, stacks, controlpoints);
		
	};
    
    /**
    *Display of the cylinder
    */
    display()
    {
        this.cylinder2.display();
    };
};
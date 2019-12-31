/**
 * MyVehicle class, representing the vehicle.
 */
class MyVehicle extends CGFobject
{
	
	constructor(scene)
	{	
        super(scene);
        var height = 3.5;
        var heightBody = 3.6;
        var base = 0.15;
        var top = 0.2;
        this.body = new MyCylinder2(this.scene, base, top, heightBody, 20, 20);// base, top, height, slices, stacks
        this.antenna = new MyCylinder(this.scene, 0.02, 0.02, 0.8, 20, 20);

        var controlpoints = 
        [
            [
                [-base, 0, (height-0.2)*1.5-height/3-0.5,1],
                [-base, -0.1, (height-height/6)*1.5-height/3-0.5,1],
                [-base, 0, (height-height/3)*1.5-height/3-0.5,1]
            ],
            [
                [-base-1, 0, (height+0.3)*1.5-height/3-0.5,1],
                [-base-1, -0.1, (height-height/6+0.1)*1.5-height/3-0.5,1],
                [-base-1, 0, (height-height/3)*1.5-height/3-0.5,1]
            ],
            [
                [-base-2, 0, (height+0.5)*1.5-height/3-0.5,1],
                [-base-2, -0.1, (height-height/6+0.4)*1.5-height/3-0.5,1],
                [-base-2, 0, (height-height/3+0.4)*1.5-height/3-0.5,1]
            ],
            [
                [-base-3, 0, (height+0.2)*1.5-height/3-0.5,1],
                [-base-3, 0, (height+0.15)*1.5-height/3-0.5,1],
                [-base-3, 0, (height+0.1)*1.5-height/3-0.5,1]
            ]
        ];

        this.wing1 = new MyPatch(this.scene, 4, 3, 20, 20, controlpoints);//npointsU, npointsV, npartsU, npartsV, controlpoints

        var controlpoints3 = 
        [
            [
                [base, 0, (height-height/3)*1.5-height/3-0.5,1],
                [base, -0.1, (height-height/6)*1.5-height/3-0.5,1],
                [base, 0, (height-0.2)*1.5-height/3-0.5,1]
            ],
            [
                [base+1, 0, (height-height/3)*1.5-height/3-0.5,1],
                [base+1, -0.1, (height-height/6+0.1)*1.5-height/3-0.5,1],
                [base+1, 0, (height+0.3)*1.5-height/3-0.5,1]
            ],
            [
                [base+2, 0, (height-height/3+0.4)*1.5-height/3-0.5,1],
                [base+2, -0.1, (height-height/6+0.4)*1.5-height/3-0.5,1],
                [base+2, 0, (height+0.5)*1.5-height/3-0.5,1]
            ],
            [
                [base+3, 0, (height+0.1)*1.5-height/3-0.5,1],
                [base+3, 0, (height+0.15)*1.5-height/3-0.5,1],
                [base+3, 0, (height+0.2)*1.5-height/3-0.5,1]
            ]
        ];

        this.wing2 = new MyPatch(this.scene, 4, 3, 20, 20, controlpoints3);//npointsU, npointsV, npartsU, npartsV, controlpoints
        
        var controlpoints1 = 
        [
            [
                [-base, 0, height*2/3,1],
                [-base, -0.1, height/2,1],
                [-base, -0.1, height/4,1],
                [-base, 0, 0, 1]
            ],
            [
                [-base-1, 0, height*2/3,1],
                [-base-1, -0.4, height/2,1],
                [-base-1, -0.4, height/4-0.5,1],
                [-base-1, 0, -0.5, 1]
            ],
            [
                [-base-2, 0, height*2/3,1],
                [-base-2, -0.2, height/2,1],
                [-base-2, -0.2, height/4-0.5,1],
                [-base-2, 0, -0.5, 1]
            ],
            [
                [-base-2.5, 0, height/3+0.2,1],
                [-base-2.5, 0, height/3,1],
                [-base-2.5, 0, height/3,1],
                [-base-2.5, 0, height/3-0.2, 1]
            ]
        ];

        this.fatWing = new MyPatch(this.scene, 4, 4, 20, 20, controlpoints1);//npointsU, npointsV, npartsU, npartsV, controlpoints

        var controlpoints2 = 
        [
            [
                [base, 0, 0, 1],
                [base, -0.1, height/4,1],
                [base, -0.1, height/2,1],
                [base, 0, height*2/3,1]
            ],
            [
                [base+1, 0, -0.5, 1],
                [base+1, -0.4, height/4-0.5,1],
                [base+1, -0.4, height/2,1],
                [base+1, 0, height*2/3,1]
            ],
            [
                [base+2, 0, -0.5, 1],
                [base+2, -0.2, height/4-0.5,1],
                [base+2, -0.2, height/2,1],
                [base+2, 0, height*2/3,1]
            ],
            [
                [base+2.5, 0, height/3-0.2, 1],
                [base+2.5, 0, height/3,1],
                [base+2.5, 0, height/3,1],
                [base+2.5, 0, height/3+0.2,1]
            ]
        ];

        this.fatWing2 = new MyPatch(this.scene, 4, 4, 20, 20, controlpoints2);//npointsU, npointsV, npartsU, npartsV, controlpoints
        this.bodyTexture = new CGFtexture(this.scene, "./scenes/images/gray.jpg");
	};
    
    /**
    *Display of the vehicle
    */
    display()
    {
        this.scene.pushMatrix();
        this.scene.rotate(220*degToRad, 0, 0, 1);

	    this.wing1.display();
        this.fatWing.display();
        this.scene.pushMatrix();
            this.scene.rotate(180*degToRad,0,0,1);
	    	this.wing2.display();
	        this.fatWing2.display();
	    this.scene.popMatrix();

	    this.scene.pushMatrix();
	    	this.scene.rotate(100*degToRad,0,0,1);
	    	this.wing1.display();
            this.fatWing.display();
            this.scene.pushMatrix();
                this.scene.rotate(180*degToRad,0,0,1);
	    	    this.wing2.display();
	            this.fatWing2.display();
	        this.scene.popMatrix();
        this.scene.popMatrix();

        this.bodyTexture.bind();
        this.body.display();
        this.scene.pushMatrix();
	    	this.scene.translate(-0.1,-0.1,3.7);
	    	this.head = new MySphere(this.scene,0.38,20,20);
	    	this.head.display();
	    this.scene.popMatrix();

	    this.scene.pushMatrix();
	    	this.scene.translate(0,-0.3,3.8);
	    	this.scene.rotate(30*degToRad,1,0,0);
	    	this.antenna.display();
	    this.scene.popMatrix();

	     this.scene.pushMatrix();
	    	this.scene.translate(-0.3,0,3.8);
	    	this.scene.rotate(-30*degToRad,1,0,0);
	    	this.scene.rotate(-30*degToRad,0,1,0);
	    	this.antenna.display();
        this.scene.popMatrix();
        this.bodyTexture.unbind();

        this.scene.popMatrix();
    };
};
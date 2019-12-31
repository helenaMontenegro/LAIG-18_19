// degrees to radians 
var degToRad = Math.PI / 180;

/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
        super();

        this.interface = myinterface;
        this.lightValues = {};
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);
    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.cameras = []; 
        for(var key in this.graph.perspectives)
        {
             if (this.graph.perspectives.hasOwnProperty(key)) {
                var camera = this.graph.perspectives[key];
                var camera1 = new CGFcamera(camera[0], camera[1], camera[2], 
                    vec3.fromValues(camera[3][0], camera[3][1], camera[3][2]),
                    vec3.fromValues(camera[4][0], camera[4][1], camera[4][2]));
                this.cameras[key] = camera1;
             }
        }
        for(var key in this.graph.ortho)
        {
             if (this.graph.ortho.hasOwnProperty(key)) {
                var camera = this.graph.ortho[key];
                var camera1 = new CGFcameraOrtho(camera[2], camera[3], camera[4], 
                    camera[5], camera[0], camera[1],
                    vec3.fromValues(camera[6][0], camera[6][1], camera[6][2]),
                    vec3.fromValues(camera[7][0], camera[7][1], camera[7][2]),
                    vec3.fromValues(0, 1, 0));
                this.cameras[key] = camera1;
             }
        }
    
        this.actualCamera = this.graph.default;
        this.Camera = this.graph.default;
        this.interface.addCamerasGroup();
        this.camera = this.cameras[this.Camera];
        this.interface.setActiveCamera(this.camera);
     }
    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
    	// Lights index.
        var i = 0;

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            // Only eight lights allowed by WebGL.
            if (i >= 8)
                break;              

            if (this.graph.lights.hasOwnProperty(key)) {
                var light = this.graph.lights[key];

                this.lights[i].setPosition(light[1][0], light[1][1], light[1][2], light[1][3]);
                this.lights[i].setAmbient(light[2][0], light[2][1], light[2][2], light[2][3]);
                this.lights[i].setDiffuse(light[3][0], light[3][1], light[3][2], light[3][3]);
                this.lights[i].setSpecular(light[4][0], light[4][1], light[4][2], light[4][3]);

                if(light.length > 5)
                {
                    this.lights[i].setSpotDirection(light[5][0], light[5][1], light[5][2]);
                    this.lights[i].setSpotCutOff(light[6]);
                    this.lights[i].setSpotExponent(light[7]);
                }

                this.lights[i].setVisible(true);
                
                if (light[0])
                    this.lights[i].enable();
                else
                    this.lights[i].disable();

                this.lights[i].update();

                i++;
            }
        }
    }


    /* Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        this.axis = new CGFaxis(this, this.graph.axis_length);

        this.gl.clearColor(this.graph.background_r, this.graph.background_g, this.graph.background_b, this.graph.background_a);
        this.setGlobalAmbientLight(this.graph.ambient_r, this.graph.ambient_g, this.graph.ambient_b, this.graph.ambient_a);

        this.initCameras();
        this.initLights();

        // Adds lights group.
        this.interface.addLightsGroup(this.graph.lights);

        this.sceneInited = true;
    }


    /**
     * Displays the scene.
     */
    display() {

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation)
        this.loadIdentity();

        this.pushMatrix();

        if (this.sceneInited) {
            if(this.actualCamera!=this.Camera)
            {
                this.actualCamera=this.Camera;
                this.camera = this.cameras[this.Camera];
                this.interface.setActiveCamera(this.camera);
            }
            this.updateProjectionMatrix();

            // Apply transformations corresponding to the camera position relative to the origin
            this.applyViewMatrix();
            
            // Draw axis
            this.axis.display();

            var i = 0;
            for (var key in this.lightValues) {

                if (this.lightValues.hasOwnProperty(key)) {
                    if (this.lightValues[key]) {
                        this.lights[i].setVisible(true);
                        this.lights[i].enable();
                    }
                    else {
                        this.lights[i].setVisible(false);
                        this.lights[i].disable();
                    }
                    this.lights[i].update();
                    i++;
                }
            }

            // Displays the scene (MySceneGraph function).
            this.checkKeys();
            this.graph.displayScene(this.graph.root, "none", "none", 1, 1);
        }
        else {
            // Draw axis
            this.axis.display();
        }

        this.popMatrix();
    };

	/**
	* Checks if the key M is pressed
	*/
    checkKeys(){
        if(this.gui.isKeyPressed("KeyM"))
         {
             for(var key in this.graph.components)
        	{
             if (this.graph.components.hasOwnProperty(key))
                this.graph.components[key].changeIndex();
             }
         }
    };

};
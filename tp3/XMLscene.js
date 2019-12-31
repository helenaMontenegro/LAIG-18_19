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
        this.lastT = null;
        this.deltaT=null;
        this.counter = 30;
        this.time_active = false;

        this.gameMode = "Player vs Player";
        this.Pc1Difficulty = "Easy";
        this.Pc2Difficulty="Easy";
        this.Scenario="Japanese room";       
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
        this.cameraAnimation = false;
        
        this.setUpdatePeriod(100);
        this.setPickEnabled(true);
        this.model=new CGFOBJModel(this,'models/3d-model.obj');
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
        this.interface.addGameOptions();
        this.interface.addBasicOptionsGroup();
        this.interface.addScenarios();
        this.camera = this.cameras[this.Camera];
        this.interface.setActiveCamera(this.camera);
     }

    setPlayerCamera() {
        this.camera = this.cameras["player_white"];
        this.camera.setPosition(vec3.fromValues(11, 12, 2));
        this.interface.setActiveCamera(this.camera);
    }

    setNormalCamera() {
        this.camera = this.cameras["far"];
        this.interface.setActiveCamera(this.camera);
    }

    changeCamera() {
        this.camera._up = vec3.fromValues(0,1,0);
        if(this.game.currPlayer == this.game.player.white_player) {
            this.camera.setPosition(vec3.fromValues(-11, 12, 2));
        } else {
            this.camera.setPosition(vec3.fromValues(11, 12, 2));
        }
        this.cameraAnimation = true;
        this.cameraAngle = 0;
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
        this.game = new Cam(this);
        this.materialDefault = this.graph.materials["green"];

    }

    update(currTime)
    {
        var t  = currTime/1000.0;
        if(this.lastT != null){
            this.deltaT = t - this.lastT;
        }
        this.lastT = t;
        if(this.time_active) {
            this.counter-=this.deltaT;
            this.update_clock(parseInt(this.counter));
        }
        if (this.sceneInited) {
            if(this.cameraAnimation){
                this.cameraAngle+=5;
                this.camera.orbit(vec3.fromValues(0, 1, 0), this.cameraAngle*degToRad);
                if(this.cameraAngle == 40) {
                    this.cameraAnimation = false;
                    this.reset_clock();
                    if(this.game.currPlayer == this.game.player.white_player) {
                        this.camera.setPosition(vec3.fromValues(11, 12, 2));
                    } else {
                        this.camera.setPosition(vec3.fromValues(-11, 12, 2));
                    }
                }
            }
            else if(this.game.selected_pawn != null && this.game.selected_pawn.animation != null){
                this.game.selected_pawn.animation.update(this.deltaT);
            }
        }
    }

    logPicking() {
        if (this.pickMode == false) {
            if (this.pickResults != null && this.pickResults.length > 0) {
                for (var i=0; i< this.pickResults.length; i++) {
                    var obj = this.pickResults[i][0];
                    if (obj)
                    {
                        var customId = this.pickResults[i][1];
                        this.game.get_picked_cell(customId);			
                    }
                }
                this.pickResults.splice(0,this.pickResults.length);
            }		
        }
    }

    startGame() {
        this.setPlayerCamera();
        this.game.start();
    };
    
    quitGame() {
        this.cameraAnimation = false;
        this.setNormalCamera();
        this.game.quit();
        this.update_points(this.game.points);
        this.reset_clock();
        this.set_active_clock(false);
    };
    
    undo() {
      this.game.undo();
    };
    
    movie() {
        this.game.movie();
    };

    update_points(points) {
        var pnts = document.querySelector("#marker div#points p");
        pnts.textContent = 'White ' + points[0] + '-' + points[1] + ' Black';
    }

    reset_clock() {
        var time = document.querySelector("#marker div#time p");
        time.textContent = '0:30';
        this.counter = 30;
    }

    set_active_clock(val) {
        this.time_active = val;
    }

    update_clock(seconds) {
        var time = document.querySelector("#marker div#time p");
        if(seconds <= 0) {
            this.update_message("Time out!");
            time.textContent = '0:00';
            this.time_active = false;
            this.game.clock_time_out();
        }
        else if(seconds < 10)
            time.textContent = '0:0' + seconds;
        else
            time.textContent = '0:' + seconds;
    }

    update_message(message) {
        var mess = document.querySelector("#marker div#message p");
        mess.textContent = message;
    }

    /**
     * Displays the scene.
     */
    display() {
        this.logPicking();
        this.clearPickRegistration();
        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation)
        this.loadIdentity();

        this.pushMatrix();

        if (this.sceneInited) {
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
            this.game.display();

            this.pushMatrix();
                this.translate(-8.5, 0.35, -6);
                this.scale(0.007,0.009,0.007);
                this.materialDefault.apply();
                this.model.display();
            this.popMatrix();
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
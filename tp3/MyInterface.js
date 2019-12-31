/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        // to init keys
        this.scene.gui=this;
        this.processKeyboard=function(){};
        this.activeKeys={};

        return true;
    }

    /**
     * Adds a folder containing the IDs of the lights passed as parameter.
     * @param {array} lights
     */
    addLightsGroup(lights) {

        var group = this.gui.addFolder("Lights");
        group.open();

        // add two check boxes to the group. The identifiers must be members variables of the scene initialized in scene.init as boolean
        // e.g. this.option1=true; this.option2=false;

        for (var key in lights) {
            if (lights.hasOwnProperty(key)) {
                this.scene.lightValues[key] = lights[key][0];
                group.add(this.scene.lightValues, key);
            }
        }
    };

    /** add game mode, rotatio camera and game levels */
    addGameOptions(){
        var group = this.gui.addFolder("Game Options");
        group.open();

        group.add(this.scene, "gameMode", [ "Player vs Player", "Player vs Pc", "Pc vs Pc" ] ).name("Game Mode");
        group.add(this.scene, "Pc1Difficulty", ["Easy", "Hard"]).name("Pc 1 difficulty");
        group.add(this.scene, "Pc2Difficulty", ["Easy", "Hard"]).name("Pc 2 difficulty");
     };

     /** add geral options*/
    addBasicOptionsGroup(){
        var group = this.gui.addFolder("Actions");
        group.open();
      
        group.add(this.scene, "startGame").name("Start Game");
        group.add(this.scene, "undo").name("Undo");
        group.add(this.scene, "quitGame").name("Quit Game");
        group.add(this.scene, "movie").name("Watch Movie");

    };
    /** add scenarios*/
    addScenarios(){

        var group = this.gui.addFolder("Scenario");
        group.open();

        group.add(this.scene, "Scenario",["Japanese room", "Europe room"]).name("Scenarios");

    };

    processKeyDown(event) {
		this.activeKeys[event.code]=true;
	};

	processKeyUp(event) {
		this.activeKeys[event.code]=false;
	};

    isKeyPressed(keyCode) {
	   return this.activeKeys[keyCode] || false;
	};
}
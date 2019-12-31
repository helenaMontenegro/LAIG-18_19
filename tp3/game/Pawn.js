class Pawn {
    
    constructor(scene, player, type, coordinates) {
        this.scene = scene;
        this.pawn = null;
        this.player = player;
        this.type = type;
        this.material = this.scene.graph.materials["black"];
        if(type == "knight" && player == "'.'"){
            this.material = this.scene.graph.materials["black"];
            this.pawn = new CGFOBJModel(this.scene,'models/knight.obj');
        }
        else if(type == "knight"){
            this.material = this.scene.graph.materials["default"];
            this.pawn = new CGFOBJModel(this.scene,'models/knight.obj');
        }
        else if(player == "'.'") {
            this.pawn = this.scene.graph.components["blackPawn"]; 
        }
        else {
            this.pawn = this.scene.graph.components["whitePawn"];
        }
        this.coordinates = coordinates;
        this.x = -3.0 + this.coordinates[0]/2.0;
        this.y = 3.6 - this.coordinates[1]/2.0;
        this.height = 1.51;
        this.animation = null;
        this.next_coords = null;
        this.picking=false;
    }

    setAnimation(coord) {
        var next_x = -3.0 + coord[0]/2.0;
        var next_y = 3.6 - coord[1]/2.0;
        var dX = (next_x - this.x)/10.0;
        var dY = (next_y - this.y)/10.0;
        var controlPoints = [
            [this.x,  this.height, this.y],
            [this.x+dX*0.5, this.height+0.1, this.y+dY*0.5],

            [this.x+dX, this.height+0.25, this.y+dY],
            [this.x+dX*2, this.height+0.4, this.y+dY*2],
            [this.x+dX*3, this.height+0.55, this.y+dY*3],
            [this.x+dX*4, this.height+0.7, this.y+dY*4],
            [this.x+dX*5, this.height+0.85, this.y+dY*5],
            [this.x+dX*6, this.height+0.7, this.y+dY*6],
            [this.x+dX*7, this.height+0.55, this.y+dY*7],
            [this.x+dX*8, this.height+0.4, this.y+dY*8],
            [this.x+dX*9, this.height+0.25, this.y+dY*9],

            [next_x-dX*0.5, this.height + 0.1, next_y-dY*0.5],
            [next_x, this.height, next_y]
        ];
        this.animation = new LinearAnimation(this.scene, controlPoints, 2);
        this.next_coords = coord;
    }

    updateCoordinates() {
        this.coordinates = this.next_coords;
        this.x = -3.0 + this.coordinates[0]/2.0;
        this.y = 3.6 - this.coordinates[1]/2.0;
    }

    display() {
        this.scene.pushMatrix();
            if(this.animation != null) {
                this.animation.apply();
                if(this.animation.end){
                    this.animation = null;
                    this.updateCoordinates();
                    this.scene.game.go_back_to_first_move();
                }
            }
            else
                this.scene.translate(this.x, this.height, this.y);
            this.material.apply();
            if(this.type == "knight"){
                this.scene.rotate(-90*degToRad, 1,0,0);
                if(this.player == "'*'" && this.animation == null) {
                    this.scene.rotate(-90*degToRad, 0,0,1);
                } else if(this.animation == null) {
                    this.scene.rotate(90*degToRad, 0,0,1);
                }
                this.scene.scale(0.11,0.11,0.11);
            }
            this.pawn.display();
        this.scene.popMatrix();
    }
}
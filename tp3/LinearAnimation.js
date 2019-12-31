class LinearAnimation extends Animation {
    constructor(scene, controlPoints, totalTime) //push e pop - add transformations to object's matrix
    {
        super(scene);
        this.controlPoints = controlPoints;
        this.totalTime = totalTime;
        this.activeSegment=0;
        this.dActiveSegment=0;
        this.distances = [];
        for(var i=0; i < this.controlPoints.length - 1; i++){
            var dist = Math.sqrt(Math.pow(this.controlPoints[i+1][0]-this.controlPoints[i][0],2) +
                            Math.pow(this.controlPoints[i+1][1]-this.controlPoints[i][1],2) +
                            Math.pow(this.controlPoints[i+1][2]-this.controlPoints[i][2],2));
            this.distances.push(dist);
        }
        this.angles = [];
        for(var i=0; i < this.controlPoints.length - 1; i++){
            var scalarproduct = this.controlPoints[i+1][2]-this.controlPoints[i][2];
            var sizeofVector = Math.sqrt(Math.pow(this.controlPoints[i+1][0]-this.controlPoints[i][0],2) + 
                Math.pow(this.controlPoints[i+1][2]-this.controlPoints[i][2],2));
            var angle = 0;
            if(sizeofVector!=0) 
                angle = Math.acos(scalarproduct/sizeofVector);
            if(this.controlPoints[i+1][0]<this.controlPoints[i][0])
                angle=angle*-1.0;
            this.angles.push(angle);
        }
        this.segmentTime = this.totalTime / this.distances.length;
        this.positionX = this.controlPoints[0][0]; 
        this.positionY = this.controlPoints[0][1];
        this.positionZ = this.controlPoints[0][2];
    };

    reset(){
        this.activeSegment=0;
        this.dActiveSegment=0;
        this.segmentTime = this.totalTime / this.distances.length;
        this.positionX = this.controlPoints[0][0]; 
        this.positionY = this.controlPoints[0][1];
        this.positionZ = this.controlPoints[0][2];
        this.end=false;
    }

    update(deltaT){
        if(this.activeSegment >= this.controlPoints.length-1){
            this.end=true;
            return;
        }
        var deltaDx = deltaT*(this.controlPoints[this.activeSegment+1][0] 
                                - this.controlPoints[this.activeSegment][0])/this.segmentTime;
        var deltaDy = deltaT*(this.controlPoints[this.activeSegment+1][1] 
                                - this.controlPoints[this.activeSegment][1])/this.segmentTime;
        var deltaDz = deltaT*(this.controlPoints[this.activeSegment+1][2] 
                                - this.controlPoints[this.activeSegment][2])/this.segmentTime;

        this.positionX+=deltaDx;
        this.positionY+=deltaDy;
        this.positionZ+=deltaDz;
       
        var deltaD = deltaT*this.distances[this.activeSegment]/this.segmentTime;
        this.dActiveSegment+=deltaD;
        if(this.dActiveSegment >= this.distances[this.activeSegment]){
            this.dActiveSegment -= this.distances[this.activeSegment];
            this.activeSegment++;
        }
    };

    apply(){
        this.scene.translate(this.positionX, this.positionY, this.positionZ);
        if(this.activeSegment >= this.controlPoints.length-1) 
            this.scene.rotate(this.angles[this.activeSegment-1], 0,1,0);
        else 
            this.scene.rotate(this.angles[this.activeSegment], 0,1,0);
    };
};
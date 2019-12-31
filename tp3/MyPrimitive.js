class MyPrimitive {
	/**
 	* MyPrimitive - builds the primitive according to its type.
 	* @constructor
 	* @param graph the graph where the components and primitives are
    * @param id identifier of primitives
    * @param list list of the primitives`s parameters 
 	*/
    constructor(graph, id, list)
    {
        this.graph = graph;
        this.id = id;
        this.list = list;
        this.type = list[0];

        if(this.type == "rectangle")
        {
            this.primitive = new MyRectangle(this.graph.scene, 
                list[1], list[2], list[3], list[4], 0, 1, 0, 1);
        }

        else if(this.type == "triangle")
        {
            this.primitive = new MyTriangle(this.graph.scene, 
            list[1], list[4], list[7], list[2], list[5], list[8], 
            list[3], list[6], list[9], 0, 1, 0, 1);
        }

        else if(this.type == "sphere")
        {
            this.primitive = new MySphere(this.graph.scene,
                list[1], list[2], list[3]);
        }

        else if(this.type == "cylinder")
        {
            this.primitive = new MyCylinder(this.graph.scene,
                list[1], list[2], list[3], list[4], list[5]);
        }

        else if(this.type == "torus")
        {
            this.primitive = new MyTorus(this.graph.scene,
                list[1], list[2], list[3], list[4]);
        }

        else if(this.type == "plane")
        {
            this.primitive = new MyPlane(this.graph.scene,
                list[1], list[2]);
        }
        
        else if(this.type == "patch")
        {
            this.primitive = new MyPatch(this.graph.scene, list[1], list[2], list[3], list[4], list[5]);
        }

        else if(this.type == "vehicle")
        {
            this.primitive = new MyVehicle(this.graph.scene);
        }

        else if(this.type == "cylinder2")
        {
            this.primitive = new MyCylinder2(this.graph.scene,
                list[1], list[2], list[3], list[4], list[5]);
        }

        else if(this.type == "terrain")
        {
            this.primitive = new MyTerrain(this.graph.scene,
                list[1], list[2], list[3], list[4]);
        }

        else if(this.type == "water")
        {
            this.primitive = new MyWater(this.graph.scene,
                list[1], list[2], list[3], list[4], list[5]);
        }

    };

    /**
    * Changes the length s and the lenth t 
    */
    alterLengthST(length_s,length_t)
    {
        if(this.type=="rectangle" || this.type=="triangle")
        {
            this.primitive.alterLengthST(length_s,length_t);
        }
    };

    /**
    * Draws the primitive
    */
    drawPrimitive()
    {
        this.primitive.display();
    };
};
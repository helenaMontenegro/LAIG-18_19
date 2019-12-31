// degrees to radians conversion
var degToRad = Math.PI / 180;

// Index order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2; 
var LIGHTS_INDEX = 3; 
var TEXTURES_INDEX = 4; 
var MATERIALS_INDEX = 5; 
var TRANSFORMATIONS_INDEX = 6; 
var ANIMATIONS_INDEX = 7;
var PRIMITIVES_INDEX = 8;
var COMPONENTS_INDEX = 9;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {

    /**
     * @constructor
     * @param filename filename is the nam eof the xml file
     */
    constructor(filename, scene) {
        this.loadedOk = null;

      
       // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];


        // The id of the root element.
        this.idRoot = null;    

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */

        this.reader.open('scenes/' + filename, this);
    }

    /**
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "yas")
            return "root tag <yas> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <scene>
        var index;
        if ((index = nodeNames.indexOf("scene")) == -1)
            return "tag <scene> missing";
        else {
            if (index != SCENE_INDEX)
                this.onXMLMinorError("tag <scene> out of order");

            //Parse initial block
            if ((error = this.parseScene(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <VIEWS_INDEX> out of order");

            //Parse Viws block
            if ((error = this.parseViews(nodes[index])) != null)
                return error;
        }

        // <ambient>
        if ((index = nodeNames.indexOf("ambient")) == -1)
            return "tag <ambient> missing";
        else {
            if (index != AMBIENT_INDEX)
                this.onXMLMinorError("tag <ambient> out of order");

            //Parse ambient block
            if ((error = this.parseAmbient(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }

        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }
        
        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <transformations>
        if ((index = nodeNames.indexOf("transformations")) == -1)
            return "tag <transformations> missing";
        else {
            if (index != TRANSFORMATIONS_INDEX)
                this.onXMLMinorError("tag <transformations> out of order");

            //Parse transformations block
            if ((error = this.parseTransformations(nodes[index])) != null)
                return error;
        }

        // <primitives>
        if ((index = nodeNames.indexOf("animations")) == -1)
            return "tag <animations> missing";
        else {
            if (index != ANIMATIONS_INDEX)
                this.onXMLMinorError("tag <animations> out of order");

            //Parse primitives block
            if ((error = this.parseAnimations(nodes[index])) != null)
                return error;
        }

       // <primitives>
        if ((index = nodeNames.indexOf("primitives")) == -1)
            return "tag <primitives> missing";
        else {
            if (index != PRIMITIVES_INDEX)
                this.onXMLMinorError("tag <primitives> out of order");

            //Parse primitives block
            if ((error = this.parsePrimitives(nodes[index])) != null)
                return error;
        }

        // <components>
        if ((index = nodeNames.indexOf("components")) == -1)
            return "tag <components> missing";
        else {
            if (index != COMPONENTS_INDEX)
                this.onXMLMinorError("tag <components> out of order");

            //Parse components block
            if ((error = this.parseComponents(nodes[index])) != null)
                return error;
        }
    }

    /**
     * Parses the initials block.
     * @param {inital block element} initialnNode
     */
    parseScene(initialsNode)
     {

        // default values
        this.root = "";
        this.axis_length = 1;
        
        // reads the values from xml file
        this.root = this.reader.getString(initialsNode, 'root');
        this.axis_length = this.reader.getFloat(initialsNode, 'axis_length');

        // error handling
         if (!(this.axis_length != null && !isNaN(this.axis_length))) {
             this.axis_length = 1;
             this.onXMLMinorError("unable to parse value for axis_length plane, assuming 'axis_length = 1'");
         }

        this.log("Parsed initials");
        return null;
    }

    /**
     * Parses the <views> block.
     * @param {illumination block element} illuminationNode
     */
    parseViews(viewsNode) 
    {
    	// views children (perspective and ortho)
        var children = viewsNode.children;
        this.perspectives = [];
        this.ortho = [];

        //default values
        this.default="";
        this.default=this.reader.getString(viewsNode,'default');
        
        //error handling 
        if (this.default==null)
         this.onXMLMinorError("unable to parse views");

        if(children.length == 0)
            this.onXMLError("missing default view"); 

        //checking each child of views and saving its information
        
        //to check if the default view exists
        var existsDefault = false, firstID;

        for (var i = 0; i < children.length; i++)
        {
            if(children[i].nodeName == "perspective")
            {
                var def = this.parsePerspective(children, i);

                if(existsDefault == false && def == this.default)
                    existsDefault = true;

                if(i==0) firstID = def; //if info is saved, no need for this.
            }
            else if(children[i].nodeName == "ortho")
            {
                var def = this.parseOrtho(children, i);

                if(existsDefault == false && def == this.default)
                    existsDefault = true;

                if(i==0) firstID = def; //if info is saved, no need for this.
            }
            else
            	//error handling - incorrect tag 
                this.onXMLMinorError("incorrect tag <" + children[i].nodeName + "> in views");
        }

        if(!existsDefault)
        {
            this.onXMLMinorError("no id matching default on views");
            this.default = firstID;
        }

        this.log("Parsed views");
        return null;
    }

     /**
     * Parses the ortho views.
     * @param children list with the ortho views
     * @param indexOrtho index of the ortho view
     */
    parseOrtho(children, indexOrtho)
    {
    	// reads the values from xml file
        var id=this.reader.getString(children[indexOrtho],'id');
        var near=this.reader.getFloat(children[indexOrtho],'near');
        var far=this.reader.getFloat(children[indexOrtho],'far');
        var left=this.reader.getFloat(children[indexOrtho],'left');
        var right=this.reader.getFloat(children[indexOrtho],'right');
        var top=this.reader.getFloat(children[indexOrtho],'top');
        var bottom=this.reader.getFloat(children[indexOrtho],'bottom');
        
        // error handling 
        if (!(near != null && !isNaN(near))) {
            near = 0.1;
            this.onXMLMinorError("unable to parse value for near plane, assuming 'near = 0.1'");
        }
        else if (!(far != null && !isNaN(far))) {
            far = 500;
            this.onXMLMinorError("unable to parse value for far plane, assuming 'far = 500'");
        }
        if (near >= far)
            return "'near' must be smaller than 'far'";

        // default values
        var from = [];
        var to = [];
        
        // access to 'from' and 'to'
        var persChildren = children[indexOrtho].children;
        var persNodeNames = [];

        for (var i = 0; i < persChildren.length; i++)
            persNodeNames.push(persChildren[i].nodeName);
    
        var fromIndex = persNodeNames.indexOf("from");
        var toIndex = persNodeNames.indexOf("to");

        // error handling
        if (fromIndex == -1)
            this.onXMLMinorError("from undefined");
        
        // reading values from the xml related to 'from'
        else {
            var fx = this.reader.getFloat(persChildren[fromIndex], 'x');
            var fy = this.reader.getFloat(persChildren[fromIndex], 'y');
            var fz = this.reader.getFloat(persChildren[fromIndex], 'z');
            from.push(fx); from.push(fy); from.push(fz);
        }
         // error handling
        if (toIndex == -1)
            this.onXMLMinorError("to undefined");

        // reading values from the xml related to 'to'
        else {
            var tx = this.reader.getFloat(persChildren[toIndex], 'x');
            var ty = this.reader.getFloat(persChildren[toIndex], 'y');
            var tz = this.reader.getFloat(persChildren[toIndex], 'z');
            to.push(tx); to.push(ty); to.push(tz);
        }

        // error handling - check if there aren´t repeated ids
        if (this.ortho.hasOwnProperty(id))
            this.onXMLMinorError("id of ortho duplicated, initial ortho overwritten");
       
        //save data
        this.ortho[id] = [near, far, left, right, bottom, top, from, to];
        
        return id;
    }

     /**
     * Parses the perspective views.
     * @param children list with the ortho views
     * @param indexOrtho index of the ortho view
     */

    parsePerspective(children, indexPerspective)
    {
    	// default values
        var id="";
        var near=0;
        var far=0;
        var angle=0;

        // reads the values from xml file
        id=this.reader.getString(children[indexPerspective],'id');
        near=this.reader.getFloat(children[indexPerspective],'near');
        far=this.reader.getFloat(children[indexPerspective],'far');
        angle=this.reader.getFloat(children[indexPerspective],'angle');
        
        // error handling    
        if (!(near != null && !isNaN(near))) {
            near = 0.1;
            this.onXMLMinorError("unable to parse value for near plane; assuming 'near = 0.1'");
        }
        else if (!(far != null && !isNaN(far))) {
            far = 500;
            this.onXMLMinorError("unable to parse value for far plane; assuming 'far = 500'");
        }
        else if (!(angle != null && !isNaN(far))) {
            angle = 30;
            this.onXMLMinorError("unable to parse value for angle plane; assuming 'far = 500'");
        }

        if (near >= far)
            return "'near' must be smaller than 'far'";

        // default values
        var from = [];
        var to = [];
        
        // access to 'from' and 'to'
        var persChildren = children[indexPerspective].children;
        var persNodeNames = [];

        for (var i = 0; i < persChildren.length; i++)
            persNodeNames.push(persChildren[i].nodeName);
    
        var fromIndex = persNodeNames.indexOf("from");
        var toIndex = persNodeNames.indexOf("to");

        // error handling
        if (fromIndex == -1)
            this.onXMLMinorError("from undefined");
        
        // reading values from the xml related to 'from'
        else {
            var fx = this.reader.getFloat(persChildren[fromIndex], 'x');
            var fy = this.reader.getFloat(persChildren[fromIndex], 'y');
            var fz = this.reader.getFloat(persChildren[fromIndex], 'z');
            from.push(fx); from.push(fy); from.push(fz);
        }
        // error handling
        if (toIndex == -1)
            this.onXMLMinorError("to undefined");
        
         // reading values from the xml related to 'to'
        else {
            var tx = this.reader.getFloat(persChildren[toIndex], 'x');
            var ty = this.reader.getFloat(persChildren[toIndex], 'y');
            var tz = this.reader.getFloat(persChildren[toIndex], 'z');
            to.push(tx); to.push(ty); to.push(tz);
        }

        // error handling - check if there aren´t repeated ids
        if (this.perspectives.hasOwnProperty(id))
            this.onXMLMinorError("id of perspective duplicated, initial perspective overwritten");
        
        //save data 
        this.perspectives[id] = [angle*degToRad, near, far, from, to];

        return id;
    }

	/**
	*Parses the Ambient node
	*@param {ambient block element} ambientNode
	*/
     parseAmbient(ambientNode) 
     {

     	// ambient children
        var children = ambientNode.children;
        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        //default values
        this.ambient_r=0;
        this.ambient_g=0;
        this.ambient_b=0;
        this.ambient_a=1;

        this.background_r=0;
        this.background_g=0;
        this.background_b=0;
        this.background_a=1;

        var indexAmbient = nodeNames.indexOf("ambient");
        var indexbackground = nodeNames.indexOf("background");
    
    	//error handling - misses ambient plane
        if (indexAmbient == -1) {
            this.onXMLMinorError("ambient planes missing");
        }

        //reading values from xml file
        else {

            this.ambient_r = this.reader.getFloat(children[indexAmbient], 'r');
            this.ambient_g = this.reader.getFloat(children[indexAmbient], 'g');
            this.ambient_b = this.reader.getFloat(children[indexAmbient], 'b');
            this.ambient_a = this.reader.getFloat(children[indexAmbient], 'a');
       
       		//error handling
            if (!(this.ambient_r != null && !isNaN(this.ambient_r))) {
                    this.ambient_r = 0;
                    this.onXMLMinorError("unable to parse value for ambient r plane, assuming 'ambient_r = 0'");
                }
                else if (!(this.ambient_g != null && !isNaN(this.ambient_g))) {
                    this.ambient_g = 0;
                    this.onXMLMinorError("unable to parse value for ambient g plane, assuming 'ambient_g = 0'");
                }
                  else if (!(this.ambient_b != null && !isNaN(this.ambient_b))) {
                    this.ambient_b = 0;
                    this.onXMLMinorError("unable to parse value for ambient b plane, assuming 'ambient_b = 0'");
                }
                  else if (!(this.ambient_a != null && !isNaN(this.ambient_a))) {
                    this.ambient_g = 1;
                    this.onXMLMinorError("unable to parse value for ambient a plane, assuming 'ambient_a = 1'");
                }
        }

        //error handling - misses background plane
        if (indexbackground == -1) {
            this.onXMLMinorError("background planes missing");
        }

		//reading values from xml file
        else {

            this.background_r = this.reader.getFloat(children[indexbackground], 'r');
            this.background_g = this.reader.getFloat(children[indexbackground], 'g');
            this.background_b = this.reader.getFloat(children[indexbackground], 'b');
            this.background_a = this.reader.getFloat(children[indexbackground], 'a');
       		
       		//error handling
            if (!(this.background_r != null && !isNaN(this.background_r))) {
                    this.background_r = 1;
                    this.onXMLMinorError("unable to parse value for background r plane, assuming 'background_r = 1'");
                }
                else if (!(this.background_g != null && !isNaN(this.background_g))) {
                    this.background_g = 1;
                    this.onXMLMinorError("unable to parse value for background g plane, assuming 'background_g = 1'");
                }
                  else if (!(this.background_b != null && !isNaN(this.background_b))) {
                    this.background_b = 1;
                    this.onXMLMinorError("unable to parse value for background b plane, assuming 'background_b = 1'");
                }
                  else if (!(this.background_a != null && !isNaN(this.background_a))) {
                    this.background_a = 1;
                    this.onXMLMinorError("unable to parse value for background a plane, assuming 'background_a = 1'");
                }
        }
        
        this.log("Parsed ambient");
        return null;
     }

    /**
     * Parses the <lights> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {

    	// lights children (omni or spot)
        var children = lightsNode.children;

        this.lights = [];
        var grandChildren = [];
        var nodeNames = [];

        // counts the number of lights
        var numLights = 0;

 
        for (var i = 0; i < children.length; i++) {

        	//error handling - unknown tag (difrent from omni or spot)
            if (children[i].nodeName != "spot" && children[i].nodeName != "omni") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            var light = [];

            // Get id of the current light from xml
            var lightId = this.reader.getString(children[i], 'id');
            
            // Get the value enable from xml
            var enableIndex = this.reader.getString(children[i], 'enabled');
           
            var angle = 0;

            // types of lights (omni or spot)
            var type = children[i].nodeName;
            var exponent = 0;

            if(children[i].nodeName == "spot")
            {
            	//read values from xml file
                angle = this.reader.getFloat(children[i], 'angle'); //angle saved in degrees
                exponent = this.reader.getFloat(children[i], 'exponent');
            }
            // error handling
            if (lightId == null)
                 this.onXMLMinorError("no ID defined for light");

            // error handling - Checks for repeated IDs.
            if (this.lights[lightId] != null)
                this.onXMLMinorError("ID must be unique for each light (conflict: ID = " + lightId + ")");

            // access to planes of lights (omni or spot)
            grandChildren = children[i].children;
           
            // Specifications for the current light.
            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            // Gets indices of each element.
            var locationIndex = nodeNames.indexOf("location");
            var ambientIndex = nodeNames.indexOf("ambient");
            var diffuseIndex = nodeNames.indexOf("diffuse");
            var specularIndex = nodeNames.indexOf("specular");
            var targetIndex = nodeNames.indexOf("target");

            // Light enable/disable
            var enableLight = true;

            //error handling
            if (enableIndex == -1) {
                return "enable value missing for ID = " + lightId + "; assuming 'value = 1'";
            }
            else {
                if (!(enableIndex != null && !isNaN(enableIndex) && 
                (enableIndex == 0 || enableIndex == 1)))
                    return "unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'";
                else
                    enableLight = enableIndex == 0 ? false : true;
            }

            light.push(enableLight);

            // Retrieves the light position.
            var positionLight = [];
            var positionTarget = [];

            if (locationIndex != -1) {
                // x value
                var x = this.reader.getFloat(grandChildren[locationIndex], 'x');
                
                // error handling - check x value
                if (!(x != null && !isNaN(x)))
                    return "unable to parse x-coordinate of the light position for ID = " + lightId;
                else
                    positionLight.push(x);

                // y value
                var y = this.reader.getFloat(grandChildren[locationIndex], 'y');
               
                // error handling - check y value
                if (!(y != null && !isNaN(y)))
                    return "unable to parse y-coordinate of the light position for ID = " + lightId;
                else
                    positionLight.push(y);

                // z value
                var z = this.reader.getFloat(grandChildren[locationIndex], 'z');
               
                // error handling - check z value
                if (!(z != null && !isNaN(z)))
                    return "unable to parse z-coordinate of the light position for ID = " + lightId;
                else
                    positionLight.push(z);

                // w value
                var w = this.reader.getFloat(grandChildren[locationIndex], 'w');
                
                // error handling - check w value
                if (!(w != null && !isNaN(w) && w >= 0 && w <= 1))
                    return "unable to parse x-coordinate of the light position for ID = " + lightId;
                else
                    positionLight.push(w);

                //save data
                light.push(positionLight);
            }
            else
                return "light position undefined for ID = " + lightId;

             //Retrieves information about target, if exists 
            if (targetIndex != -1) {
                // x value
                var x = this.reader.getFloat(grandChildren[targetIndex], 'x');
               
                //error handling
                if (!(x != null && !isNaN(x)))
                    return "unable to parse x-coordinate of the target position for ID = " + lightId;
                else
                    positionTarget.push(x);

                // y value
                var y = this.reader.getFloat(grandChildren[targetIndex], 'y');
                
                //error handling
                if (!(y != null && !isNaN(y)))
                    return "unable to parse y-coordinate of the target position for ID = " + lightId;
                else
                    positionTarget.push(y);

                // z value
                var z = this.reader.getFloat(grandChildren[targetIndex], 'z');
               
                //error handling
                if (!(z != null && !isNaN(z)))
                    return "unable to parse z-coordinate of the target position for ID = " + lightId;
                else
                    positionTarget.push(z);
            }

            // Retrieves the ambient component.
            var ambientIllumination = [];
            
            if (ambientIndex != -1) {
                // R value
                var r = this.reader.getFloat(grandChildren[ambientIndex], 'r');
                
                //error handling
                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                    return "unable to parse R component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(r);

                // G value
                var g = this.reader.getFloat(grandChildren[ambientIndex], 'g');
                
                //error handling
                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                    return "unable to parse G component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(g);

                // B value
                var b = this.reader.getFloat(grandChildren[ambientIndex], 'b');
                
                //error handling
                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                    return "unable to parse B component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(b);

  				//a value
                var a = this.reader.getFloat(grandChildren[ambientIndex], 'a');

                //error handling
                if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                    return "unable to parse A component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(a);
            }

            else
                return "ambient component undefined for ID = " + lightId;
            //save data
            light.push(ambientIllumination);


            //Retrieving the diffuse component
            var diffuseIllumination = [];
            if (diffuseIndex != -1) {
                // R value
                var r = this.reader.getFloat(grandChildren[diffuseIndex], 'r');

                //error handling
                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                    return "unable to parse R component of the diffuse illumination for ID = " + lightId;
                else
                    diffuseIllumination.push(r);

                // G value
                var g = this.reader.getFloat(grandChildren[diffuseIndex], 'g');

                //error handling
                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                    return "unable to parse G component of the diffuse illumination for ID = " + lightId;
                else
                    diffuseIllumination.push(g);

                // B value
                var b = this.reader.getFloat(grandChildren[diffuseIndex], 'b');

                //error handling
                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                    return "unable to parse B component of the diffuse illumination for ID = " + lightId;
                else
                    diffuseIllumination.push(b);

         		//a value
                var a = this.reader.getFloat(grandChildren[diffuseIndex], 'a');

                //error handling
                if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                    return "unable to parse A component of the diffuse illumination for ID = " + lightId;
                else
                    diffuseIllumination.push(a);
            }
            else
                return "diffuse component undefined for ID = " + lightId;
            
            //save data
            light.push(diffuseIllumination);

            //Specular component
            var specularIllumination = [];
            if (specularIndex != -1) {
                // R value
                var r = this.reader.getFloat(grandChildren[specularIndex], 'r');

                //error handling
                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                    return "unable to parse R component of the specular illumination for ID = " + lightId;
                else
                    specularIllumination.push(r);

                // G value
                var g = this.reader.getFloat(grandChildren[specularIndex], 'g');

                //error handling
                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                    return "unable to parse G component of the specular illumination for ID = " + lightId;
                else
                    specularIllumination.push(g);

                // B value
                var b = this.reader.getFloat(grandChildren[specularIndex], 'b');

                //error handling
                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                    return "unable to parse B component of the specular illumination for ID = " + lightId;
                else
                    specularIllumination.push(b);

         		//a value 
                var a = this.reader.getFloat(grandChildren[specularIndex], 'a');

                //error handling
                if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                    return "unable to parse A component of the specular illumination for ID = " + lightId;
                else
                    specularIllumination.push(a);
            }
            else
                return "specular component undefined for ID = " + lightId;            
           
            //save data
            light.push(specularIllumination);
           
            if(children[i].nodeName == "spot")
            {
                light.push(positionTarget);
                light.push(angle);
                light.push(exponent);
            }
            this.lights[lightId] = light;
            numLights++;
        }
        //error handling 
        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");
        
        this.log("Parsed lights");

        return null;
    }
    
    /**
    *Parses the <textures> block. 
    *@param {textures block element} texturesNode
    */
    parseTextures(texturesNode) {

        this.textures = [];

        //texture children 
        var children = texturesNode.children;
        
        //error handling
        if(children.length == 0)
            this.onXMLError("no texture defined");

        //reading data from xml file
        for(var i = 0; i < children.length; i++)
        {
        	//error handling
            if(children[i].nodeName != "texture")
                this.onXMLMinorError("unidentified tag on textures");

            var id = this.reader.getString(children[i],'id');
            var file = this.reader.getString(children[i],'file');
            var new_texture = new CGFtexture(this.scene, "./scenes/images/" + file);

            //error handling
            if (this.textures.hasOwnProperty(id)) {
                this.onXMLMinorError("id of texture duplicated, new texture ignored");
                continue;
            }
        	
        	//save data
            this.textures[id] = new_texture;
        }
        this.log("Parsed textures");

        return null;
    }

    /**
    *Parses the <materials> node.
    *@param {materials block element} materialsNode
    */
 	parseMaterials(materialsNode) {
	//shininess, [emission],[ambient], [diffuse], [specular]
	this.materials = [];

	// materials children
	var children = materialsNode.children;
	var nodeNames = [];

	//error handling
	if (children.length == 0)
		this.onXMLError("no material defined");


        for (var i = 0; i < children.length; i++)
	{
		var material = [];

		//error handling
		if (children[i].nodeName != "material")
			this.onXMLMinorError("unidentified tag on textures");

		//reading values 'id' and 'shininess' from xml file
        var id = this.reader.getString(children[i], 'id');

        //error handling
        if (this.materials.hasOwnProperty(id)){
            this.onXMLMinorError("id of materials duplicated, new material ignored");
            continue;
        }
		var shininess = this.reader.getFloat(children[i], 'shininess');
		
		material.push[shininess];

		var grandChildren = children[i].children;

		// accessing materials grandChildren planes
		for (var j = 0; j < grandChildren.length; j++) {
			nodeNames.push(grandChildren[j].nodeName);
		}

		//default values
		var emission_r = 0; var emission_g = 0; var emission_b = 0; var emission_a = 1;
		var ambient_r = 0; var ambient_g = 0; var ambient_b = 0; var ambient_a = 1;
		var diffuse_r = 0; var diffuse_g = 0; var diffuse_b = 0; var diffuse_a = 0;
		var specular_r = 0; var specular_g = 0; var specular_b = 0; var specular_a = 0;

		// indexes       
		var indexAmbient = nodeNames.indexOf("ambient");
		var indexEmission = nodeNames.indexOf("emission");
		var indexDiffuse = nodeNames.indexOf("diffuse");
		var indexSpecular = nodeNames.indexOf("specular");

		//error handling
		if (indexEmission == -1) {
			this.onXMLMinorError("emission planes missing");
		}
		else {

			//reading emission values from xml file
			emission_r = this.reader.getFloat(grandChildren[indexEmission], 'r');
			emission_g = this.reader.getFloat(grandChildren[indexEmission], 'g');
			emission_b = this.reader.getFloat(grandChildren[indexEmission], 'b');
			emission_a = this.reader.getFloat(grandChildren[indexEmission], 'a');

			//error handling
			if (!(emission_r != null && !isNaN(emission_r))) {
				emission_r = 0;
				this.onXMLMinorError("unable to parse value for specular r plane; assuming 'emission_r = 0'");
			}
			else if (!(emission_g != null && !isNaN(emission_g))) {
				emission_g = 0;
				this.onXMLMinorError("unable to parse value for emission g plane; assuming 'emission_g = 0'");
			}
			else if (!(emission_b != null && !isNaN(emission_b))) {
				emission_b = 0;
				this.onXMLMinorError("unable to parse value for emission b plane; assuming 'emission_b = 0'");
			}
			else if (!(emission_a != null && !isNaN(emission_a))) {
				emission_a = 1;
				this.onXMLMinorError("unable to parse value for emission a plane; assuming 'emission_a = 1'");
			}
			material.push([emission_r, emission_g, emission_b, emission_a]);
		}

		if (indexAmbient == -1) {
			this.onXMLMinorError("ambient planes missing");
		}
		else {

			//reading ambient values from xml file
			ambient_r = this.reader.getFloat(grandChildren[indexAmbient], 'r');
			ambient_g = this.reader.getFloat(grandChildren[indexAmbient], 'g');
			ambient_b = this.reader.getFloat(grandChildren[indexAmbient], 'b');
			ambient_a = this.reader.getFloat(grandChildren[indexAmbient], 'a');

			//error handling
			if (!(ambient_r != null && !isNaN(ambient_r))) {
				ambient_r = 0;
				this.onXMLMinorError("unable to parse value for ambient r plane; assuming 'ambient_r = 0'");
			}
			else if (!(ambient_g != null && !isNaN(ambient_g))) {
				ambient_g = 0;
				this.onXMLMinorError("unable to parse value for ambient g plane; assuming 'ambient_g = 0'");
			}
			else if (!(ambient_b != null && !isNaN(ambient_b))) {
				ambient_b = 0;
				this.onXMLMinorError("unable to parse value for ambient b plane; assuming 'ambient_b = 0'");
			}
			else if (!(ambient_a != null && !isNaN(ambient_a))) {
				ambient_g = 1;
				this.onXMLMinorError("unable to parse value for ambient a plane; assuming 'ambient_a = 1'");
			}
			material.push([ambient_r, ambient_g, ambient_b, ambient_a]);
		}

		if (indexDiffuse == -1) {
			this.onXMLMinorError("diffuse planes missing");
		}
		else {

			//reading diffuse values from xml file
			diffuse_r = this.reader.getFloat(grandChildren[indexDiffuse], 'r');
			diffuse_g = this.reader.getFloat(grandChildren[indexDiffuse], 'g');
			diffuse_b = this.reader.getFloat(grandChildren[indexDiffuse], 'b');
			diffuse_a = this.reader.getFloat(grandChildren[indexDiffuse], 'a');

			//error handling
			if (!(diffuse_r != null && !isNaN(diffuse_r))) {
				diffuse_r = 0;
				this.onXMLMinorError("unable to parse value for diffuse r plane; assuming 'diffuse_r = 0'");
			}
			else if (!(diffuse_g != null && !isNaN(diffuse_g))) {
				diffuse_g = 0;
				this.onXMLMinorError("unable to parse value for diffuse g plane; assuming 'diffuse_g = 0'");
			}
			else if (!(diffuse_b != null && !isNaN(diffuse_b))) {
				diffuse_b = 0;
				this.onXMLMinorError("unable to parse value for diffuse b plane; assuming 'diffuse_b = 0'");
			}
			else if (!(diffuse_a != null && !isNaN(diffuse_a))) {
				diffuse_a = 1;
				this.onXMLMinorError("unable to parse value for diffuse a plane; assuming 'diffuse_a = 1'");
			}
			material.push([diffuse_r, diffuse_g, diffuse_b, diffuse_a]);
		}

		if (indexSpecular == -1) {
			this.onXMLMinorError("specular planes missing");
		}

		else {
			//reading specular values from xml file
			specular_r = this.reader.getFloat(grandChildren[indexSpecular], 'r');
			specular_g = this.reader.getFloat(grandChildren[indexSpecular], 'g');
			specular_b = this.reader.getFloat(grandChildren[indexSpecular], 'b');
			specular_a = this.reader.getFloat(grandChildren[indexSpecular], 'a');

	        //error handling
			if (!(specular_r != null && !isNaN(specular_r))) {
				specular_r = 0;
				this.onXMLMinorError("unable to parse value for specular r plane; assuming 'specular_r = 0'");
			}
			else if (!(specular_g != null && !isNaN(specular_g))) {
				specular_g = 0;
				this.onXMLMinorError("unable to parse value for specular g plane; assuming 'specular_g = 0'");
			}
			else if (!(specular_b != null && !isNaN(specular_b))) {
				specular_b = 0;
				this.onXMLMinorError("unable to parse value for specular b plane; assuming 'specular_b = 0'");
			}
			else if (!(specular_a != null && !isNaN(specular_a))) {
				specular_a = 1;
				this.onXMLMinorError("unable to parse value for specular a plane; assuming 'specular_a = 1'");
			}
			material.push([specular_r, specular_g, specular_b, specular_a]);
		}

		var new_material = new CGFappearance(this.scene);

		new_material.setAmbient(ambient_r, ambient_g, ambient_b, ambient_a);
		new_material.setDiffuse(diffuse_r, diffuse_g, diffuse_b, diffuse_a);
		new_material.setSpecular(specular_r, specular_g, specular_b, specular_a);
        new_material.setShininess(shininess);
        
		//save data
		this.materials[id] = new_material;}
		
	this.log("Parsed materials");
	return null;
}

    /**
     * Parses the <transformations> node.
     * @param {transformation block element} tranformationNode
     */
    parseTransformations(transformationsNode) {
        var children = transformationsNode.children;
        this.transformations = [];
        if(children.length == 0)
            return "no transformations defined";
             
        for(var i = 0; i < children.length; i++)
        {
            if(children[i].nodeName != "transformation")
                this.onXMLMinorError("unidentified tag on transformation");

            var id = this.reader.getString(children[i],'id');
            if (this.transformations.hasOwnProperty(id)){ //checking if id already exists
                this.onXMLMinorError("id of transformation duplicated, new transformation ignored");
                continue;
            }
            //creating matrix with identity
            var matrix = mat4.create();  
            mat4.identity(matrix);

            var grandChildren = children[i].children;

            for (var j = 0; j < grandChildren.length; j++) {
                if(grandChildren[j].nodeName == 'translate'){
                    var translate_x = this.reader.getFloat(grandChildren[j], 'x');
                    var translate_y = this.reader.getFloat(grandChildren[j], 'y');
                    var translate_z = this.reader.getFloat(grandChildren[j], 'z');
        
                    if (!(translate_x != null && !isNaN(translate_x))) {
                        translate_x = 0;
                        this.onXMLMinorError("unable to parse value for translate x plane; assuming 'translate_x = 0'");
                    }
                    else if (!(translate_y != null && !isNaN(translate_y))) {
                        translate_y = 0;
                        this.onXMLMinorError("unable to parse value for translate y plane; assuming 'translate_y = 0'");
                    }
                    else if (!(translate_z != null && !isNaN(translate_z))) {
                        translate_z = 0;
                        this.onXMLMinorError("unable to parse value for translate z plane; assuming 'translate_z = 0'");
                    }
                    mat4.translate(matrix, matrix, [translate_x, translate_y, translate_z]);
                } else if(grandChildren[j].nodeName == "rotate") {
                    var rotate_axis="x";
                    var rotate_angle=0;
                    rotate_axis = this.reader.getString(grandChildren[j], 'axis');
                    rotate_angle = this.reader.getFloat(grandChildren[j], 'angle');
          
                    if (rotate_axis == null || !(rotate_axis=="x" || rotate_axis=="y" || rotate_axis=="z")) {
                        rotate_axis = "x";
                        this.onXMLMinorError("unable to parse value for rotate axis plane");
                    }
                    else if (!(rotate_angle != null && !isNaN(rotate_angle))) {
                        rotate_angle = 0;
                        this.onXMLMinorError("unable to parse value for rotate angle plane; assuming 'rotate_angle = 0'");
                    }
                    //translating the axis string into a vector
                    var r_x = 0; var r_y = 0; var r_z = 0;
                    if(rotate_axis == "x")
                        r_x = 1;
                    else if(rotate_axis == "y")
                        r_y = 1;
                    else if(rotate_axis == "z")
                        r_z = 1;
                    mat4.rotate(matrix, matrix, rotate_angle*degToRad, [r_x, r_y, r_z]);                
                } else if(grandChildren[j].nodeName == "scale"){
                    var scale_x = this.reader.getFloat(grandChildren[j], 'x');
                    var scale_y = this.reader.getFloat(grandChildren[j], 'y');
                    var scale_z = this.reader.getFloat(grandChildren[j], 'z');
                
                    if (!(scale_x != null && !isNaN(scale_x))) {
                        scale_x = 0;
                        this.onXMLMinorError("unable to parse value for scale x plane; assuming 'scale_x = 0'");
                    }
                    else if (!(scale_y != null && !isNaN(scale_y))) {
                        scale_y = 0;
                        this.onXMLMinorError("unable to parse value for scale y plane; assuming 'scale_y = 0'");
                    }
                    else if (!(scale_z != null && !isNaN(scale_z))) {
                        scale_z = 0;
                        this.onXMLMinorError("unable to parse value for scale z plane; assuming 'scale_z = 0'");
                    }
                    mat4.scale(matrix, matrix, [scale_x, scale_y, scale_z]);
                }
            }
            //saving matrix in transformations.
            this.transformations[id] = matrix;
        }
        this.log("Parsed transformations");
        return null;
    }

    /**
     * Parses the <animations> block
     */
    /**
      * Parses the <primitives> block
      * @param {primitives block element} primitivesNode
      */
     parseAnimations(animationsNode) {
        var children = animationsNode.children;
        var animation;
        this.animations = [];

        for(var i = 0; i < children.length; i++)
        {
            if(children[i].nodeName == "linear")
            {
                var id = this.reader.getString(children[i],'id');
                var span = this.reader.getFloat(children[i],'span');
                var controlpoints = [];
                var grandchildren = children[i].children;
                if(grandchildren.length < 2)
                {
                    this.onXMLMinorError("not enough control points on animation with id=" + id);
                    continue;
                }
                for(var j = 0; j < grandchildren.length; j++)
                {
                    var xx = this.reader.getFloat(grandchildren[j],'xx');
                    var yy = this.reader.getFloat(grandchildren[j],'yy');
                    var zz = this.reader.getFloat(grandchildren[j],'zz');
                    var cp=[xx, yy, zz];
                    controlpoints.push(cp);
                }
                animation = new LinearAnimation(this.scene, controlpoints, span);
                this.animations[id] = animation;
            }
            else if(children[i].nodeName == "circular"){
                var id = this.reader.getString(children[i],'id');
                var span = this.reader.getFloat(children[i],'span');
                var center = this.reader.getString(children[i],'center');
                var radius = this.reader.getFloat(children[i],'radius');
                var startang = this.reader.getFloat(children[i],'startang');
                var rotang = this.reader.getFloat(children[i],'rotang');
                var c = center.split(' ').map(Number);
                animation = new CircularAnimation(this.scene, c, radius, startang*degToRad, rotang*degToRad, span);
                this.animations[id] = animation;
            }
        }
        this.log("Parsed animations");
        return null;
    }

     /**
      * Parses the <primitives> block
      * @param {primitives block element} primitivesNode
      */
    parsePrimitives(primitivesNode) {
        var children = primitivesNode.children;
        var primitive;
        this.primitives = [];
        var controlpoints = [];
       
        if(children.length == 0)
        
            return "no primitive defined";
        
       for(var i = 0; i < children.length; i++)
        {
        	
   
         if(children[i].nodeName != "primitive")
                this.onXMLMinorError("unidentified tag on primitives");

            var id = this.reader.getString(children[i],'id');

            if (this.primitives.hasOwnProperty(id)){ //checking if primitive already exists
                this.onXMLMinorError("id of primitive duplicated, new primitive ignored");
                continue;
            }

            var grandChildren = children[i].children;
            if(grandChildren.length != 1)
            {
                this.onXMLError("primitive with incorrect number of children");
                return null;
            }

            if(grandChildren[0].nodeName == "plane")
            {
                var npartsU = this.reader.getFloat(grandChildren[0], 'npartsU');
                var npartsV = this.reader.getFloat(grandChildren[0], 'npartsV');
                
                primitive = new MyPrimitive(this, id, ["plane", npartsU, npartsV]);
            }

            else if(grandChildren[0].nodeName == "vehicle")
            {
                primitive = new MyPrimitive(this, id, ["vehicle"]);
            }

            else if(grandChildren[0].nodeName == "cylinder2")
            {
                var base  = this.reader.getFloat(grandChildren[0], 'base');
                var top = this.reader.getFloat(grandChildren[0], 'top');
                var height = this.reader.getFloat(grandChildren[0], 'height');
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
                primitive = new MyPrimitive(this, id, ["cylinder2", base, top, height, slices, stacks]);
            }

            else if(grandChildren[0].nodeName == "terrain")
            {
                var idtexture  = this.reader.getString(grandChildren[0], 'idtexture');
                var idheightmap = this.reader.getString(grandChildren[0], 'idheightmap');
                var parts = this.reader.getFloat(grandChildren[0], 'parts');
                var heightscale = this.reader.getFloat(grandChildren[0], 'heightscale');
                primitive = new MyPrimitive(this, id, ["terrain",idtexture, idheightmap, parts, heightscale]);
            }

            else if(grandChildren[0].nodeName == "water")
            {
                var idtexture  = this.reader.getString(grandChildren[0], 'idtexture');
                var idwavemap = this.reader.getString(grandChildren[0], 'idwavemap');
                var parts = this.reader.getFloat(grandChildren[0], 'parts');
                var heightscale = this.reader.getFloat(grandChildren[0], 'heightscale');
                var texscale = this.reader.getFloat(grandChildren[0], 'texscale');
                primitive = new MyPrimitive(this, id, ["water",idtexture, idwavemap, parts, heightscale, texscale]);
            }
            
            else if(grandChildren[0].nodeName == "patch")
            {
                var npointsU = this.reader.getFloat(grandChildren[0], 'npointsU');
                var npointsV = this.reader.getFloat(grandChildren[0], 'npointsV');
                var npartsU = this.reader.getFloat(grandChildren[0], 'npartsU');
                var npartsV = this.reader.getFloat(grandChildren[0], 'npartsV');
                var cp = [];
                for(var t=0; t<npointsU*npointsV; t++)
                {
                    var xx = this.reader.getFloat(grandChildren[0].children[t], 'xx');
                    var yy = this.reader.getFloat(grandChildren[0].children[t], 'yy');
                    var zz = this.reader.getFloat(grandChildren[0].children[t], 'zz');
                   
                    cp.push([xx, yy, zz, 1.0]);
                    if((t+1)%npointsV == 0)
                    {
                        controlpoints.push(cp);
                        cp=[];
                    }
                }
                    
                primitive = new MyPrimitive(this, id, ["patch",npointsU, npointsV, npartsU, npartsV, controlpoints]);
            }
            else if(grandChildren[0].nodeName == "rectangle")
            {
                var x1 = this.reader.getFloat(grandChildren[0], 'x1');
                var x2 = this.reader.getFloat(grandChildren[0], 'x2');
                var y1 = this.reader.getFloat(grandChildren[0], 'y1');
                var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                primitive = new MyPrimitive(this, id, ["rectangle", x1, x2, y1, y2]);
            }
            else if(grandChildren[0].nodeName == "triangle")
            {
                var x1 = this.reader.getFloat(grandChildren[0], 'x1');
                var x2 = this.reader.getFloat(grandChildren[0], 'x2');
                var x3 = this.reader.getFloat(grandChildren[0], 'x3');
                var y1 = this.reader.getFloat(grandChildren[0], 'y1');
                var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                var y3 = this.reader.getFloat(grandChildren[0], 'y3');
                var z1 = this.reader.getFloat(grandChildren[0], 'z1');
                var z2 = this.reader.getFloat(grandChildren[0], 'z2');
                var z3 = this.reader.getFloat(grandChildren[0], 'z3');
                primitive = new MyPrimitive(this, id,["triangle", x1, x2, x3, y1, y2, y3, z1, z2, z3]);
            }
            else if(grandChildren[0].nodeName == "cylinder")
            {
                var base  = this.reader.getFloat(grandChildren[0], 'base');
                var top = this.reader.getFloat(grandChildren[0], 'top');
                var height = this.reader.getFloat(grandChildren[0], 'height');
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
                primitive = new MyPrimitive(this, id, ["cylinder", base, top, height, slices, stacks]);
            }
            else if(grandChildren[0].nodeName == "sphere")
            {
                var radius  = this.reader.getFloat(grandChildren[0], 'radius');
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
                primitive = new MyPrimitive(this, id, ["sphere", radius, slices, stacks]);
            }
            else if(grandChildren[0].nodeName == "torus")
            {
                var inner = this.reader.getFloat(grandChildren[0], 'inner');
                var outer = this.reader.getFloat(grandChildren[0], 'outer');
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                var loops = this.reader.getFloat(grandChildren[0], 'loops');
                primitive = new MyPrimitive(this, id, ["torus", inner, outer, slices, loops]);
            }        
            this.primitives[id] = primitive;
        }
        this.log("Parsed primitives");
        return null;
    }

    /**
     * Parses the <components> block
     * @param {components block element} componentsNode
     */
    parseComponents(componentsNode) {
        this.components=[];
        for(var j = 0; j < componentsNode.children.length; j++){
            if(componentsNode.children[j].nodeName != "component")
                this.onXMLMinorError("wrong tag on components");
        
        var children = componentsNode.children[j].children;
        var nodeNames = [];
        var index = -1;

        //getting id and creating component with it
        var idComponent = this.reader.getString(componentsNode.children[j], 'id');
        if (this.components.hasOwnProperty(idComponent)){ //if component already exists, the new one is ignored
            this.onXMLMinorError("id of component duplicated, component ignored");
            continue;
        }


        var comp = new MyComponent(this.scene, idComponent);

        for (var i = 0; i < children.length; i++) {
            nodeNames.push(children[i].nodeName);
        }

        //calculating transformation matrix
        if ((index = nodeNames.indexOf("transformation")) == -1)
            return "tag <transformation> missing inside primitives";
        else {
            var grandchildren = children[index].children;
            var appearedTransf=false;
            var matrix = mat4.create();  
            mat4.identity(matrix);  
            if(grandchildren.length == 0)
                comp.transformation = matrix;

            for(var i = 0; i < grandchildren.length; i++)
            {
                //if transformationref appears after other transformation it's ignored
                if(grandchildren[i].nodeName == "transformationref" && !appearedTransf)
                {
                    var id2 = this.reader.getString(grandchildren[i], 'id');
                    if (this.transformations.hasOwnProperty(id2)){
                        comp.transformation = this.transformations[id2];
                        break;
                    }else
                        this.onXMLMinorError("transformation doesn't exist");
                    
                }
                else if(grandchildren[i].nodeName == "translate")
                {
                    appearedTransf = true;
                    var x = this.reader.getFloat(grandchildren[i], 'x');
                    var y = this.reader.getFloat(grandchildren[i], 'y');
                    var z = this.reader.getFloat(grandchildren[i], 'z');
                    mat4.translate(matrix, matrix, [x,y,z]);
                }
                else if(grandchildren[i].nodeName == "rotate")
                {
                    appearedTransf = true;
                    var axis = this.reader.getString(grandchildren[i], 'axis');
                    var angle = this.reader.getFloat(grandchildren[i], 'angle');
                    var x=0; var y=0; var z = 0;
                    if(axis=="x") x=1;
                    else if(axis=="y") y=1;
                    else if (axis=="z") z=1;
                    mat4.rotate(matrix, matrix, angle*degToRad, [x,y,z]);
                }
                else if(grandchildren[i].nodeName == "scale")
                {
                    appearedTransf = true;
                    var x = this.reader.getFloat(grandchildren[i], 'x');
                    var y = this.reader.getFloat(grandchildren[i], 'y');
                    var z = this.reader.getFloat(grandchildren[i], 'z');
                    mat4.scale(matrix, matrix, [x, y, z]);
                }
                else
                    onXMLMinorError("unidentified transformation on components");
            }
            if(appearedTransf)
                comp.transformation = matrix;
        }
        //saving animations
        if ((index = nodeNames.indexOf("animations")) != -1) {
            var grandchildren = children[index].children;
            var aux = []
            for(var ind=0; ind < grandchildren.length; ind++){
                var id2 = this.reader.getString(grandchildren[ind], 'id');
                if (this.animations.hasOwnProperty(id2)){
                    aux.push(this.animations[id2]);
                }
                else
                    this.onXMLMinorError("animation id=" + id2 + " doesn't exist");
            }
            comp.animations = aux;
        }
        //saving materials in component
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing inside primitives";
        else {
            var grandchildren = children[index].children;
            if(grandchildren.length == 0)
                return "missing a material on component";
            for(var i = 0; i < grandchildren.length; i++)
            {
                if(grandchildren[i].nodeName == "material")
                {
                    var id2 = this.reader.getString(grandchildren[i], 'id');
                    if (this.materials.hasOwnProperty(id2) || id2=="inherit") //checking if material exists
                        comp.material.push(id2);
                    else
                        this.onXMLMinorError("material doesn't exist");
                }
                else
                    onXMLMinorError("unidentified material on components");
            }
        }
        //Saving texture on component
        var length_s = null, length_t=null;

        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing inside primitives";
        else {
            var grandchildren = children[index].children;
            if(grandchildren.length == 0)
                return "missing a texture on component";
                for(var i = 0; i < grandchildren.length; i++)
            {
                if(grandchildren[i].nodeName == "texture")
                {
                    var id2 = this.reader.getString(grandchildren[i], 'id');

                    if (this.textures.hasOwnProperty(id2) || id2=="none" || id2=="inherit"){

                        if(id2!="none"){//if id is "none" there's no need to check length_s and length_t
                        
                        if(this.reader.hasAttribute(grandchildren[i], 'length_s')) //checking if length_s exists
                                length_s = this.reader.getFloat(grandchildren[i], 'length_s');
                        
                                else if(id2 != "inherit") {
                                onXMLMinorError("length_s missing, default value = 1");
                                length_s=1;
                            }
                        
                            if(this.reader.hasAttribute(grandchildren[i], 'length_t')) //checking if length_t exists
                                length_t = this.reader.getFloat(grandchildren[i], 'length_t');
                        
                                else if(id2 != "inherit") {
                                onXMLMinorError("length_t missing, default value = 1");
                                length_t=1;
                            }
                        }
                        var texture1 = [id2, length_s, length_t];

                        comp.texture.push(texture1);
                         }
                else
                    this.onXMLMinorError("material doesn't exist");
                        }
            else
                this.onXMLMinorError("texture doesn't exist");
        }
    }
        //Saving children
        if ((index = nodeNames.indexOf("children")) == -1)
            return "tag <children> missing inside primitives";
        else {
            var grandchildren = children[index].children;
            if(grandchildren.length == 0)
                return "missing a material on component";
            for(var i = 0; i < grandchildren.length; i++)
            {
                if(grandchildren[i].nodeName == "componentref") //saving components as children
                {
                    var id2 = this.reader.getString(grandchildren[i], 'id');
                    comp.children.push(id2);
                }
                else if(grandchildren[i].nodeName == "primitiveref") //saving primitives as primitives
                {
                    var id2 = this.reader.getString(grandchildren[i], 'id');
                    if (this.primitives.hasOwnProperty(id2)) //checking if primitive exists
                        comp.primitives.push(id2);
                    else
                        this.onXMLMinorError("primitive doesn't exist");
                }
                else
                    onXMLMinorError("unidentified material on components");
            }
        }
            //saving new component
            this.components[idComponent] = comp;
        }
        if (!this.components.hasOwnProperty(this.root)){ //checking if root exists
            return "root doesn't exist";
        }
        this.log("Parsed components");
        return null;
    }
    

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }


    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene( idNode, idScene, idMaterialFather, idTextureFather, lengthSFather, lengthTFather) {
           
        var comp = this.components[idNode];

        this.scene.multMatrix(comp.transformation);
        
        //Applying the materials to the objects.
        var materialSon = idMaterialFather;
        if(comp.material == "inherit"){
            this.materials[idMaterialFather].apply();}
        else {
            this.materials[comp.material[comp.materialIndex]].apply();
            materialSon = comp.material[comp.materialIndex];
        }
        
        //Applying the textures to the objects.
        var textureSon = idTextureFather;
        var lengthSSon = lengthSFather;
        var lengthTSon = lengthTFather;
       
        if(comp.texture.length==1 || this.scene.Scenario=="Japanese room")
            var x=0;
        else  x=1;

        if(comp.texture[x][0] != "none" && comp.texture[x][0] != "inherit") //binding texture
        {   
    
            lengthSSon = comp.texture[x][1];
            lengthTSon = comp.texture[x][2];
            for(var c = 0; c < comp.primitives.length; c++)
            {
                this.primitives[comp.primitives[c]].alterLengthST(comp.texture[x][1],comp.texture[x][2]);
            }
            this.textures[comp.texture[x][0]].bind(1);
            this.textures[comp.texture[x][0]].bind();
            textureSon = comp.texture[x][0];
    
        } else if(comp.texture[x][0] == "none" && idTextureFather != "none") //taking out the texture
            this.textures[idTextureFather].unbind();

        else if(comp.texture[x][0] == "inherit") //altering length_s and length_t accordingly
        {   
            if(!comp.texture[x][1])
                comp.texture[x][1]=lengthSSon;
            else
                lengthSSon = comp.texture[x][1];
            if(!comp.texture[x][2])
                comp.texture[x][2]=lengthTSon;
            else
                lengthTSon = comp.texture[x][2];
            for(var c = 0; c < comp.primitives.length; c++)
            {
                this.primitives[comp.primitives[c]].alterLengthST(comp.texture[x][1],comp.texture[x][2]);
            }
            
            this.textures[textureSon].bind(1);
            this.textures[textureSon].bind();
        }

        //applying animations
        if(comp.animations != null){
            this.scene.pushMatrix();
            comp.animations[comp.animationIndex].apply();
            if(comp.animations[comp.animationIndex].end)
                comp.changeAnimation();
        }
        //drawing primitives
        for(var i = 0; i < comp.primitives.length; i++){
            this.primitives[comp.primitives[i]].drawPrimitive();
        }
        
        //displaying other components recursively
        for(var i = 0; i < comp.children.length;i++)
        {
            if (this.components.hasOwnProperty(comp.children[i])){
                this.scene.pushMatrix();
                this.displayScene(comp.children[i], materialSon, textureSon, lengthSSon, lengthTSon);
                this.scene.popMatrix();
            }else
                 this.onXMLMinorError("component doesn't exist");
        }

        if(comp.animations != null){
            this.scene.popMatrix();
        }
    }
}
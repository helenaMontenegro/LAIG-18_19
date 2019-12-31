/**
 * MyComponent class responsible for holding information
 * about each component.
 */
class MyComponent {
    /**
     * Constructor of this class. It receives the id of the component.
     * The other arguments will be set in MySceneGraph.
     * There's a materialIndex which represents which material is
     * currently being used in the component.
     * It's children are divided in two groups: primitives
     * and other components (this.children).
     */
    constructor(scene, id, idScene)
    {
        this.scene = scene;
        this.id = id;
        this.transformation = [];
        this.material = [];
        this.materialIndex=0;
        this.texture=[];
        this.animations = null; //in here there are the ids of the animations
        this.animationIndex = 0;
        this.children = [];
        this.primitives = [];


    };

    /**
     * Function to change this.materialIndex, called when the user
     * clicks on the M key.
     */
    changeIndex()
    {
        this.materialIndex++;
        if(this.materialIndex >= this.material.length)
        {
            this.materialIndex=0;
        }
    }

    changeAnimation()
    {
        this.animationIndex++;
        if(this.animationIndex < this.animations.length)
        {
            this.animations[this.animationIndex].reset();
        }
        else
            this.animationIndex--;
    }

    display() {
        this.display(null, null, 1, 1);
    }

    display(idMaterialFather, idTextureFather, lengthSFather, lengthTFather) {
           
        var comp = this;
        this.scene.multMatrix(comp.transformation);
        
        //Applying the materials to the objects.
        var materialSon = idMaterialFather;
        if(comp.material == "inherit"){
            this.scene.graph.materials[idMaterialFather].apply();}
        else {
            this.scene.graph.materials[comp.material[comp.materialIndex]].apply();
            materialSon = comp.material[comp.materialIndex];
        }
        
        //Applying the textures to the objects.
        var textureSon = idTextureFather;
        var lengthSSon = lengthSFather;
        var lengthTSon = lengthTFather;
       
        if(comp.texture.length==1 || this.scene.Scenario=="Japanese Room")
            var x=0;
        else  x=1;

        if(comp.texture[x][0] != "none" && comp.texture[x][0] != "inherit") //binding texture
        {   
    
            lengthSSon = comp.texture[x][1];
            lengthTSon = comp.texture[x][2];
            for(var c = 0; c < comp.primitives.length; c++)
            {
               this.scene.graph.primitives[comp.primitives[c]].alterLengthST(comp.texture[x][1],comp.texture[x][2]);
            }
            this.scene.graph.textures[comp.texture[x][0]].bind(1);
            this.scene.graph.textures[comp.texture[x][0]].bind();
            textureSon = comp.texture[x][0];
    
        } else if(comp.texture[x][0] == "none" && idTextureFather != "none") //taking out the texture
            this.scene.graph.textures[idTextureFather].unbind();

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
                this.scene.graph.primitives[comp.primitives[c]].alterLengthST(comp.texture[x][1],comp.texture[x][2]);
            }
            
            this.scene.graph.textures[textureSon].bind(1);
            this.scene.graph.textures[textureSon].bind();
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
            this.scene.graph.primitives[comp.primitives[i]].drawPrimitive();
        }
        
        //displaying other components recursively
        for(var i = 0; i < comp.children.length;i++)
        {
            if (this.scene.graph.components.hasOwnProperty(comp.children[i])){
                this.scene.pushMatrix();
                this.scene.graph.components[this.children[i]].display(materialSon, textureSon, lengthSSon, lengthTSon);
                this.scene.popMatrix();
            }
        }

        if(comp.animations != null){
            this.scene.popMatrix();
        }
    }

};
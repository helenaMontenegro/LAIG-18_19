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
    constructor(id)
    {
        this.id = id;
        this.transformation = [];
        this.material = [];
        this.materialIndex=0;
        this.texture;
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

};
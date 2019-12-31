class Cell {
    
    constructor(scene, letter, number, texture) {
        this.scene = scene;
        this.letter = letter;
        this.number = number;
        this.texture = texture;
        this.texture_blue = this.scene.graph.textures["blue"];
        this.picking=false;
        this.cell = new MyRectangle(this.scene, 0, 1, 0, 1, 0, 1, 0, 1);
    }

    display() {
        if(this.picking)
            this.texture_blue.bind();
        else
            this.texture.bind();
        this.cell.display();
    }
}
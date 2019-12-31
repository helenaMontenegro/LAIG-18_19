class Board {
    
    constructor(scene) {
        this.scene = scene;
        this.gameBoard = [
            [3,3,3,0,3,3,3],
            [3,3,1,2,1,3,3],
            [3,1,2,1,2,1,3],
            [1,2,1,2,1,2,1],
            [2,1,2,1,2,1,2],
            [1,2,1,2,1,2,1],
            [2,1,2,1,2,1,2],
            [1,2,1,2,1,2,1],
            [2,1,2,1,2,1,2],
            [1,2,1,2,1,2,1],
            [3,1,2,1,2,1,3],
            [3,3,1,2,1,3,3],
            [3,3,3,0,3,3,3],
        ];

        this.currBoard = [
            [7,7,7,7,5,7,7,7,7],
            [7,7,7,0,0,0,7,7,7],
            [7,7,0,0,0,0,0,7,7],
            [7,0,0,1,0,1,0,0,7],
            [7,0,2,2,2,2,2,0,7],
            [7,0,0,0,0,0,0,0,7],
            [7,0,0,0,0,0,0,0,7], 
            [7,0,0,0,0,0,0,0,7], 
            [7,0,3,3,3,3,3,0,7], 
            [7,0,0,4,0,4,0,0,7], 
            [7,7,0,0,0,0,0,7,7],
            [7,7,7,0,0,0,7,7,7], 
            [7,7,7,7,6,7,7,7,7]];

        this.board_cells = [];
        this.listOfBoards = [];
        this.indexBoard;
        this.listOfMoves = [];
        this.indexMovie = 0;

        this.texture_white = this.scene.graph.textures["white_cell"];
        this.texture_black = this.scene.graph.textures["black_cell"];
        this.texture_castle = this.scene.graph.textures["castle_cell"];
        this.texture_empty = this.scene.graph.textures["table"];
        this.buildBoard();
    }

    resetListOfBoards() {
        this.listOfBoards = [];
        this.listOfMoves = [];
        this.indexBoard = 0;
        var dummy_board = [];
        for(var i = 0; i < this.currBoard.length; i++){
            var dummy_line=[];
            for(var j = 0; j < this.currBoard[i].length; j++){
                dummy_line.push(this.currBoard[i][j]);
            }
            dummy_board.push(dummy_line);
        }
        this.listOfBoards.push(dummy_board);
    }

    resetBoard() {
        this.currBoard = [
            [7,7,7,7,5,7,7,7,7],
            [7,7,7,0,0,0,7,7,7],
            [7,7,0,0,0,0,0,7,7],
            [7,0,0,1,0,1,0,0,7],
            [7,0,2,2,2,2,2,0,7],
            [7,0,0,0,0,0,0,0,7],
            [7,0,0,0,0,0,0,0,7], 
            [7,0,0,0,0,0,0,0,7], 
            [7,0,3,3,3,3,3,0,7], 
            [7,0,0,4,0,4,0,0,7], 
            [7,7,0,0,0,0,0,7,7],
            [7,7,7,0,0,0,7,7,7], 
            [7,7,7,7,6,7,7,7,7]];
    }

    buildBoard() {
        for (var i = 0; i <  this.gameBoard.length; i++) {
            var line = [];
            for (var j = 0; j < this.gameBoard[i].length; j++) {
                var a_ascii = "A".charCodeAt();
                var letter = String.fromCharCode(a_ascii + j);
                var texture;
                switch(this.gameBoard[i][j]) {
                    case 0: texture = this.texture_castle; break;
                    case 1: texture = this.texture_white; break;
                    case 2: texture = this.texture_black; break;
                    case 3: texture = this.texture_empty;
                }
                var cell = new Cell(this.scene, letter, i+1, texture);
                line.push(cell);
            }
            this.board_cells.push(line);
        }
    }

    delete_from_board(coords) {
        this.currBoard[coords[0]][coords[1]+1] = 0;
    }

    undo() {
        this.indexBoard=this.indexBoard-1;
        if(this.indexBoard < 0) {
            this.indexBoard = 0;
        }
        this.listOfBoards.length=this.indexBoard+1;
        this.listOfMoves.length=this.indexBoard;

        var dummy_board = [];
        for(var i = 0; i < this.listOfBoards[this.indexBoard].length; i++){
            var dummy_line=[];
            for(var j = 0; j < this.listOfBoards[this.indexBoard][i].length; j++){
                dummy_line.push(this.listOfBoards[this.indexBoard][i][j]);
            }
            dummy_board.push(dummy_line);
        }

        this.currBoard = dummy_board;
    }

    /*Function that updates the board.*/
    update_board(coordinates_before, coordinates_after) {
        this.listOfMoves.push([[coordinates_before[0],coordinates_before[1]], [coordinates_after[0], coordinates_after[1]]]);
        var pawn = this.currBoard[coordinates_before[0]][coordinates_before[1]+1];
        this.currBoard[coordinates_before[0]][coordinates_before[1]+1] = 0;
        this.currBoard[coordinates_after[0]][coordinates_after[1]+1] = pawn;

        var dummy_board = [];
        for(var i = 0; i < this.currBoard.length; i++){
            var dummy_line=[];
            for(var j = 0; j < this.currBoard[i].length; j++){
                dummy_line.push(this.currBoard[i][j]);
            }
            dummy_board.push(dummy_line);
        }
        this.listOfBoards.push(dummy_board);
        this.indexBoard = this.indexBoard+1;
    }

    display() {
        for (var i = 0; i <  this.gameBoard.length; i++) {
            for (var j = 0; j < this.gameBoard[i].length; j++) {
                
                if(j == 0 && i != 0)
                    this.scene.translate(0, -this.gameBoard[i].length, 0);
                this.scene.translate(0, 1, 0); 
                if(this.board_cells[i][j].picking)
                    this.scene.registerForPick(i*this.gameBoard[i].length+j+1, this.board_cells[i][j]);
                this.board_cells[i][j].display();
                this.board_cells[i][j].picking = false;
            }
            this.scene.translate(1, 0, 0);
        }
    }
}
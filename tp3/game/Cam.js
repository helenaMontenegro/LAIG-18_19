 class Cam {
    
 constructor(scene) {
        this.scene = scene;
        this.graph = this.scene.graph;
        this.boardBuilt = false;

        this.client = new Client(8081);
        this.selected_pawn = null;

        this.state = {
            waiting_start: 0,
            picking_pawn: 1,
            process_picking: 2,
            picking_next_cell_position: 3,
            pawn_animation: 4,
            win: 5,
            conection_error: 6,
            checking_game_over : 7,
            picking_bots_move: 8,
            quit_game: 9,
            movie: 10,
            camera_animation : 11
        };

        this.player = {
            white_player: "'*'",
            black_player: "'.'"
        };

        this.modeGame = {
            Player_vs_Player: 0,
            Player_vs_Pc: 1,
            Pc_vs_Pc: 2,
            Movie: 3
        };

        this.next_state;
        this.pc_1_difficulty;
        this.pc_2_difficulty;
        this.time_out = false;

        this.currPlayer=this.player.white_player;
        this.cells_for_picking = [];
        
        this.gameMode = this.modeGame.Player_vs_Player;
        this.currentState = this.state.waiting_start;

        this.enemy=false;
        this.points = [0, 0];
        
        this.board = new Board(this.scene);

        this.pawns=[];
        this.generatePawns();

        this.white_eaten_pawns = [];
        this.black_eaten_pawns = [];

        this.coords_before;
        this.coords_after;
        this.boardBuilt = true;
    }

    /*Function that creates the pawns according to the board currBoard. */
    generatePawns() {
        for(var i = 0; i < this.board.currBoard.length; i++) {
            for(var j = 1; j < this.board.currBoard[i].length-2; j++) {
                var new_pawn;
                if(this.board.currBoard[i][j] == 1) {
                    new_pawn = new Pawn(this.scene, this.player.black_player, "knight", [i, j-1]);
                    this.pawns.push(new_pawn);
                }
                else if(this.board.currBoard[i][j] == 2) {
                    new_pawn = new Pawn(this.scene, this.player.black_player, "pawn", [i, j-1]);
                    this.pawns.push(new_pawn);
                }
                else if(this.board.currBoard[i][j] == 3) {
                    new_pawn = new Pawn(this.scene, this.player.white_player, "pawn", [i, j-1]);
                    this.pawns.push(new_pawn);
                }
                else if(this.board.currBoard[i][j] == 4) {
                    new_pawn = new Pawn(this.scene, this.player.white_player, "knight", [i, j-1]);
                    this.pawns.push(new_pawn);
                }
            }
        }
    };

    reset_pawns() {
        var aux_pawns = [];
        for(var d = 0; d < this.pawns.length; d++) {
            aux_pawns.push(this.pawns[d]);
            this.pawns.splice(d,1);
            d--;
        }
        for(var i = 0; i < this.board.currBoard.length; i++) {
            for(var j = 1; j < this.board.currBoard[i].length-1; j++) {
                var pl=null;
                var type=null;
                if(this.board.currBoard[i][j] == 1) {
                    pl=this.player.black_player;
                    type="knight";
                }
                else if(this.board.currBoard[i][j] == 2) {
                    pl=this.player.black_player;
                    type="pawn";
                }
                else if(this.board.currBoard[i][j] == 3) {
                    pl=this.player.white_player;
                    type="pawn";
                }
                else if(this.board.currBoard[i][j] == 4) {
                    pl=this.player.white_player;
                    type="knight";
                }
                if(pl!=null && type!=null){
                    for(var a = 0; a < aux_pawns.length; a++) {
                        if(aux_pawns[a].type == type && aux_pawns[a].player == pl) {
                            aux_pawns[a].coordinates[0] = i;
                            aux_pawns[a].coordinates[1] = j-1;
                            aux_pawns[a].x = -3.0 + aux_pawns[a].coordinates[0]/2.0;
                            aux_pawns[a].y = 3.6 - aux_pawns[a].coordinates[1]/2.0;
                            this.pawns.push(aux_pawns[a]);
                            aux_pawns.splice(a,1);
                            break;
                        }
                    }
                }
            }
        }
        for(var e = 0; e < aux_pawns.length; e++) {
            this.white_eaten_pawns = [];
            this.black_eaten_pawns = [];
            if(aux_pawns[e].player == this.player.white) {
                this.white_eaten_pawns.push(aux_pawns[e]);
                aux_pawns[e].coordinates[0] = this.white_eaten_pawns.length;
                aux_pawns[e].coordinates[1] = -6;
                aux_pawns[e].x = -3.0 + aux_pawns[e].coordinates[0]/2.0;
                aux_pawns[e].y = 3.6 - aux_pawns[e].coordinates[1]/2.0;
            }
            else {
                this.black_eaten_pawns.push(aux_pawns[e]);
                aux_pawns[e].coordinates[0] = 12 - this.black_eaten_pawns.length;
                aux_pawns[e].coordinates[1] = 12;
                aux_pawns[e].x = -3.0 + aux_pawns[e].coordinates[0]/2.0;
                aux_pawns[e].y = 3.6 - aux_pawns[e].coordinates[1]/2.0;
            }
            this.pawns.push(aux_pawns[e]);
            aux_pawns.splice(e, 1);
            e--;
        }
    }

    /* In state picking_pawn: get's all the player's pieces in order to register them for picking. */
    get_players_cells_for_picking() {
        this.cells_for_picking = [];
        for(var i = 0; i < this.pawns.length; i++) {
            if(this.pawns[i].player == this.currPlayer)
                this.cells_for_picking.push(this.pawns[i].coordinates);
        }
    }

    /*Display of the pawns of the game.*/
    displayPawns() {
        for (var i = 0; i < this.pawns.length; i++) {
            var x = this.pawns[i].coordinates[0];
            var y = this.pawns[i].coordinates[1];
            if(this.pawns[i].picking)
                this.scene.registerForPick(x*this.board.gameBoard[x].length+y+1, this.pawns[i]);
            this.pawns[i].display();
        }
    }

    /*Dispay of the game.*/
    display() {
        this.scene.pushMatrix();
        this.scene.rotate(-90*degToRad, 1, 0, 0);
        this.scene.scale(0.5,0.5,1);
        this.scene.translate(-6.5,-8.7, 1.51);
        /*SELECTING CELLS FOR PICKING*/
        if(this.currentState != this.state.waiting_start && this.currentState != this.state.win) {
            for(var m = 0; m < this.cells_for_picking.length; m++) {
                var a = this.cells_for_picking[m][0];
                var b = this.cells_for_picking[m][1];
                if(a < this.board.board_cells.length && b < this.board.board_cells[a].length) {
                    for(var n = 0; n < this.pawns.length; n++) {
                        if(this.pawns[n].coordinates[0] == a && this.pawns[n].coordinates[1] == b) {
                            this.pawns[n].picking = true;
                        }
                    }
                    this.board.board_cells[a][b].picking = true;
                }
            }
        }
        /*END OF SELECTING CELLS FOR PICKING*/

        this.board.display();
        this.scene.popMatrix();
        this.displayPawns();
    }

    /*Function that decides what to do when a cell is picked, according to the state.*/
    get_picked_cell(id_picking) {
        if(!this.boardBuilt)
            return;
    
        id_picking -= 1;
        var y = id_picking % this.board.gameBoard[0].length;
        var x = (id_picking - id_picking % this.board.gameBoard[0].length) / this.board.gameBoard[0].length;
        if(x != null && y != null) {
            if(this.currentState==this.state.picking_pawn && this.board.currBoard[x][y+1] != 0 && this.board.currBoard[x][y+1] != 7) {              
                for(var i = 0; i < this.pawns.length; i++)
                {
                    if(this.pawns[i].coordinates[0] == x && this.pawns[i].coordinates[1] == y) {
                        this.selected_pawn = this.pawns[i];
                        this.currentState = this.state.picking_next_cell_position;
                        this.check_game_state();
                    }
                }
            } else if(this.currentState==this.state.picking_next_cell_position && 
                (this.board.currBoard[x][y+1] == 0 || this.board.currBoard[x][y+1] == 5 || this.board.currBoard[x][y+1] == 6)) {
                this.currentState=this.state.pawn_animation;
                var coordinates_before = this.selected_pawn.coordinates;
                this.selected_pawn.setAnimation([x, y]);
                this.coords_before = coordinates_before;
                this.coords_after = [x,y];
                this.check_jump_over_enemies(coordinates_before, [x,y]);
                this.cells_for_picking=[];
            }
        }
    }

    /*Function that asks prolog if a pawn is to be deleted from the board (because it was jumped over) */
    check_jump_over_enemies(coordinates_before, [x,y]) {
        var coords1 = this.get_cell_for_plog(coordinates_before);
        var coords2 = this.get_cell_for_plog([x,y]);
        var board_to_send = this.parseBoard();
        var command = "check_jump_over_enemy(" + this.currPlayer + "," + coords1 + "-" + coords2 + "," + board_to_send + ")";
        this.send_command(command, "jump_enemies");
    }

    /*Function that deletes the enemy pawn that was jumped over in a movement.*/
    find_enemy_cell() {
        var potential_enemy_x, potential_enemy_y;
        if(this.coords_after[0] == this.coords_before[0])
            potential_enemy_x = this.coords_after[0];
        else if(this.coords_after[0] < this.coords_before[0])
            potential_enemy_x = this.coords_after[0]+1;
        else if(this.coords_after[0] > this.coords_before[0])
            potential_enemy_x = this.coords_after[0]-1;

        if(this.coords_after[1] == this.coords_before[1])
            potential_enemy_y = this.coords_after[1];
        else if(this.coords_after[1] < this.coords_before[1])
            potential_enemy_y = this.coords_after[1]+1;
        else if(this.coords_after[1] > this.coords_before[1])
            potential_enemy_y = this.coords_after[1]-1;
        
        if(this.gameMode != this.modeGame.Movie) {
            this.board.delete_from_board([potential_enemy_x, potential_enemy_y]);
        }
        for(var i = 0; i < this.pawns.length; i++)
        {
            if(this.pawns[i].coordinates[0] == potential_enemy_x && this.pawns[i].coordinates[1] == potential_enemy_y) {
                this.selected_pawn = this.pawns[i];
                var coords_animation = [0,0];
                if(this.pawns[i].player == this.player.white_player) {
                    var index = null;
                    for(var s = 0; s < this.white_eaten_pawns.length; s++) {
                        if(this.white_eaten_pawns[s] == this.selected_pawn) {
                            index=s+1;
                            break;
                        }
                    }
                    if(index==null) {
                        this.white_eaten_pawns.push(this.selected_pawn);
                        coords_animation = [this.white_eaten_pawns.length, -6];
                    } else {
                        coords_animation = [index, -6];
                    }
                }
                else {
                    var index = null;
                    for(var s = 0; s < this.black_eaten_pawns.length; s++) {
                        if(this.black_eaten_pawns[s] == this.selected_pawn) {
                            index=s+1;
                            break;
                        }
                    }
                    if(index==null) {
                        this.black_eaten_pawns.push(this.selected_pawn);
                        coords_animation = [12 - this.black_eaten_pawns.length, 12];
                    } else {
                        coords_animation = [12 - index, 12];
                    }
                }
                this.selected_pawn.setAnimation(coords_animation);
                this.currentState = this.state.pawn_animation;
                break;
            }
        }
    }

    /** Function that switched players and calls the function to rotate the camera.*/
    switch_players() {
        if(this.currPlayer == this.player.white_player){
            this.currPlayer = this.player.black_player;
        }
        else {
            this.currPlayer = this.player.white_player;
        }
        this.scene.changeCamera();
    }

    /** Function called when the animation is over, to change the state back to picking.*/
    go_back_to_first_move() {
        if(this.enemy) {
            this.find_enemy_cell();
            this.enemy = false;
            return;
        }
        if(!this.time_out && this.gameMode != this.modeGame.Movie)
            this.board.update_board(this.coords_before, this.coords_after);
        else this.time_out = false;
        this.currentState = this.state.checking_game_over;
        this.check_game_state();
    }

    /** Function that sees what there is to do according to the state. */
    check_game_state(){
        if(this.currentState == this.state.picking_pawn) {
            var board_to_send=this.parseBoard();
            var command="valid_moves("+ board_to_send + "," + this.currPlayer + ")";
            this.send_command(command, "default");
        }
        else if(this.currentState == this.state.picking_next_cell_position) {
            var board_to_send=this.parseBoard();
            var cell = this.get_cell_for_plog(this.selected_pawn.coordinates);
            var command="valid_moves("+ board_to_send + "," + this.currPlayer + "," + cell + ")";
            this.send_command(command, "default");
        } 
        else if(this.currentState == this.state.checking_game_over) {
            var board_to_send=this.parseBoard();
            var command="game_over("+ board_to_send + "," + this.currPlayer + ")";
            this.send_command(command, "default");
        }
        else if(this.currentState == this.state.picking_bots_move) {
            var board_to_send=this.parseBoard();
            var command="choose_move("+ board_to_send + "," + this.currPlayer + ")";
            this.send_command(command, "default");
        }
        else if (this.currentState == this.state.movie) {
            this.movie_move();
        }
    }

    /**Function that establishes communication with plog. */
    send_command(command, action) {
        var cam = this;
        var action = action;
        this.client.getPrologRequest(
            command, 
            function(data){
                if(action == "default")
                    cam.interpret_answer(data.target.response);
                else if(action == "jump_enemies") {
                    if(data.target.response == "1"){
                        cam.enemy = true;
                    }
                }
            }, 
            function(data){
                console.log("Error conecting with prolog!");
            }
        );
    }

    /** Turns coordinates in numbers format to 'Letter'-Number format */
    get_cell_for_plog(coords) {
        var letter_int = coords[1] + 65;
        var letter = String.fromCharCode(letter_int);
        var number = coords[0] + 1;
        var cell = "'" + letter + "'-" + number;
        return cell;
    }

    /** Turns 'Letter'-Number format to int coordinates. */
    get_reverse_cell_for_plog(string) {
        var letter = string.charCodeAt(0) - 65;
        var number = parseInt(string.substring(2, string.length))-1;
        var cell = [number, letter];
        return cell;
    }

    /** Function that interprets answer from plog. */
    interpret_answer(answer) {
        if (this.currentState==this.state.picking_next_cell_position || this.currentState==this.state.picking_pawn) {
            answer = answer.substring(1, answer.length-1);
            var possible_cells = answer.split(",");
            this.cells_for_picking = [];
            for(var i = 0; i < possible_cells.length; i++) {
                this.cells_for_picking.push(this.get_reverse_cell_for_plog(possible_cells[i]));
            }
        }
        else if(this.currentState == this.state.checking_game_over) {
            if(answer == 1) {
                if(this.gameMode == this.modeGame.Movie) {
                    this.scene.update_message("End of replay!");
                    return;
                }
                this.currentState = this.state.win;
                if(this.currPlayer == this.player.white_player) {
                    this.points[0] += 1;
                    this.scene.update_message("Game Over! White player wins!");
                }
                else {
                    this.points[1] += 1;
                    this.scene.update_message("Game Over! Black player wins!");
                }
                this.scene.quitGame();
            } else {
                this.switch_players();
                this.scene.reset_clock();
                this.scene.set_active_clock(true);
                if((this.gameMode == this.modeGame.Player_vs_Pc && this.currPlayer == this.player.black_player) ||
                        this.gameMode == this.modeGame.Pc_vs_Pc) 
                    this.currentState = this.state.picking_bots_move;
                else if(this.gameMode == this.modeGame.Movie)
                    this.currentState = this.state.movie;
                else
                    this.currentState=this.state.picking_pawn;
                this.check_game_state();
            }
        }
        else if(this.currentState == this.state.picking_bots_move) {
            var answer_separated = answer.split("-");
            var coords = this.get_reverse_cell_for_plog(answer_separated[0] + "-" + answer_separated[1]);
            var dest_coords = this.get_reverse_cell_for_plog(answer_separated[2] + "-" + answer_separated[3]);
            for(var i = 0; i < this.pawns.length; i++) {
                if(this.pawns[i].coordinates[0] == coords[0] && this.pawns[i].coordinates[1] == coords[1]) {
                    this.selected_pawn = this.pawns[i];
                }
            }
            this.currentState=this.state.pawn_animation;
            var coordinates_before = this.selected_pawn.coordinates;
            this.selected_pawn.setAnimation(dest_coords);
            this.coords_before = coordinates_before;
            this.coords_after = dest_coords;
            this.check_jump_over_enemies(coordinates_before, dest_coords);
            this.cells_for_picking=[];
        }
    }

    /** Function to put the board in a string in order to communicate with plog. */
    parseBoard(){
        var curr_board = this.board.currBoard;
        if(this.gameMode == this.modeGame.Movie) {
            curr_board = this.board.listOfBoards[this.board.indexMovie-1];
        }
        var board_to_send="[";
        for(var i=0; i<curr_board.length-1; i++){
            board_to_send+="[";
            for(var j=0; j<curr_board[i].length-1; j++){
                if(curr_board[i][j]==7){
                    board_to_send+="n"+",";
                }
                else  board_to_send+=curr_board[i][j]+",";
            }

            if(curr_board[i][curr_board[i].length-1]==7){
                board_to_send+="n],";
            }
            else board_to_send+=curr_board[i][curr_board[i].length-1]+"],";  
        }

        board_to_send+="[";
        
        for(var j=0; j<curr_board[i].length-1; j++){
            if(curr_board[i][j]==7){
                board_to_send+="n"+",";
            }
            else  board_to_send+=curr_board[i][j]+",";
        }

        if(curr_board[i][curr_board[i].length-1]==7){
            board_to_send+="n]]";
        }
        else board_to_send+=curr_board[i][curr_board[i].length-1]+"]]";  

        return board_to_send;
    
    }

    /** Function that takes care of the time_out. */
    clock_time_out() {
        if(this.gameMode == this.modeGame.Player_vs_Player || 
            (this.gameMode == this.modeGame.Player_vs_Pc && this.currPlayer == this.player.white_player)) {
            if(this.currentState == this.state.picking_pawn || this.currentState == this.state.picking_next_cell_position){
                this.time_out = true;
                this.go_back_to_first_move();
            }
        }
    }

    /*Function that resets the game, and starts it.*/
    start(){
        if(this.currentState == this.state.waiting_start){
            this.board.resetBoard();
            this.board.resetListOfBoards();
            this.reset_pawns();
            this.currPlayer=this.player.white_player;

            switch (this.scene.gameMode) {
            case "Player vs Player":
                this.gameMode = this.modeGame.Player_vs_Player;
                this.currentState = this.state.picking_pawn;
                break;
                
            case "Pc vs Pc":
                this.gameMode = this.modeGame.Pc_vs_Pc;
                this.currentState = this.state.picking_bots_move;
                break;
               
            case "Player vs Pc":
                this.gameMode = this.modeGame.Player_vs_Pc;
                this.currentState = this.state.picking_pawn;
                break;
            }

            if(this.gameMode == this.modeGame.Player_vs_Pc || this.gameMode == this.modeGame.Player_vs_Player)
                this.get_players_cells_for_picking();
            else
                this.check_game_state();
            this.scene.reset_clock();
            this.scene.set_active_clock(true);
                    
            switch (this.scene.Pc1Difficulty) {
                case "Easy":
                this.pc_1_difficulty = 1;
                break;
                case "Hard":
                this.pc_1_difficulty = 1;
                break;
                default:
                break;
            }

            switch (this.scene.Pc2Difficulty) {
                case "Easy":
                this.pc_2_difficulty = 1;
                break;
                case "Hard":
                this.pc_2_difficulty = 1;
                break;
                default:
                break;
            }
        } else {
            this.scene.update_message("Quit or finish the ongoing game first!");
        }
    }
    
    /*Function that performs the undo option.*/
    undo() {
        if(this.currentState == this.state.waiting_start) {
            this.scene.update_message("Start a game first!");
            return;
        } else if(this.gameMode == this.modeGame.Movie || this.gameMode == this.modeGame.Pc_vs_Pc)
        {
            this.scene.update_message("You can't undo the pc's play!");
            return;
        } else if (this.gameMode == this.modeGame.Player_vs_Pc && this.currPlayer == this.player.black_player){
            this.scene.update_message("Wait for your turn to undo your play!");
            return;
        }
        else if (this.currentState == this.state.pawn_animation) {
            this.scene.update_message("Wait for animation to finish!");
            return;
        } else if (this.board.listOfBoards.length==1) {
            this.scene.update_message("Start playing first!");
            return;
        }
        
        this.scene.reset_clock();
        this.scene.set_active_clock(true);
        if(this.gameMode == this.modeGame.Player_vs_Pc && this.currPlayer == this.player.white_player)
        {
            this.board.undo();
        }
        this.board.undo();
        if(!(this.gameMode == this.modeGame.Player_vs_Pc && this.currPlayer == this.player.white_player)) {
            this.switch_players();
        }
        this.reset_pawns();
        if(this.gameMode == this.modeGame.Player_vs_Player || 
            (this.gameMode == this.modeGame.Player_vs_Pc && this.currPlayer == this.player.white_player)){
            this.currentState=this.state.picking_pawn;
            this.get_players_cells_for_picking();
        }
        else {
            this.currentState = this.state.picking_bots_move;
            this.check_game_state();
        }
    }

    /*Function to quit the current game (or movie). */
    quit() {
        if(this.currentState == this.state.pawn_animation) {
            this.selected_pawn.animation = null;
        }
        this.currentState = this.state.waiting_start;
        this.board.resetBoard();
        this.white_eaten_pawns=[];
        this.black_eaten_pawns=[];
        this.reset_pawns();
        this.cells_for_picking=[];
    }

    /*Function that shows the replay of the last game played. */
    movie() {
        if(this.board.listOfBoards.length <= 1 || this.currentState != this.state.waiting_start) {
            this.scene.update_message("No game available for replay");
            return;
        }
        this.scene.reset_clock();
        this.scene.set_active_clock(true);
        this.scene.setPlayerCamera();
        this.scene.update_message("Replaying latest game!");
        this.currentState = this.state.movie;
        this.currPlayer=this.player.white_player;
        this.gameMode = this.modeGame.Movie;
        this.board.currBoard = this.board.listOfBoards[0];
        this.reset_pawns();
        this.cells_for_picking = [];
        this.movie_move();
    }

    /*Auxiliar function to the previous one that shows in each iteration it's called each position. */
    movie_move() {
        if(this.board.indexMovie >= this.board.listOfMoves.length) {
            this.board.indexMovie = 0;
            this.scene.update_message("End of replay!");
            this.scene.quitGame();
            return;
        }
        var coordinates = this.board.listOfMoves[this.board.indexMovie];
        this.board.indexMovie += 1;
        this.coords_before = coordinates[0];
        for(var i = 0; i < this.pawns.length; i++)
        {
            if(this.pawns[i].coordinates[0] == this.coords_before[0] && this.pawns[i].coordinates[1] == this.coords_before[1])
                this.selected_pawn = this.pawns[i];
        }
        this.coords_after = coordinates[1];
        this.currentState=this.state.pawn_animation;
        this.selected_pawn.setAnimation(coordinates[1]);
        this.check_jump_over_enemies(coordinates[0], coordinates[1]);
    }
}
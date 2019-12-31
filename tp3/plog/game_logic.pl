/*Function that recieves a Board and the current Player and returns the list of possible movements.
If the Player is on its castle,  the only valid move is to get out of it.*/
valid_moves(Board, Player, ListOfMoves) :- 
    castle(Player, L-N), check_board(Board, Symbol, L-N), players_pieces(Player, Symbol), !,
    check_pawns(Board, Player, [L-N], ListOfMovements, [], ListOfEnemies, [], ListOfFriends, []), 
    return_list_of_moves(ListOfMoves, ListOfMovements, ListOfEnemies, ListOfFriends).

valid_moves(Board, Player, ListOfMoves) :-
    get_pawns(Board, Player, ListOfPawns),
    check_pawns(Board, Player, ListOfPawns, ListOfMovements, [], ListOfEnemies, [], ListOfFriends, []), !,
    return_list_of_moves(ListOfMoves, ListOfMovements, ListOfEnemies, ListOfFriends).

/*Function to check if Player still has enemy pawns to eat if it jumped over one already.*/
has_enemies(Board, Player, LCell-NCell) :- 
    check_pawns(Board, Player, [LCell-NCell], _, [], Enemies, [], _, []), 
    length(Enemies, Len), Len>0.

/*Function to check if Player still has friends pawns to jump over if it jumped over one already.*/
has_friends(Board, Player, LCell-NCell, Length) :- 
    \+ has_enemies(Board, Player, LCell-NCell),
    check_pawns(Board, Player, [LCell-NCell], _, [], _, [], Friends, []),
    length(Friends, Len), Len>Length.

/*Function that returns the list of valid moves (ListOfMoves) based on the other 3 lists of possible movements separated into 3 categories:
ListOfMoves - direct movements, ListOfEnemies - jumps over enemies, ListOfFriends, jumps over friends.*/
return_list_of_moves(ListOfMoves, ListOfMovements, ListOfEnemies, ListOfFriends):-
    ListOfEnemies=[], !,
    append(ListOfMovements, ListOfFriends, ListOfMoves).

return_list_of_moves(ListOfMoves, _, ListOfEnemies, _):-
    ListOfMoves = ListOfEnemies.

/*Function that, for each pawn of the player, checks the adjacent cells and saves the valid movements into 3 categories:
ListOfMoves - direct movements, ListOfEnemies - jumps over enemies, ListOfFriends, jumps over friends.*/
check_pawns(_, _, [], ListOfMoves, Aux1, ListOfEnemies, Aux2, ListOfFriends, Aux3) :- ListOfMoves = Aux1,
                                                                                ListOfEnemies = Aux2,
                                                                                ListOfFriends = Aux3.
check_pawns(Board, Player, [H|T], ListOfMoves, Aux1, ListOfEnemies, Aux2, ListOfFriends, Aux3) :- adjacent_cells(H, List), 
                                                    check_adjacents(Board, Player, H, List, Moves, Aux1, Enemies, Aux2, Friends, Aux3),
                                                    check_pawns(Board, Player, T, ListOfMoves, Moves, ListOfEnemies, Enemies, ListOfFriends, Friends).

/*Function that goes through the list of adjacent cells (L-N) of a pawn located in Letter-Number of the Player and puts in Moves the 
movements that can be done directly, in Enemies, the movements where the pawn jumps over an opponent's pawn and in Friends, the movements
where the pawn jumps over pawns.
Base Case: when the list is empty put in the Moves, Friends and Enemies lists what's in the auxiliary lists.*/
check_adjacents(_, _,_-_, [], Moves, Aux1, Enemies, Aux2, Friends, Aux3) :- Moves=Aux1, Enemies=Aux2, Friends=Aux3.
check_adjacents(Board, Player, Letter-Number, [L-N|T], Moves, Aux1, Enemies, Aux2, Friends, Aux3) :- 
    check_board(Board, Symbol, L-N), 
    check_symbol(Board, Player, Symbol, Letter-Number, L-N, Aux1, Aux11, Aux2, Aux22, Aux3, Aux33),
    check_adjacents(Board, Player, Letter-Number,T, Moves, Aux11, Enemies, Aux22, Friends, Aux33).
check_adjacents(Board, Player, Letter-Number, [_|T], Moves, Aux1, Enemies, Aux2, Friends, Aux3) :- 
    check_adjacents(Board, Player, Letter-Number, T, Moves, Aux1, Enemies, Aux2, Friends, Aux3).

/*Function that moves a pawn, if possible, and changes the board accordingly. It receives the cell in which the pawn is and to which the pawn
will go, the TypeOfPlayer that is playing (Player or Computer), the Player and the current Board and it returns the new board.*/
move(Letter-Number-NewLetter-NewNumber, TypeOfPlayer, Player, Board, NewBoard) :-
    valid_moves(Board, Player, ListOfMoves),
    member(Letter-Number-NewLetter-NewNumber, ListOfMoves),
    check_board(Board, Symbol, Letter-Number),
    change_board(Board, 0, Letter-Number, Board1), 
    change_board(Board1, Symbol, NewLetter-NewNumber, Board2),
    display(TypeOfPlayer, Player, Letter-Number-NewLetter-NewNumber, Board2, NewBoard).

/*When the movement can't be made there's a new try.*/
move(Move, TypeOfPlayer, Player, Board, NewBoard):- write('Can\'t perform move: '), write(Move), write('. Try again.'), 
    players_turn(Board, TypeOfPlayer, Player, NewBoard).

/*Function that determines whether the end of game was achieved.
The following instance occurs when the Player gets to the opponent's castle.*/
game_over(Board, Player) :- enemy(Player, Opponent),
    castle(Opponent, Letter-Number),
    check_board(Board, Symbol, Letter-Number), 
    players_pieces(Player, Symbol),
    nl, nl, write('****GAME OVER****'), nl, write('**** Player '), write(Player), write(' wins****').

/*Function that determines whether the end of game was achieved.
The following instance occurs when the Player eats the opponent's pawns.*/
game_over(Board, Player) :- enemy(Player, Opponent),
    get_pawns(Board, Opponent, ListOfPawns),
    length(ListOfPawns, 0),
    nl, nl, write('****GAME OVER****'), nl, write('**** Player '), write(Player), write(' wins****').

/*Game loop that receives the initial board and the types of players ('C1', 'C2', 'C3' - computer, 'P' - player)*/
game_loop(Board, TypeOfPlayer1, TypeOfPlayer2) :- 
    players_turn(Board, TypeOfPlayer1, '*', NewBoard), !,
    display_game(NewBoard, '.'),!,
    \+game_over(NewBoard, '*'),
    players_turn(NewBoard, TypeOfPlayer2, '.', NewBoard2), !,
    display_game(NewBoard2, '*'),!,
    \+game_over(NewBoard2, '.'),
    game_loop(NewBoard2, TypeOfPlayer1, TypeOfPlayer2).

/*Analyzes the player's answer to wanting to jump over a friend after jumping over another one. If the answer received as the third
parameter is 1, it asks the Player for the Cell he wants to move to and performs the movement. 
If the answer is 2, it continues, returning the current board.*/
analyze_input(Board, Player, 1, NewBoard, OldCell-CurLetter-CurNumber) :- 
    display_game(Board, Player), 
    readNewCell(NLetter-NNumber), 
    check_cell(Board, Player, NewBoard, OldCell-CurLetter-CurNumber, NLetter-NNumber).
analyze_input(Board, _, 2, NewBoard, _) :- NewBoard = Board.

/*Function that checks if the pawn can move to cell received as NLetter-NNumber. It receives the current Player, the current Board,
the previous movement (OldCell-CurLetter-CurNumber) and returns the resulting board in NewBoard*/
check_cell(Board, Player, NewBoard, OldCell-CurLetter-CurNumber, NLetter-NNumber) :-
    checkNewCell(NLetter-NNumber, CurLetter-CurNumber, OldCell, NewLetter-NewNumber, Board, Player), !,
    move(CurLetter-CurNumber-NewLetter-NewNumber, 'P', Player, Board, NewBoard).

/*Function that checks if the input received from the Player after jumping over a friend is valid.
To do so, it checks if the pawn isn't jumping back to the cell it initially started at.*/
checkNewCell(ReadCell, CurCell, OldCell, NewCell, Board, Player) :- 
    OldCell = ReadCell, !, nl, write('You can\'t move to the same cell again!'), nl,
    readNewCell(NCell),
    checkNewCell(NCell, CurCell, OldCell, NewCell, Board, Player).
/*Checks if the movement is valid.*/
checkNewCell(ReadL-ReadN, CurCell, OldCell, NewCell, Board, Player) :-
    check_if_not_friend(ReadL-ReadN, CurCell, OldCell, NewCell, Board, Player), !, write('You can\'t move to that cell!'),
    readNewCell(NCell),
    checkNewCell(NCell, CurCell, OldCell, NewCell, Board, Player).
checkNewCell(NCell, _, _, NewCell, _, _):- NewCell = NCell.

/*Auxiliary function to checkNewCell, that checks if the cell selected as input corresponds to a cell reached after a jump over a friend.*/
check_if_not_friend(ReadL-ReadN, CurCell, _, _, Board, Player) :- 
    check_pawns(Board, Player, [CurCell], _, [], _, [], Friends, []), !, 
    \+ member(CurCell-ReadL-ReadN, Friends).

/*Function that decides the movement for the current's player turn. If the player is of type 'P', then it's an user and the program will ask
for the desired movement.*/
players_turn(Board, TypeOfPlayer, Player, NewBoard) :- TypeOfPlayer = 'P', !,
    readingInput(Board, OldLetter-OldNumber, NewLetter-NewNumber, Player),
    move(OldLetter-OldNumber-NewLetter-NewNumber, TypeOfPlayer, Player, Board, NewBoard).

/*Function that decides the movement for the current's player turn. If the TypeOfPlayer is 'C1', it gets the movement from the easiest level of
computing.*/
players_turn(Board, TypeOfPlayer, Player, NewBoard) :- TypeOfPlayer = 'C1', !,
    choose_move(1, Player, Move, Board),
    move(Move, TypeOfPlayer, Player, Board, NewBoard).

/*Function that decides the movement for the current's player turn. If the TypeOfPlayer is 'C2', it gets the movement from the hardest level of
computing.*/
players_turn(Board, TypeOfPlayer, Player, NewBoard) :- TypeOfPlayer = 'C2', !, 
    choose_move(2, Player, Board, NewBoard).

/* display(TypeOfPlayer, Player, OldLetter-OldNumber-NewLetter-NewNumber, Board, NewBoard)
Function that decides whether or not the player has to play again (when the pawn jumps over an enemy and has to jump again).*/
/*If the player is a intelligent bot, the game is displayed on another function.*/
display('C2', Player, OldLetter-OldNumber-NewLetter-NewNumber, Board, NewBoard) :- 
    check_jump_over_enemy(Player, OldLetter-OldNumber-NewLetter-NewNumber, Board, NewBoard), !.
display('C2', _, _, Board, NewBoard) :- NewBoard = Board.

/*If the player is a simple bot or a player, and the pawn still has enemies to jump over, after jumping over an enemy, it does so.*/
display(TypeOfPlayer, Player, OldLetter-OldNumber-NewLetter-NewNumber, Board, NewBoard) :- 
    check_jump_over_enemy(Player, OldLetter-OldNumber-NewLetter-NewNumber, Board, Board2), 
    has_enemies(Board2, Player, NewLetter-NewNumber), !,
    display_game(Board2, Player), 
    players_turn(Board2, TypeOfPlayer, Player, NewBoard).

/*If the player is human and the pawn is a knight that has jumped over an enemy and has friends to jump over, the function asks if
the player wants to jump and to which cell.*/
display('P', Player, OldLetter-OldNumber-NewLetter-NewNumber, Board, NewBoard) :- 
    check_if_knight(Board, NewLetter-NewNumber, Player),
    check_jump_over_enemy(Player, OldLetter-OldNumber-NewLetter-NewNumber, Board, _Board2),
    has_friends(Board, Player, NewLetter-NewNumber, 0), !,
    readInputJumpStay(Input), !, analyze_input(Board, Player, Input, NewBoard, OldLetter-OldNumber-NewLetter-NewNumber).

/*If the player has jumped over an enemy and doesn't have other enemies/friends to jump over, the game continues in the game loop.*/
display(_, Player, OldLetter-OldNumber-NewLetter-NewNumber, Board, NewBoard) :- 
    check_jump_over_enemy(Player, OldLetter-OldNumber-NewLetter-NewNumber, Board, NewBoard), !.

/*If the pawn is a knight that has jumped over a friend and still has enemies to jump over, it does so.*/
display(TypeOfPlayer, Player, OldLetter-OldNumber-NewLetter-NewNumber, Board, NewBoard) :- 
    check_if_knight(Board, NewLetter-NewNumber, Player),
    check_jump(OldLetter-OldNumber-NewLetter-NewNumber),
    has_enemies(Board, Player, NewLetter-NewNumber), !,
    display_game(Board, Player), 
    players_turn(Board, TypeOfPlayer, Player, NewBoard).

/*If the player is human and the pawn has jumped over a friend and still has other friends to jump over, the function asks the player if
he wants to jump and asks them for the cell to jump to.*/
display('P', Player, OldLetter-OldNumber-NewLetter-NewNumber, Board, NewBoard) :-
    check_jump(OldLetter-OldNumber-NewLetter-NewNumber),
    has_friends(Board, Player, NewLetter-NewNumber, 1), !,
    readInputJumpStay(Input), !, analyze_input(Board, Player, Input, NewBoard, OldLetter-OldNumber-NewLetter-NewNumber).

/*When the Player is a simple bot and it has friends to jump over, after jumping over a friend, it jumps over the friend.*/
display('C1', Player, OldLetter-OldNumber-NewLetter-NewNumber, Board, NewBoard) :-
    check_jump(OldLetter-OldNumber-NewLetter-NewNumber),
    random(1, 2, Int),
    has_friends(Board, Player, NewLetter-NewNumber, Int), !,
    display_game(Board, Player), 
    check_pawns(Board, Player, [NewLetter-NewNumber], _, [], _, [], Friends, []),
    delete(Friends, NewLetter-NewNumber-OldLetter-OldNumber, List),
    nth0(0, List, Move),
    move(Move, 'C1', Player, Board, NewBoard).

/*In case none of the options above happen, the returned board will be the same as the one received as argument.*/
display(_, _, _, Board, NewBoard):- NewBoard=Board.

/*Function that receives a board, a cell and a player and checks if the symbol that is on the cell is one of the player's knights.*/
check_if_knight(Board, NewLetter-NewNumber, Player) :- check_board(Board, Symbol, NewLetter-NewNumber), !, knight(Player, Symbol).

/*check_jump(OldCell, NewCell)
Function that checks whether there is a jump between the cells received as arguments.*/
check_jump(_-OldN-_-NewN) :- NewN is OldN+2.
check_jump(_-OldN-_-NewN) :- NewN is OldN-2.
check_jump(OldL-_-NewL-_) :- char_code(OldL, N1), char_code(NewL, N2), N2 is N1+2.
check_jump(OldL-_-NewL-_) :- char_code(OldL, N1), char_code(NewL, N2), N2 is N1-2.

/*Function that checks if pawn has jumped over enemy by checking if it jumped more than one cell and if the cell it jumped over was an enemy.
It returns a Board with the enemy that was jumped over deleted.*/
/*Diagonally up-left*/
check_jump_over_enemy(Player, Letter-Number-NewLetter-NewNumber, Board, NewBoard) :-
    Num is Number-NewNumber, char_code(Letter, AsciiLetter), char_code(NewLetter, AsciiNewLetter),
    NumLetter is AsciiLetter-AsciiNewLetter, Num>1, NumLetter>1, N is NewNumber+1, NumL is AsciiNewLetter+1,
    char_code(L, NumL), check_board(Board, Symbol, L-N), enemy(Player, Opponent),
    players_pieces(Opponent, Symbol), change_board(Board, 0, L-N, NewBoard), !.

/*Diagonally down-right*/
check_jump_over_enemy(Player, Letter-Number-NewLetter-NewNumber, Board, NewBoard) :-
    Num is Number-NewNumber, char_code(Letter, AsciiLetter), char_code(NewLetter, AsciiNewLetter),
    NumLetter is AsciiLetter-AsciiNewLetter, Num<0-1, NumLetter<0-1, N is NewNumber-1, NumL is AsciiNewLetter-1,
    char_code(L, NumL), check_board(Board, Symbol, L-N), enemy(Player, Opponent),
    players_pieces(Opponent, Symbol), change_board(Board, 0, L-N, NewBoard), !.

/*Diagonally up-right*/
check_jump_over_enemy(Player, Letter-Number-NewLetter-NewNumber, Board, NewBoard) :-
    Num is Number-NewNumber, char_code(Letter, AsciiLetter), char_code(NewLetter, AsciiNewLetter),
    NumLetter is AsciiLetter-AsciiNewLetter, Num>1, NumLetter<0-1, N is NewNumber+1, NumL is AsciiNewLetter-1,
    char_code(L, NumL), check_board(Board, Symbol, L-N), enemy(Player, Opponent),
    players_pieces(Opponent, Symbol), change_board(Board, 0, L-N, NewBoard), !.

/*Diagonally down-left*/
check_jump_over_enemy(Player, Letter-Number-NewLetter-NewNumber, Board, NewBoard) :-
    Num is Number-NewNumber, char_code(Letter, AsciiLetter), char_code(NewLetter, AsciiNewLetter),
    NumLetter is AsciiLetter-AsciiNewLetter, Num<0-1, NumLetter>1, N is NewNumber-1, NumL is AsciiNewLetter+1,
    char_code(L, NumL), check_board(Board, Symbol, L-N), enemy(Player, Opponent),
    players_pieces(Opponent, Symbol), change_board(Board, 0, L-N, NewBoard),!.

/*Up*/
check_jump_over_enemy(Player, Letter-Number-_-NewNumber, Board, NewBoard) :-
    Num is Number-NewNumber,
    Num>1, N is NewNumber+1, 
    check_board(Board, Symbol, Letter-N), enemy(Player, Opponent),
    players_pieces(Opponent, Symbol), change_board(Board, 0, Letter-N, NewBoard),!.

/*Down*/
check_jump_over_enemy(Player, Letter-Number-_-NewNumber, Board, NewBoard) :-
    Num is Number-NewNumber,
    Num<0-1, N is NewNumber-1, 
    check_board(Board, Symbol, Letter-N), enemy(Player, Opponent),
    players_pieces(Opponent, Symbol), change_board(Board, 0, Letter-N, NewBoard),!.

/*Right*/
check_jump_over_enemy(Player, Letter-Number-NewLetter-_, Board, NewBoard) :-
    char_code(Letter, AsciiLetter), char_code(NewLetter, AsciiNewLetter),
    NumLetter is AsciiLetter-AsciiNewLetter, NumLetter<0-1, NumL is AsciiNewLetter-1,
    char_code(L, NumL), check_board(Board, Symbol, L-Number), enemy(Player, Opponent),
    players_pieces(Opponent, Symbol), change_board(Board, 0, L-Number, NewBoard),!.

/*Left*/
check_jump_over_enemy(Player, Letter-Number-NewLetter-_, Board, NewBoard) :-
    char_code(Letter, AsciiLetter), char_code(NewLetter, AsciiNewLetter),
    NumLetter is AsciiLetter-AsciiNewLetter, NumLetter>1, NumL is AsciiNewLetter+1,
    char_code(L, NumL), check_board(Board, Symbol, L-Number), enemy(Player, Opponent),
    players_pieces(Opponent, Symbol), change_board(Board, 0, L-Number, NewBoard),!.
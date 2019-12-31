/*Function to generate an integer between 0 and size of validMoves.*/
choose_move(Difficulty, Player, Move, Board) :- Difficulty = 1,
    valid_moves(Board, Player, ListOfMoves), length(ListOfMoves, Len), 
    random(0, Len, Int), 
    nth0(Int, ListOfMoves, Move), !.

/*Function that chooses move for a intelligent bot, it receives the Player and the Board and returns the resulting Board.*/
choose_move(Difficulty, Player, Board, NewBoard) :- Difficulty = 2,
    valid_moves(Board, Player, ListOfMoves),
    generate_boards(Board, Player, ListOfMoves, ListOfBoards),
    check_value(ListOfBoards, Board2, _AuxBoard, _BestValue, -100, Counter, 0, 0),
    nth0(Counter, ListOfMoves, Move),
    check_enemies_c2(Player, Move, Board, Board2, NewBoard).

/* check_enemies_c2(Player, Move, InitialBoard, FinalBoard, Board)
Function that originates the Board without enemies deleted when jumped and calls function to check if the moving pawn has jumped over enemies,
in order to check if there are other enemies to jump over, resulting in the current player playing again.*/
check_enemies_c2(Player, OldLetter-OldNumber-NewLetter-NewNumber, InitialBoard, SBoard, NewBoard) :-
    check_board(InitialBoard, Symbol, OldLetter-OldNumber),
    change_board(InitialBoard, 0, OldLetter-OldNumber, Board1),
    change_board(Board1, Symbol, NewLetter-NewNumber, Board2), !,
    check_if_same_turn(Player, OldLetter-OldNumber-NewLetter-NewNumber, Board2, SBoard, NewBoard).

/* check_if_same_turn(Player, Move, BoardWithEnemies, FinalBoard, NewBoard) 
(NewBoard is the same as FinalBoard but originated after checking if there were enemies deleted from the board)
Function that checks if the moving pawn has jumped over enemies in order to check if there are other enemies to jump over, 
resulting in the current player playing again. If there was no jump over enemy, the FinalBoard is returned.*/
check_if_same_turn(Player, OldLetter-OldNumber-NewLetter-NewNumber, Board2, SBoard, NewBoard) :- 
    check_jump_over_enemy(Player, OldLetter-OldNumber-NewLetter-NewNumber, Board2, _), !,
    c_enemies(SBoard, Player, NewLetter-NewNumber-OldLetter-OldNumber, NewBoard, 0).
check_if_same_turn(Player, OldLetter-OldNumber-NewLetter-NewNumber, _, SBoard, NewBoard) :- 
    check_if_knight_jumped(SBoard, OldLetter-OldNumber-NewLetter-NewNumber, Player), !,
    c_enemies(SBoard, Player, NewLetter-NewNumber-OldLetter-OldNumber, NewBoard, 1).
check_if_same_turn(Player, OldLetter-OldNumber-NewLetter-NewNumber, _, SBoard, NewBoard) :-
    check_jump(OldLetter-OldNumber-NewLetter-NewNumber), !,
    c_friends(SBoard, Player, NewLetter-NewNumber-OldLetter-OldNumber, NewBoard, 1).
check_if_same_turn(_, _, _, SBoard, NewBoard) :- NewBoard=SBoard.

/*c_enemies(BoardAfterRound1, Player, Cell, NewBoard)
Function that calls the current player's turn again, after checking if it's, in fact, it's turn. It returns the NewBoard generated from
that turn and receives the current board (BoardAfterRound1), the Player and the Cell where the pawn that just moved is.*/
c_enemies(SBoard, Player, NewLetter-NewNumber-_-_, NewBoard, _):-
    has_enemies(SBoard, Player, NewLetter-NewNumber), !,
    display_game(SBoard, Player), 
    players_turn(SBoard, 'C2', Player, NewBoard).
c_enemies(SBoard, Player, NewLetter-NewNumber-OldLetter-OldNumber, NewBoard, OverEnemies) :- 
    check_if_knight(SBoard, NewLetter-NewNumber, Player),!,
    c_friends(SBoard, Player, NewLetter-NewNumber-OldLetter-OldNumber, NewBoard, OverEnemies).
c_enemies(SBoard, _, _, NewBoard, _) :- 
    NewBoard=SBoard.

/*Function that checks if the pawn located in cell NewLetter-NewNumber is a knight who jumped.*/
check_if_knight_jumped(SBoard, OldLetter-OldNumber-NewLetter-NewNumber, Player) :- 
    check_if_knight(SBoard, NewLetter-NewNumber, Player), !, 
    check_jump(OldLetter-OldNumber-NewLetter-NewNumber).

/*c_enemies(BoardAfterRound1, Player, Cell, NewBoard, Len)
Function that calls the current player's turn again, after checking if it's, in fact, it's turn, in the case the most recently used pawn has
friends to jump over. It returns the NewBoard generated from that turn and receives the current board (BoardAfterRound1), 
the Player and the Cell where the pawn that just moved is. Len is either 0 or 1. If Len=0, the pawn is a knight who jumped over an enemy
and the program checks if there are any movements to jump over a friend. If Len=1, the pawn jumped over a friend, so the program checks 
if there are any friends other than that one, to jump over.*/
c_friends(SBoard, Player, NewLetter-NewNumber-OldLetter-OldNumber, NewBoard, Len):-
    has_friends(SBoard, Player, NewLetter-NewNumber, Len), !,
    display_game(SBoard, Player), 
    check_pawns(SBoard, Player, [NewLetter-NewNumber], _, [], _, [], Friends, []),
    generate_boards_friends(SBoard, Player, Friends, ListOfBoards),
    check_value(ListOfBoards, Board2, _AuxBoard, _BestValue, -100, Counter, 0, 0),
    del(Friends, Len, NewLetter-NewNumber-OldLetter-OldNumber, NewFriends),
    nth0(Counter, NewFriends, Move),
    check_enemies_c2(Player, Move, SBoard, Board2, NewBoard).
c_friends(SBoard, _, _, NewBoard, _):- 
    NewBoard=SBoard.

/*Function to delete from list of jumps over friends the movement NewLetter-NewNumber-OldLetter-OldNumber, so that if a pawn has jumped over
a friend to get to the new cell, it can't move back to the original cell.*/
del(Friends, Len, NewLetter-NewNumber-OldLetter-OldNumber, NewFriends) :-
    Len=1, !, delete(Friends, NewLetter-NewNumber-OldLetter-OldNumber, NewFriends).
del(Friends, _, _, NewFriends) :- NewFriends = Friends.

/*Function that evaluates a board. It receives the player and the board to evaluate and returns a value.*/
value(Board, Player, Value) :- get_pawns(Board, Player, ListOfPawns), 
    distance_pawns(Player, _BestPawn, _Aux2, 12, BestDistance, ListOfPawns),
    distance_pawns2(Player, ListOfPawns, AverageDistance, 0, 0),
    check_enemy_adjacent_recursive(Player, Board, ListOfPawns, V),
    Value is (12-AverageDistance)*8.3*0.5 + (12-BestDistance)*8.3*0.5+V.

value_friends(Board, Player, Value) :- get_pawns(Board, Player, ListOfPawns), 
    distance_pawns(Player, _BestPawn, _Aux2, 12, BestDistance, ListOfPawns),
    distance_pawns2(Player, ListOfPawns, AverageDistance, 0, 0),
    check_enemy_adjacent_recursive(Player, Board, ListOfPawns, V),
    Value is (12-AverageDistance)*8.3*0.5 + (12-BestDistance)*8.3*0.5-V.

/*Function that checks if there are enemies in adjacent cells to the Player's pawns, in order to aid in the evaluation function.*/
check_enemy_adjacent_recursive(_, _, [], Value) :- Value is 0.
check_enemy_adjacent_recursive(Player, Board, [H|T], Value) :- 
    adjacent_cells(H, AdjList),
    check_enemy_adjacent(Player, Board, H, AdjList, V),
    V=0, !,check_enemy_adjacent_recursive(Player, Board, T, Value).
check_enemy_adjacent_recursive(_, _, _, Value) :- Value is -50.

/*Function that checks if there are enemies in adjacent cells to one pawn, in order to aid in the evaluation function.*/
check_enemy_adjacent(_, _, _, [], Value) :- Value is 0, !.
check_enemy_adjacent(Player, Board, Letter-Number, [L-N|_], Value) :- 
    check_board(Board, Symbol, L-N),
    analyze_symbol(Board, Player, Symbol, Letter-Number, L-N, Value), !.
check_enemy_adjacent(Player, Board, Letter-Number, [_|T], Value) :- 
    check_enemy_adjacent(Player, Board, Letter-Number, T, Value), !.

/*Function that checks if there is an enemy on cell:L-N, that can move over the Pawn in the cell: Letter-Number and returns a negative value
to subtract in the evaluation function if so.*/
analyze_symbol(Board, Player, Symbol, Letter-Number, L-N, Value) :- enemy(Player, Opponent),
    players_pieces(Opponent, Symbol),
    get_opposed_cell_letter(OpL, Letter, L),
    get_opposed_cell_number(OpN, Number, N),
    check_board(Board, S, OpL-OpN), S=0,!, Value is -50. 

/*Function to get the opposing letter of a cell, returning it in OpLetter.*/
get_opposed_cell_letter(OpLetter, Letter, L) :- Letter=L, !, OpLetter=L.
get_opposed_cell_letter(OpLetter, Letter, L) :- 
    char_code(Letter, Num1), char_code(L, Num2), Num1 > Num2, !, 
    N is Num1+1, char_code(OpLetter, N).
get_opposed_cell_letter(OpLetter, Letter, _) :- 
    char_code(Letter, Num1), N is Num1-1, char_code(OpLetter, N).

/*Function to get the opposing letter of a cell, returning it in OpNumber.*/
get_opposed_cell_number(OpNumber, Number, N) :- Number=N, !, OpNumber = N.
get_opposed_cell_number(OpNumber, Number, N) :- Number>N, !, OpNumber is Number+1.
get_opposed_cell_number(OpNumber, Number, _) :- OpNumber is Number-1.

/*Function that calculates the Pawn which is positioned in the cell closest to the enemy's castle.*/
distance_pawns(_, BestPawn, BestPawnBefore, BestDistanceBefore, BestDistance, []) :- BestDistance=BestDistanceBefore, BestPawn=BestPawnBefore.
distance_pawns(Player, BestPawn, BestPawnBefore, BestDistanceBefore, BestDistance, [CellLetter-CellNumber|T]) :- 
    enemy(Player, Opponent),
    castle(Opponent, CastleLetter-CastleNumber), 
    letters_to_numbers(CastleLetter, CNumber),
    letters_to_numbers(CellLetter, CellN),
    Distance is abs(CNumber-CellN) + abs(CastleNumber-CellNumber),
    save_best_distance(BestDistanceBefore, NewBestDistance, Distance, NewBestPawn,BestPawnBefore, CellLetter-CellNumber),
    distance_pawns(Player, BestPawn, NewBestPawn, NewBestDistance, BestDistance, T).

/*Function that calculates the average distance of the Player's pawns to the enemy's castle.*/
distance_pawns2(_, [], AverageDistance, Aux, Counter) :- AverageDistance is Aux/Counter.
distance_pawns2(Player, [CellLetter-CellNumber|T], AverageDistance, Aux, Counter) :- 
    enemy(Player, Opponent),
    castle(Opponent, CastleLetter-CastleNumber), 
    letters_to_numbers(CastleLetter, CNumber),
    letters_to_numbers(CellLetter, CellN),
    Distance is abs(CNumber-CellN) + abs(CastleNumber-CellNumber),
    Aux2 is Aux+Distance, C is Counter+1,
    distance_pawns2(Player, T, AverageDistance, Aux2, C).

/*Function that compares the distances in BestDistanceBefore and CurrentDistance and saves it in NewBestDistance. It also saves
the corresponding pawn.*/
save_best_distance(BestDistanceBefore, NewBestDistance, CurrentDistance, NewBestPawn, _, Pawn) :-
    BestDistanceBefore > CurrentDistance, !, NewBestDistance = CurrentDistance, NewBestPawn = Pawn.
save_best_distance(BestDistanceBefore,NewBestDistance,_,NewBestPawn, BestPawnBefore,_) :- 
    NewBestDistance = BestDistanceBefore, 
    NewBestPawn=BestPawnBefore.

/*Function to turn letters to numbers.*/
letters_to_numbers(Letter, Number) :- char_code('A', NumberA), char_code(Letter, NumberLetter), Number is NumberLetter-NumberA.

/*Function that generates boards and the values associated with them.*/
generate_boards(_, _, [], []).
generate_boards(Board, Player, [H|T], [H1|T1]):- 
    move(H, 'C2', Player, Board, NewBoard),
    value(NewBoard, Player, Value), !,
    H1 = NewBoard-Value,
    generate_boards(Board, Player, T, T1).

generate_boards_friends(_, _, [], []).
generate_boards_friends(Board, Player, [H|T], [H1|T1]):- 
    move(H, 'C2', Player, Board, NewBoard),
    value_friends(NewBoard, Player, Value), !,
    H1 = NewBoard-Value, 
    generate_boards_friends(Board, Player, T, T1).

/* check_value(ListOfBoards, BestBoard, AuxBoard, BestValue, AuxValue, Counter, AuxCounter, AuxCounter2)
Function that selects the best BestBoard, which has the highest value (BestValue). It needs a Counter to know which move originated the board
and a few auxiliary variables.*/
check_value([], BestBoard, AuxBoard, BestValue, AuxValue, Counter, _, AuxCounter2):- BestBoard=AuxBoard, BestValue=AuxValue, Counter=AuxCounter2.
check_value([Board-Value|T], BestBoard, _, BestValue, AuxValue, Counter, AuxCounter, _) :- AuxValue < Value, !, 
    AuxSaveBoard = Board, 
    AuxSaveValue = Value,
    A=AuxCounter,
    N is AuxCounter+1,
    check_value(T, BestBoard, AuxSaveBoard, BestValue, AuxSaveValue, Counter, N, A).
check_value([_|T], BestBoard, AuxSaveBoard, BestValue, AuxSaveValue, Counter, AuxCounter, AuxCounter2) :- 
    N is AuxCounter+1,
    check_value(T, BestBoard, AuxSaveBoard, BestValue, AuxSaveValue, Counter, N, AuxCounter2).
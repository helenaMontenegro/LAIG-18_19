/*Function that links the player to their pieces.*/
players_pieces('.', 1).
players_pieces('.', 2).
players_pieces('*', 3).
players_pieces('*', 4).

knight('.', 1).
knight('*', 4).

enemy('.', '*').
enemy('*', '.').

castle('.','D'-1).
castle('*','D'-13).

can_move(0,'.').
can_move(0,'*').
can_move(5,'*').
can_move(6,'.').
can_move_enemy(Symbol, Player) :- can_move(Symbol, Player).
can_move_enemy(6,'*').
can_move_enemy(5,'.').

/*Function that returns a List with the adjacent cells of the cell received as argument.
When Number=1, there's no number before (variable NumB) and when Number=13, there's no number after (NumA)*/
adjacent_cells(Letter-Number, List) :- Number=1, char_code(Letter, Aux), AuxB is Aux-1, char_code(LetterB, AuxB), AuxA is Aux+1, 
                                        char_code(LetterA, AuxA), NumA is Number+1,
                                        List = [LetterB-Number, LetterB-NumA, Letter-Number, Letter-NumA, LetterA-Number, LetterA-NumA].
adjacent_cells(Letter-Number, List) :- Number=13, char_code(Letter, Aux), AuxB is Aux-1, char_code(LetterB, AuxB), AuxA is Aux+1, 
                                        char_code(LetterA, AuxA), NumB is Number-1,
                                        List = [LetterB-NumB, LetterB-Number, Letter-NumB, Letter-Number, LetterA-NumB, LetterA-Number].
adjacent_cells(Letter-Number, List) :- char_code(Letter, Aux), AuxB is Aux-1, char_code(LetterB, AuxB), AuxA is Aux+1, 
                                        char_code(LetterA, AuxA), NumB is Number-1, NumA is Number+1,
                                        List = [LetterB-NumB, LetterB-Number, LetterB-NumA, Letter-NumB, Letter-Number, Letter-NumA,
                                                LetterA-NumB, LetterA-Number, LetterA-NumA].

/*Function that returns in NewBoard the Board with the change in symbol for the cell Letter-Number. */
change_board(OldBoard, Symbol, Letter-Number, NewBoard) :- 
        Number =< 13, char_code(Letter, Num), get_char_code_A_G(NumA, NumG), 
        Num >= NumA, Num=<NumG, N is Num-NumA+1, N2 is Number-1,
        access_to_change_board(OldBoard, Symbol, N, N2, NewBoard).

/*Function that accesses the Board[NumVert][NumHori] and puts there the Symbol, return the changes in NewBoard.*/
access_to_change_board(Board, Symbol, NumHori, NumVert, NewBoard) :- access_list(NumVert, 0,  Board, List), 
                                                                        access_to_change_list(NumHori, 0, List, Symbol, _AuxList, NewList),
                                                                        access_to_change_list(NumVert, 0, Board, NewList, _AuxBoard, NewBoard).

/* access_to_change_list(Index, Counter, List, Symbol, AuxiliaryList, NewList)
Function that changes the element of the list with index=Index to the specified Symbol and returns it in NewList. AuxiliaryList is used
to save the changes in the recursivety and to copy them o New one the recursivety ends. The Counter serves to check if the Index to alter
is the one currently being saved in the AuxiliaryList.
Base Case: when the list is empty.*/
access_to_change_list(_, _, [], _, Aux, New) :- New=Aux.
access_to_change_list(Index, Aux, [_|T], Elem, AuxList, NewList) :- Aux = Index, append(AuxList, [Elem], N), Aux1 is Aux+1, 
                                                            access_to_change_list(Index, Aux1, T, Elem, N, NewList).
access_to_change_list(Index, Aux, [H|T], Elem, AuxList, NewList) :- Aux1 is Aux+1, append(AuxList, [H], N), 
                        access_to_change_list(Index, Aux1, T, Elem, N, NewList).

/*Function receives a Letter and Number corresponding to a place in the Board and returns its Symbol. */
check_board(Board, Symbol, Letter-Number) :- Number =< 13, char_code(Letter, Num), get_char_code_A_G(NumA, NumG), Num >= NumA, Num=<NumG,
                                    N is Num-NumA+1, N2 is Number-1, access_board(Board, Symbol, N, N2).

/*Function that accesses the board receives as argument. It returns the Symbol present in board[NumVert][NumHori].*/
access_board(Board, Symbol, NumHori, NumVert) :- access_list(NumVert, 0,  Board, List), access_list(NumHori, 0, List, Symbol).

/*Function to access the member with index=Index in a list [H|T]. The Aux is in order to go through the list until we find the right member. 
Base Case: when Index=Aux, return the head of the list. Otherwise call the function recursively with the list's tail. The result is saved in 
Elem. */
access_list(Index, Aux, [H|_], Elem) :- Aux = Index, Elem = H.
access_list(Index, Aux, [_|T], Elem) :- Aux < Index, T\=[], Aux1 is Aux+1, access_list(Index, Aux1, T, Elem).

/*Function to get the ASCII numbers for 'A' (NumA) and 'G'(NumG), used in the board.*/
get_char_code_A_G(NumA, NumG) :- char_code('A', NumA), char_code('G', NumG).

/*Function that gets all the player's pawns.*/
get_pawns(Board, Player, ListOfPawns) :- players_pieces(Player, Pawn1), players_pieces(Player, Pawn2), Pawn1 \= Pawn2, !,
                            search_board(Board, Pawn1, 1, List1, []), !, search_board(Board, Pawn2, 1, List2, []), !,
                            append(List1, List2, ListOfPawns).

/*Recursive function that goes through the board searching for the asked Pawn and returning a List of cells that hold that pawn.*/
search_board([], _, _, List, AuxList) :- List = AuxList.
search_board([H|T], Pawn, Number, List, AuxList) :- member(Pawn, H), char_code('A', Num), AuxNum is Num-1, 
                                                search_pawn(H, Pawn, Number, AuxNum, L, []), append(AuxList, L, Aux), N is Number+1, 
                                                search_board(T, Pawn, N, List, Aux).
search_board([_|T], Pawn, Number, List, AuxList) :- Num is Number+1, search_board(T, Pawn, Num, List, AuxList).

/*Recursive function to search the wanted Pawn in a line of the board, starting in the index Num and, returning in List the List with the Letter 
of the cells that hold the pawn.
Base Case: when the list is empty, past the letters saved in the auxiliary list, Aux, in the List to be returned.*/
search_pawn([], _, _, _, List, Aux) :- List = Aux.
search_pawn([H|T], Pawn, Number, Num, List, Aux) :- Pawn = H, char_code(L, Num), append(Aux, [L-Number], AuxList), N is Num+1, 
                                            search_pawn(T, Pawn, Number, N, List, AuxList).
search_pawn([_|T], Pawn, Number, Num, List, Aux) :- N is Num+1, search_pawn(T, Pawn, Number, N, List, Aux).


/*Function that checks to see if the cell to move is free and that adds the movement to the respective list.*/
check_symbol(_, Player, Symbol, Letter-Number, L-N, Aux1, Aux11, Aux2, Aux22, Aux3, Aux33) :- can_move(Symbol, Player),  
    append(Aux1, [Letter-Number-L-N], Aux11),
    Aux22=Aux2, Aux33=Aux3.

/*enimigos*/
/* letra igual-> number>N anda para trás*/
check_symbol(Board, Player, Symbol, Letter-Number, L-N, Aux1, Aux11, Aux2, Aux22, Aux3, Aux33) :- 
	enemy(Player, Opponent),
    players_pieces(Opponent, Symbol), 
	Letter=L, Number>N,!,N1 is Number-2, check_board(Board, S, Letter-N1), can_move_enemy(S, Player), append(Aux2, [Letter-Number-Letter-N1], Aux22),
    Aux11=Aux1, 
    Aux33=Aux3.

/* letra igual-> number>N anda para a frente*/
check_symbol(Board, Player, Symbol, Letter-Number, L-N, Aux1, Aux11, Aux2, Aux22, Aux3, Aux33) :- 
	enemy(Player, Opponent),
	players_pieces(Opponent, Symbol), 
	Letter=L, Number<N,!,N1 is Number+2, check_board(Board, S, Letter-N1), can_move_enemy(S, Player), append(Aux2, [Letter-Number-Letter-N1], Aux22),
    Aux11=Aux1, 
    Aux33=Aux3.

/*numero igual -> anda para a frente*/
check_symbol(Board, Player, Symbol, Letter-Number, L-N, Aux1, Aux11, Aux2, Aux22, Aux3, Aux33) :- 
	enemy(Player, Opponent),
	players_pieces(Opponent, Symbol),  
	Number=N, char_code(L, Num1), char_code(Letter, NumLetter), Num1>NumLetter,!, NumLetter1 is NumLetter+2, 
    char_code(NewLetter, NumLetter1), check_board(Board, S, NewLetter-Number), can_move_enemy(S, Player), append(Aux2, [Letter-Number-NewLetter-Number], Aux22),
    Aux11=Aux1, 
    Aux33=Aux3.

/*numero igual -> anda para atrás*/
check_symbol(Board, Player, Symbol, Letter-Number, L-N, Aux1, Aux11, Aux2, Aux22, Aux3, Aux33) :- 
	enemy(Player, Opponent),
	players_pieces(Opponent, Symbol), 
	Number=N,char_code(L, Num1),char_code(Letter, NumLetter), Num1<NumLetter,!, NumLetter1 is NumLetter-2, 
    char_code(NewLetter, NumLetter1), check_board(Board, S, NewLetter-Number), can_move_enemy(S, Player), 
    append(Aux2, [Letter-Number-NewLetter-Number], Aux22),
    Aux11=Aux1, 
    Aux33=Aux3.

/*letra maior e numero menor*/
check_symbol(Board, Player, Symbol, Letter-Number, L-N, Aux1, Aux11, Aux2, Aux22, Aux3, Aux33) :- 
	enemy(Player, Opponent),
	players_pieces(Opponent, Symbol), 
    char_code(L, Num1), char_code(Letter, NumLetter), Num1>NumLetter, NumLetter1 is NumLetter+2, 
    char_code(NewLetter, NumLetter1), Number > N, Num is Number-2, check_board(Board, S, NewLetter-Num), can_move_enemy(S, Player), 
    append(Aux2, [Letter-Number-NewLetter-Num], Aux22),
    Aux11=Aux1, 
    Aux33=Aux3.

/*letra maior e numero maior*/
check_symbol(Board, Player, Symbol, Letter-Number, L-N, Aux1, Aux11, Aux2, Aux22, Aux3, Aux33) :- 
	enemy(Player, Opponent),
	players_pieces(Opponent, Symbol), 
    char_code(L, Num1), char_code(Letter, NumLetter), Num1>NumLetter, NumLetter1 is NumLetter+2, 
    char_code(NewLetter, NumLetter1), Number < N, Num is Number+2, check_board(Board, S, NewLetter-Num), can_move_enemy(S, Player), 
    append(Aux2, [Letter-Number-NewLetter-Num], Aux22),
    Aux11=Aux1, 
    Aux33=Aux3.

/*letra menor e numero menor*/
check_symbol(Board, Player, Symbol, Letter-Number, L-N, Aux1, Aux11, Aux2, Aux22, Aux3, Aux33) :- 
	enemy(Player, Opponent),
	players_pieces(Opponent, Symbol), 
    char_code(L, Num1), char_code(Letter, NumLetter), Num1<NumLetter, NumLetter1 is NumLetter-2, 
    char_code(NewLetter, NumLetter1), Number > N, Num is Number-2, check_board(Board, S, NewLetter-Num), can_move_enemy(S, Player), 
    append(Aux2, [Letter-Number-NewLetter-Num], Aux22),
    Aux11=Aux1, 
    Aux33=Aux3.

/*letra menor e numero maior*/
check_symbol(Board, Player, Symbol, Letter-Number, L-N, Aux1, Aux11, Aux2, Aux22, Aux3, Aux33) :- 
	enemy(Player, Opponent),
	players_pieces(Opponent, Symbol), 
    char_code(L, Num1), char_code(Letter, NumLetter), Num1<NumLetter, NumLetter1 is NumLetter-2, 
    char_code(NewLetter, NumLetter1), Number < N, Num is Number+2, check_board(Board, S, NewLetter-Num), can_move_enemy(S, Player), 
    append(Aux2, [Letter-Number-NewLetter-Num], Aux22),
    Aux11=Aux1, 
    Aux33=Aux3.

/*amigos*/
/* letra igual-> number>N anda para trás*/
check_symbol(Board, Player, Symbol, Letter-Number, L-N, Aux1, Aux11, Aux2, Aux22, Aux3, Aux33) :- 
	players_pieces(Player, Symbol), 
	Letter=L, Number>N,!,N1 is Number-2, check_board(Board, S, Letter-N1), can_move(S, Player), 
    append(Aux3, [Letter-Number-Letter-N1], Aux33),
    Aux11=Aux1, 
    Aux22=Aux2.
/* letra igual-> number>N anda para a frente*/
check_symbol(Board, Player, Symbol, Letter-Number, L-N, Aux1, Aux11, Aux2, Aux22, Aux3, Aux33) :- 
	players_pieces(Player, Symbol), 
	Letter=L, Number<N, N1 is Number+2, check_board(Board, S, Letter-N1), can_move(S, Player),!,
    append(Aux3, [Letter-Number-Letter-N1], Aux33),
    Aux11=Aux1, 
    Aux22=Aux2.

/*numero igual -> anda para a frente*/
check_symbol(Board, Player, Symbol, Letter-Number, L-N, Aux1, Aux11, Aux2, Aux22, Aux3, Aux33) :- 
	players_pieces(Player, Symbol),  
	Number=N, char_code(L, Num1), char_code(Letter, NumLetter), Num1>NumLetter, NumLetter1 is NumLetter+2, 
    char_code(NewLetter, NumLetter1), check_board(Board, S, NewLetter-Number), can_move(S, Player), !, append(Aux3, [Letter-Number-NewLetter-Number], Aux33),
    Aux11=Aux1, 
    Aux22=Aux2.

/*numero igual -> anda para atrás*/
check_symbol(Board, Player, Symbol, Letter-Number, L-N, Aux1, Aux11, Aux2, Aux22, Aux3, Aux33) :- 
	players_pieces(Player, Symbol), 
	Number=N,char_code(L, Num1),char_code(Letter, NumLetter), Num1<NumLetter, NumLetter1 is NumLetter-2, 
    char_code(NewLetter, NumLetter1), check_board(Board, S, NewLetter-Number), can_move(S, Player), !, 
    append(Aux3, [Letter-Number-NewLetter-Number], Aux33),
    Aux11=Aux1, 
    Aux22=Aux2.

/*letra maior e numero menor*/
check_symbol(Board, Player, Symbol, Letter-Number, L-N, Aux1, Aux11, Aux2, Aux22, Aux3, Aux33) :- 
	players_pieces(Player, Symbol), 
    char_code(L, Num1), char_code(Letter, NumLetter), Num1>NumLetter, NumLetter1 is NumLetter+2, 
    char_code(NewLetter, NumLetter1), Number > N, Num is Number-2, check_board(Board, S, NewLetter-Num), can_move(S, Player), 
    append(Aux3, [Letter-Number-NewLetter-Num], Aux33),
    Aux11=Aux1, 
    Aux22=Aux2.

/*letra maior e numero maior*/
check_symbol(Board, Player, Symbol, Letter-Number, L-N, Aux1, Aux11, Aux2, Aux22, Aux3, Aux33) :- 
	players_pieces(Player, Symbol), 
    char_code(L, Num1), char_code(Letter, NumLetter), Num1>NumLetter, NumLetter1 is NumLetter+2, 
    char_code(NewLetter, NumLetter1), Number < N, Num is Number+2, check_board(Board, S, NewLetter-Num), can_move(S, Player), 
    append(Aux3, [Letter-Number-NewLetter-Num], Aux33),
    Aux11=Aux1, 
    Aux22=Aux2.

/*letra menor e numero menor*/
check_symbol(Board, Player, Symbol, Letter-Number, L-N, Aux1, Aux11, Aux2, Aux22, Aux3, Aux33) :- 
	players_pieces(Player, Symbol), 
    char_code(L, Num1), char_code(Letter, NumLetter), Num1<NumLetter, NumLetter1 is NumLetter-2, 
    char_code(NewLetter, NumLetter1), Number > N, Num is Number-2, check_board(Board, S, NewLetter-Num), can_move(S, Player), 
    append(Aux3, [Letter-Number-NewLetter-Num], Aux33),
    Aux11=Aux1, 
    Aux22=Aux2.

/*letra menor e numero maior*/
check_symbol(Board, Player, Symbol, Letter-Number, L-N, Aux1, Aux11, Aux2, Aux22, Aux3, Aux33) :- 
	players_pieces(Player, Symbol), 
    char_code(L, Num1), char_code(Letter, NumLetter), Num1<NumLetter, NumLetter1 is NumLetter-2, 
    char_code(NewLetter, NumLetter1), Number < N, Num is Number+2, check_board(Board, S, NewLetter-Num), can_move(S, Player), 
    append(Aux3, [Letter-Number-NewLetter-Num], Aux33),
    Aux11=Aux1, 
    Aux22=Aux2.

/*Function to make check_symbol not fail.*/
check_symbol(_, _, _, _-_, _-_, Aux1, Aux11, Aux2, Aux22, Aux3, Aux33) :- Aux11=Aux1, Aux22=Aux2, Aux33=Aux3.
/*Function that receives the current player and asks the user for the next movement.*/
readingInput(Board, OldLetter-OldNumber, NewLetter-NewNumber, Player):-
	readOldCell(OldLetter-OldNumber),
	validateInputOldCell(Board, OldLetter-OldNumber, Player),
	readNewCell(NewLetter-NewNumber).

/*When the function before fails it needs to start again from the beginning of the function. */
readingInput(Board, OldLetter-OldNumber, NewLetter-NewNumber, Player) :- 
	write('Invalid cell. Try again.'), nl,
	readingInput(Board, OldLetter-OldNumber, NewLetter-NewNumber, Player).

/*Function that asks the user for the cell in which the pawn to move is.*/
readOldCell(OldLetter-OldNumber):-
	nl,
	write('From which cell do you want to move (\'Letter\'-Number): '),
	nl,
	read(OldLetter-OldNumber).

/*Function that asks the user for the cell in which the pawn is to be moved.*/
readNewCell(NewLetter-NewNumber):-
	nl,
	write('To which cell do you want to move (\'Letter\'-Number): '),
	nl,
	read(NewLetter-NewNumber).

/*In case there are friends to jump over, asks if the player wants to jump or stay.*/
readInputJumpStay(NewInput) :-
	nl,
	write('You still have friends to jump over, do you want to jump (1) or pass your turn (2)?'),
	nl,
	read(Input),
	validInputJumpStay(Input, NewInput).

validInputJumpStay(Input, NewInput) :-
	Input \= 1,
	Input \= 2,
	nl, write('Invalid Input.'), nl,
	readInputJumpStay(NewInput).
validInputJumpStay(Input, NewInput) :- NewInput=Input.

/*Function to check if the first cell (OldCell) asked has a pawn of the current player in it.*/
validateInputOldCell(Board, OldLetter-OldNumber, Player):-
	check_board(Board, Symbol, OldLetter-OldNumber),
	players_pieces(Player, Symbol).
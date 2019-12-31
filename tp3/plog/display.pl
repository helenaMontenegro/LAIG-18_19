/*Function that holds the board of the game.*/
initial_board([[n,n,n,n,5,n,n,n,n],
       [n,n,n,0,0,0,n,n,n],
       [n,n,0,0,0,0,0,n,n],
       [n,0,0,1,0,1,0,0,n],
       [n,0,2,2,2,2,2,0,n],
       [n,0,0,0,0,0,0,0,n],
       [n,0,0,0,0,0,0,0,n], 
       [n,0,0,0,0,0,0,0,n], 
       [n,0,3,3,3,3,3,0,n], 
       [n,0,0,4,0,4,0,0,n], 
       [n,n,0,0,0,0,0,n,n],
       [n,n,n,0,0,0,n,n,n], 
       [n,n,n,n,6,n,n,n,n]]).
    

       
/*Function that receives the Player and displays both the player and the initial board of the game.*/
display_game(Player) :- initial_board(B), display_game(B, Player).

/*Function that receives the Board and the Player to display.*/
display_game(Board, Player) :- sleep(1), nl, nl, write('Player: '), write(Player), 
    nl, nl, write('      '), write_letters('A'), nl, print_tab(Board, 0).

/*Recursive function that displays the letters (L) over the board, using their ASCII codes obtained through the char_code() function.
The Base Case is when the letter is 'H' (in the original board the letters go from 'A' to 'G').*/
write_letters(L) :- L='H'. 
write_letters(L) :- write(L), write('  '), char_code(L,Num), Num2 is Num+1, char_code(A, Num2), write_letters(A).

/*Recursive function that prints the board. It calls the functions to print the separators between lines as well as the line to be printed.
It receives the board that is still to be drawn and an Aux representing the index of the line which is being drawn at each iteration.
Base Case: when the list is empty.*/
print_tab([], _Aux) :- nl, write('              ----').
print_tab([L|T], Aux) :- nl, write(' '), print_sep(L, Aux), nl, print_num(Aux), print_line(L), N is Aux+1, 
    print_tab(T, N).

/*Function that prints the number (Num) before each line of the board.*/
print_num(Num) :- Num<9, Var is Num+1, write(Var), write(' ').
print_num(Num) :- Var is Num+1, write(Var).

/*Recursive function that draws the '-' separating the lines. It receives an Aux representinf the index of the line previously drawn and
a list with the following line. For each element different than 'n' of the following line, it prints '---', unless the index of that line 
is 11 or bigger. In that case the board gets shorter with each line so there's a need to add '------' to cover the whole line above.
Base Case: when the list is empty.*/
print_sep([], _Aux).
print_sep([C|L], Aux) :- C=n, Aux>=10, L=[X|_], X\=n, write(' -------'), print_sep(L, Aux).
print_sep([C|L], Aux) :- C=n, L=[X|_], X\=n, write('    -'), print_sep(L, Aux).
print_sep([C|L], Aux) :- C=n, write('   '), print_sep(L, Aux).
print_sep([_|L], Aux) :- write('---'), print_sep(L, Aux).

/*Recursive function that recieves a line of the board and prints it cell by cell. Base Case: when the list is empty.*/
print_line([]).
print_line([C|L]):-C=n, L=[X|_], X\=n, print_cell(C), write('|'), print_line(L).
print_line([C|L]) :- print_cell(C), print_line(L).

/*Function that prints the cell C.*/
print_cell(C):- traduz(C,V), write(V).

/*Function that translates the numbers present in the board to easy to differentiate symbols.*/
traduz(n, '   ').
traduz(0, '  |').
traduz(1, '.X|').
traduz(2, '.I|').
traduz(3, '*I|').
traduz(4, '*X|').
traduz(5, '..|').
traduz(6, '**|').
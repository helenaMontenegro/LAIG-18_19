mainMenu :-
	printMainMenu,
	read(Input), !,
	analiseInput(Input).

/*startGame player Vs player*/
analiseInput(1) :-
   initial_board(Board),
   display_game(Board, '*'), !,
   game_loop(Board, 'P', 'P').

analiseInput(2) :-
    write('Choose difficulty of Bot(1-> Beginner, 2-> Professional) :'),nl,
	read(Input), !,
	readInputBotDifficulty(Input).

analiseInput(3) :-
    write('Choose difficulty of Bot(1-> Beginner, 2-> Professional) :'),nl,
	read(Input), !,
	readInputBotDifficulty(Input,'P').

analiseInput(4) :-
    write('Choose difficulty of first Bot (1-> Beginner  2-> Professional) :'),nl,
	read(FirstDiff),
	write('Choose difficulty of second Bot (1-> Beginner  2-> Professional) :'),nl,
	read(SecondDiff), !,
	readInputBotDifficulty(FirstDiff, SecondDiff), nl.

analiseInput(5) :-
    printHowToPlayMenu,
    read(InputHowToPlay), !,
    analiseHowToPlayInput(InputHowToPlay).

analiseInput(6) :-
    write('\nExiting...\n\n').

analiseInput(_Input) :-
    write('\nError: that option does not exist.\n\n'), !,
    mainMenu.


analiseHowToPlayInput(0) :-
    mainMenu.

analiseHowToPlayInput(_Input) :-
    write('\nError: invalid input.\n\n'),
    printHowToPlayMenu.

/*startGame Beginner*/
readInputBotDifficulty(1,'P') :-
    initial_board(Board),
    display_game(Board, '*'), !,
    game_loop(Board, 'P', 'C1').

readInputBotDifficulty(2,'P') :-
    initial_board(Board),
    display_game(Board, '*'), !,
    game_loop(Board, 'P', 'C2').

readInputBotDifficulty(2) :-
    initial_board(Board),
    display_game(Board, '*'), !,
    game_loop(Board, 'C2', 'P').

readInputBotDifficulty(1) :-
    initial_board(Board),
    display_game(Board, '*'), !,
    game_loop(Board, 'C1', 'P').

readInputBotDifficulty(1, 1) :-
    initial_board(Board),
    display_game(Board, '*'), !,
    game_loop(Board, 'C1', 'C1').

readInputBotDifficulty(1, 2) :-
    initial_board(Board),
    display_game(Board, '*'), !,
    game_loop(Board, 'C1', 'C2').

readInputBotDifficulty(2, 1) :-
    initial_board(Board),
    display_game(Board, '*'), !,
    game_loop(Board, 'C2', 'C1').

readInputBotDifficulty(2, 2) :-
    initial_board(Board),
    display_game(Board, '*'), !,
    game_loop(Board, 'C2', 'C2').

readInputBotDifficulty(_Input) :-
	write('\nError: invalid input2.\n\n'),
	mainMenu.

printMainMenu :- nl,
    write('        |-----------------------------------------------------------------------------|'),nl,
    write('        |                                                                             |'),nl,
    write('        |                                                                             |'),nl,
    write('        |                                                                             |'),nl,
	write('        |                            _____   ___  ___  ___                            |'),nl,
	write('        |                           /  __ \\ / _ \\ |  \\/  |                            |'),nl,
	write('        |                           | /  \\// /_\\ \\| .  . |                            |'),nl,
	write('        |                           | |    |  _  || |\\/| |                            |'),nl,
	write('        |                           | \\__/\\| | | || |  | |                            |'),nl,
	write('        |                            \\____/\\_| |_/\\_|  |_/                            |'),nl,
	write('        |                                                                             |'),nl,
    write('        |                                                                             |'),nl,
    write('        |                           ---Helena Montenegro---                           |'),nl,
    write('        |                                                                             |'),nl,
    write('        |                             --Juliana Marques--                             |'),nl,
    write('        |                                                                             |'),nl,
    write('        |                                                                             |'),nl,
    write('        |                        1.Start Game Player vs Player                        |'),nl,
    write('        |                                                                             |'),nl,
    write('        |                           2.Start Game PC vs Player                         |'),nl,
    write('        |                                                                             |'),nl,
	write('        |                           3.Start Game Player vs Pc                         |'),nl,
	write('        |                                                                             |'),nl,
    write('        |                             4.Start Game PC vs PC                           |'),nl,
    write('        |                                                                             |'),nl,
	write('        |                               5.How to Play                                 |'),nl,
	write('        |                                                                             |'),nl,
	write('        |                                   6.Exit                                    |'),nl,
	write('        |                                                                             |'),nl,
    write('        |                                                                             |'),nl,
	write('        |                                                                             |'),nl,
	write('        |                             Choose an option...                             |'),nl,
	write('        |-----------------------------------------------------------------------------|'),nl,
	nl,nl,nl.


printHowToPlayMenu :- nl,
  write('        |-----------------------------------------------------------------------------|'),nl,
  write('        |                                                                             |'),nl,
  write('        |                                                                             |'),nl,
  write('        |                                                                             |'),nl,
  write('        |             _   _                 _          _____ _                        |'),nl,
  write('        |            | | | |               | |        | ___ | |                       |'),nl,
  write('        |            | |_| | _____      __ | |_ ____  | |_/ / | __ _ _   _            |'),nl,
  write('        |            |  _  |/ _  |  /| / / | __/ _  | |  __/| |/ _` | | | |           |'),nl,
  write('        |            | | | | (_) | V  V /  | || (_) | | |   | | (_| | |_| |           |'),nl,
  write('        |            |_| |_/|___/ |_/|_/   | __|___/  |_|   |_||__,_||__, |           |'),nl,
  write('        |                                                             __/ |           |'),nl,
  write('        |                                                             |___/           |'),nl,
  write('        |                                                                             |'),nl,
  write('        |                                                                             |'),nl,
  write('        |   1. Each player (black or white) have 5 men (represented by I) and 2       |'),nl,
  write('        |  knights (represented by X).                                                |'),nl,
  write('        |   2. The first move is made by the white player.                            |'),nl,
  write('        |   3. Each pawn can be moved to any adjacent empty cell.                     |'),nl,
  write('        |   4. Whenever you jump over an enemy pawn, that pawn is immediately removed |'),nl,
  write('        |  from the game. You also can jump over your own pawns, they are not removed.|'),nl,
  write('        |   5. If there are adjacent enemy pawns, the player must jump over it.       |'),nl,
  write('        |   6. If the player jumps during a capture to his own castle, he must remove |'),nl,
  write('        |  his pawn from there on the next turn.                                      |'),nl,
  write('        |   7. The Knight can jump over friend pawns and capture the enemy ones.      |'),nl,
  write('        |   8. It\'s forbidden to move a pawn to your own castle.                      |'),nl,
  write('        |                                                                             |'),nl,
  write('        |                                                                             |'),nl,
  write('        |   Objective: Capture all the opponent\'s pieces OR move one of your pieces   |'),nl,
  write('        |              to the opponent\'s castle.                                      |'),nl,
  write('        |                                                                             |'),nl,
  write('        |                                                                             |'),nl,
  write('        |                                                                             |'),nl,
  write('        |                                                                             |'),nl,
  write('        |                                                                             |'),nl,
  write('        |                      return to main menu (press 0)...                       |'),nl,
  write('        |-----------------------------------------------------------------------------|'),nl,
  nl,nl,nl.
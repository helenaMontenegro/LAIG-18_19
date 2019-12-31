:- consult('menu.pl').
:- consult('game_logic.pl').
:- consult('input.pl').
:- consult('display.pl').
:- consult('useful_functions.pl').
:- consult('check_symbol.pl').
:- consult('bot.pl').

:- use_module(library(random)).
:- use_module(library(lists)).
:- use_module(library(system)).

play :- mainMenu.
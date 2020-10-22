#include <stdlib.h>
#include <stdio.h>
#include <stdbool.h>
#include <time.h>
#include "sudoku_tools.h"

int main(void)
{
    srand(time(NULL));

    unsigned short difficulty = 0;
    unsigned short board[9][9];

    initBoard(board);
    solve(board, &difficulty);

    // unsigned short board_solution[9][9];

    // genRandBoard(board);
    // printBoard(board);

    // random transpositions
    randTransposeColsAndRows(board);

    clearCells(board, 1);
    printBoard(board);

    solve(board, &difficulty);
    printBoard(board);

    // printf("Dancing Links solution steps (difficulty): %d\n\n", difficulty);
}

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
    // genRandBoard(board);
    randTransposeColsAndRows(board);

    clearCells(board, 1);
    printBoard(board);

    solve(board, &difficulty);
    printBoard(board);

    printf("Difficulty: %d\n\n", difficulty);
}

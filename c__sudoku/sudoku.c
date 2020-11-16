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

    /* generate default board */
    initBoard(board);
    solve(board, &difficulty);
    
    /* shuffle for now instead of generating random board */
    // genRandBoard(board);
    randTransposeColsAndRows(board);

    /* remove random cells */
    clearCells(board, 1);
    printBoard(board);

    /* print solutions */ 
    solve(board, &difficulty);
    printBoard(board);

    printf("Difficulty: %d\n\n", difficulty);
}

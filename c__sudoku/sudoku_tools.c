#include <stdlib.h>
#include <stdio.h>
#include <stdbool.h>
#include <time.h>

bool valIn(unsigned short arr[], unsigned short val)
{
    /* checks if ushort is in ushort[] */
    for (unsigned short j = 0; j < 9; j++)
        if (arr[j] == val)
            return true;
    return false;
}

bool is_legal(unsigned short board[9][9], unsigned short row, unsigned short col, unsigned short val)
{
    /* check for val in row */
    if (valIn(board[row], val))
        return false;
    /* check for val in col */
    unsigned short column[9];
    for (unsigned short i = 0; i < 9; i++)
        column[i] = board[i][col];
    if (valIn(column, val))
        return false;

    /* check for val in sub-box of 9 */
    unsigned short row_sub = (row / 3) * 3;
    unsigned short col_sub = (col / 3) * 3;
    for (unsigned short i = row_sub; i < row_sub + 3; i++)
        for (unsigned short j = col_sub; j < col_sub + 3; j++)
            if (board[i][j] == val)
                return false;
    return true;
}

bool hasUnassigned(unsigned short board[9][9], unsigned short *row, unsigned short *col)
{
    /* returns value of first unassigned (0) cell */
    for (unsigned short i = 0; i < 9; i++)
        for (unsigned short j = 0; j < 9; j++)
            if (board[i][j] == 0)
            {
                *row = i;
                *col = j;
                return true;
            }
    return false;
}

bool check9(unsigned short arr[])
{
    /* checks is array contains 1-9 */
    for (unsigned short i = 0; i < 9; i++)
    {
        bool found = false;
        for (unsigned short j = 0; j < 9; j++)
        {
            if (arr[j] == 0)
                return false;
            if (arr[j] == i + 1)
            {
                found = true;
                break;
            }
        }
        if (found == false)
            return false;
    }
    return true;
}

void printBoard(unsigned short board[9][9])
{
    /* prints game board */
    printf("\n");
    for (unsigned short row = 0; row < 9; row++)
    {
        for (unsigned short col = 0; col < 9; col++)
        {
            if (board[row][col])
                printf("%d ", board[row][col]);
            else
                printf("  ");
            if ((col + 1) % 3 == 0 && (col + 1) % 9 != 0)
                printf("| ");
        }
        printf("\n");

        if ((row + 1) % 3 == 0 && row != 8)
            printf("- - - - - - - - - - -\n");
    }
    printf("\n");
}

bool isSolved(unsigned short board[9][9])
{
    /* checks if row is complete */
    for (unsigned short i = 0; i < 9; i++)
        if (check9(board[i]) == false)
            return false;

    /* checks if col is complete */
    for (unsigned short i = 0; i < 9; i++)
    {
        unsigned short column[9];
        for (unsigned short j = 0; j < 9; j++)
            column[j] = board[0][j];
        if (check9(column) == false)
            return false;
    }

    /* checks if 9-sub-box is complete */
    for (unsigned short i = 0; i < 3; i++)
        for (unsigned short j = 0; j < 3; j++)
        {
            unsigned short box[9];
            for (unsigned short di = 0; di < 3; di++)
                for (unsigned short dj = 0; dj < 3; dj++)
                    box[di + (3 * dj)] = board[i + 3 * di][j + 3 * dj];
            if (check9(box) == false)
                return false;
        }

    return true;
}

void clearCells(unsigned short board[9][9], unsigned short prob)
{
    /* "clears" random cells by setting them equal to 0 */
    for (unsigned short i = 0; i < 9; i++)
        for (unsigned short j = 0; j < rand() % 20; j++)
            board[i][rand() % 10] = 0;
}

void transposeColumn(unsigned short board[9][9], unsigned short col1, unsigned short col2)
{
    /* rearrrange columns within each super-column of 3 */
    unsigned short col_temp[9];
    for (unsigned short row = 0; row < 9; row++)
        col_temp[row] = board[row][col1];
    for (unsigned short row = 0; row < 9; row++)
        board[row][col1] = board[row][col2];
    for (unsigned short row = 0; row < 9; row++)
        board[row][col2] = col_temp[row];
}

void transposeRow(unsigned short board[9][9], unsigned short row1, unsigned short row2)
{
    /* rearrrange rows within each super-column of 3 */
    unsigned short row_temp[9];
    for (unsigned short col = 0; col < 9; col++)
        row_temp[col] = board[row1][col];
    for (unsigned short col = 0; col < 9; col++)
        board[row1][col] = board[row2][col];
    for (unsigned short col = 0; col < 9; col++)
        board[row2][col] = row_temp[col];
}

bool solve(unsigned short board[9][9], unsigned short *difficulty)
{
    /* solve sudoku puzzle by recursively trying and checking each cell */
    *difficulty += 1;
    if (isSolved(board) == true)
        return true;
    unsigned short row, col;
    if (!hasUnassigned(board, &row, &col))
        return true;
    for (unsigned short i = 1; i <= 9; i++)
        if (is_legal(board, row, col, i))
        {
            board[row][col] = i;
            if (solve(board, difficulty))
                return true;
            board[row][col] = 0;
        }
    return false;
}

void randTransposeColumns(unsigned short board[9][9], unsigned short n)
{
    /* random col transposition n times */
    for (unsigned short i = 0; i < rand() % n; i++)
    {
        unsigned short randFrom, randTo;
        do
        {
            randFrom = ((((rand() % 8)) / 3) * 3) + rand() % 3;
            randTo = (randFrom / 3) * 3 + rand() % 3;
        } while (randFrom == randTo);
        // printf("randFrom - %d, randTo - %d\n", randFrom, randTo);
        transposeColumn(board, randFrom, randTo);
    }
}

void randTransposeRows(unsigned short board[9][9], unsigned short n)
{
    /* random row transposition n times */
    for (unsigned short i = 0; i < rand() % n; i++)
    {
        unsigned short randFrom, randTo;
        do
        {
            randFrom = ((((rand() % 8)) / 3) * 3) + rand() % 3;
            randTo = (randFrom / 3) * 3 + rand() % 3;
        } while (randFrom == randTo);
        transposeRow(board, randFrom, randTo);
    }
}

void randTransposeColsAndRows(unsigned short board[9][9])
{
    /* random col/row transposition n^2 times */
    int n = 9999;
    for (int i = 0; i < n; i++)
    {
        randTransposeColumns(board, n);
        randTransposeRows(board, n);
    }
}

void genRandBoard(unsigned short board[9][9])
{
    /* unfinished */
    for (int i = 0; i < 9; i++)
        for (int j = 0; j < 9; j++)
        {
            unsigned short val = rand() % 10;
            bool legal = false;
            if (is_legal(board, i, j, val))
                board[i][j] = val;
        }
    printBoard(board);
}

void initBoard(unsigned short board[9][9])
{
    /* set all cells to 0 */
    for (int i = 0; i < 9; i++)
        for (int j = 0; j < 9; j++)
            board[i][j] = 0;
}

void copyBoard(unsigned short board1[9][9], unsigned short board2[9][9])
{
    /* copy board cell for cell */
    for (int i = 0; i < 9; i++)
        for (int j = 0; j < 9; j++)
            board2[i][j] = board1[i][j];
}
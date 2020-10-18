#include <stdlib.h>
#include <stdio.h>
#include <stdbool.h>
#include <time.h>

// typedef int board[81];
bool valIn(int arr[], int val)
{
    for (int j = 0; j < 9; j++)
        if (arr[j] == val)
            return true;
    return false;
}

bool is_legal(int board[9][9], int row, int col, int val)
{
    // row
    if (valIn(board[row], val))
        return false;
    // col
    int column[9];
    for (int i = 0; i < 9; i++)
        column[i] = board[i][col];
    if (valIn(column, val))
        return false;

    // sub-box of 9
    int row_sub = (row / 3) * 3;
    int col_sub = (col / 3) * 3;
    for (int i = row_sub; i < row_sub + 3; i++)
    {
        for (int j = col_sub; j < col_sub + 3; j++)
        {
            if (board[i][j] == val)
                return false;
        }
    }
    return true;
}

bool hasUnassigned(int board[9][9], int *row, int *col) {
    for (int i=0; i<9; i++) {
        for (int j=0; j<9; j++) {
            if (board[i][j] == 0) {
                *row = i;
                *col = j;
                return true;
            }
        }
    }
    return false;
}

bool check9(int arr[])
{
    for (int i = 0; i < 9; i++)
    {
        bool found = false;
        for (int j = 0; j < 9; j++)
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
        {
            return false;
        }
    }
    return true;
}

void printBoard(int board[9][9])
{
    printf("\n");
    for (int row = 0; row < 9; row++)
    {
        for (int col = 0; col < 9; col++)
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

bool isSolved(int board[9][9])
{
    // check rows
    for (int i = 0; i < 9; i++)
    {
        if (check9(board[i]) == false)
            return false;
    }

    // columns
    for (int i = 0; i < 9; i++)
    {
        int column[9];
        for (int j = 0; j < 9; j++)
            column[j] = board[0][j];
        if (check9(column) == false)
            return false;
    }

    // 9 sub-boxes
    for (int i = 0; i < 3; i++)
    {
        for (int j = 0; j < 3; j++)
        {
            int box[9];
            for (int di = 0; di < 3; di++)
            {
                for (int dj = 0; dj < 3; dj++)
                    box[di + (3 * dj)] = board[i + 3 * di][j + 3 * dj];
            }
            if (check9(box) == false)
                return false;
        }
    }

    return true;
}

void clearCells(int board[9][9], int prob)
{
    for (int i = 0; i < 9; i++)
        for (int j = 0; j < rand() % 20; j++)
                board[i][rand() % 10] = 0;
}

void transposeColumns(int board[9][9], int col1, int col2) {
    int col_temp[9];
    for (int row=0; row<9; row++) {
        col_temp[row] = board[row][col1];
    }
    for (int row=0; row<9; row++) {
        board[row][col1] = board[row][col2];
    }
    for (int row=0; row<9; row++) {
        board[row][col2] = col_temp[row];
    }
}

void transposeRows(int board[9][9], int row1, int row2) {
    int row_temp[9];
    for (int col=0; col<9; col++) {
        row_temp[col] = board[row1][col];
    }
    for (int col=0; col<9; col++) {
        board[row1][col] = board[row2][col];
    }
    for (int col=0; col<9; col++) {
        board[row2][col] = row_temp[col];
    }
}

bool solve(int board[9][9], int *difficulty)
{
    *difficulty += 1;
    if (isSolved(board) == true)
        return true;
    int row, col;
    if (!hasUnassigned(board, &row, &col)) return true;
    for (int i=1; i<=9; i++) {
        if (is_legal(board, row, col, i)) {
            board[row][col] = i;
            if (solve(board, difficulty))
                return true;
            
            board[row][col] = 0;
        }
    }
    return false;
}

int main(void)
{
    srand(time(NULL));

    int board[9][9] = {
        {
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
        },
        {
            4,
            5,
            6,
            7,
            8,
            9,
            1,
            2,
            3,
        },
        {
            7,
            8,
            9,
            1,
            2,
            3,
            4,
            5,
            6,
        },
        {
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            1,
        },
        {
            5,
            6,
            7,
            8,
            9,
            1,
            2,
            3,
            4,
        },
        {
            8,
            9,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
        },
        {
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            1,
            2,
        },
        {
            6,
            7,
            8,
            9,
            1,
            2,
            3,
            4,
            5,
        },
        {
            9,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
        },
    };

    // printBoard(board);
    // printf("solved %s\n", solve(board) ? "true" : "false");

    int difficulty = 0;

    // random transposition
    for (int i=0; i<rand()%100; i++) {
        int randFrom;
        int randTo;
        transposeColumns(board, rand()%8, rand()%8);
    }
    for (int i=0; i<rand()%100; i++) {
        transposeRows(board, rand()%8, rand()%8);
    }

    clearCells(board, 1);
    printBoard(board);
    solve(board, &difficulty);

    printBoard(board);
    printf("difficulty %d\n\n", difficulty);
}
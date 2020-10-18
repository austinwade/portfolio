#include <stdlib.h>
#include <stdio.h>
#include <stdbool.h>
#include <time.h>

// typedef int board[81];

bool check9(int arr[])
{
    for (int i = 0; i < 9; i++)
    {
        bool found = false;
        for (int j = 0; j < 9; j++)
        {
            if (arr[j] == 0)
                return false;
            if (arr[j] == i + 1) {
                found = true;
                break;
            }
        }
        if (found == false) {
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

bool isBoardValid(int board[9][9])
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
        for (int j = 0; j < 9; j++)
            if (rand() % (prob + 1) == 0)
                board[i][j] = 0;
}

int solve(int board[9][9], int **solution)
{
    if (isBoardValid(board) == true)
        return 1;

    // solve here

    return 0;
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

    printBoard(board);
    printf("solved %s\n", solve(board, (int **)board) ? "true" : "false");

    clearCells(board, 4);
    printBoard(board);
    printf("solved %s\n", solve(board, (int **)board) ? "true" : "false");
}
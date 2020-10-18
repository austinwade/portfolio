#include <stdlib.h>
#include <stdio.h>

void printBoard(int board[]) {
    for (int i=0; i < 81; i++) {
        printf("%d ", board[i]);
        if ((i+1) % 3 == 0 && (i+1) % 9 != 0) printf("| ");
        if((i+1) % 9 == 0)
            printf("\n");
        if ((i+1) % 27 == 0 && i != 80)
            printf("- - - - - - - - - - -\n");
    }
}

int main(void) {
    int board[81] = {
        1, 2, 3, 4, 5, 6, 7, 8, 9,
        4, 5, 6, 7, 8, 9, 1, 2, 3,
        7, 8, 9, 1, 2, 3, 4, 5, 6,
        2, 3, 4, 5, 6, 7, 8, 9, 1,
        5, 6, 7, 8, 9, 1, 2, 3, 4,
        8, 9, 1, 2, 3, 4, 5, 6, 7,
        3, 4, 5, 6, 7, 8, 9, 1, 2,
        6, 7, 8, 9, 1, 2, 3, 4, 5,
        9, 1, 2, 3, 4, 5, 6, 7, 8,
    };

    printBoard(board);
}
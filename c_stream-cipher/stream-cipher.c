#include <stdio.h>
#include "tools.h"

int main(int argc, char *argv[])
{
    printf("This program encrypts the word \"apple\" then decrypts it using a stream cipher.\n");

    /* initialize string as data source */
    unsigned char data[] = "apple";
    int dataLength = sizeof(data) - 1;

    /* run encryption routine and print results */
    unsigned char *result = Crypt(data, dataLength, 0x12345678);
    printByteArray(result, dataLength, 0);

    /* initialize encrypted chars as data source */
    data[0] = 0xcd;
    data[1] = 0x01;
    data[2] = 0xef;
    data[3] = 0xd7;
    data[4] = 0x30;
    dataLength = 5;

    /* run encryption routine and print results */
    result = Crypt(data, dataLength, 0x12345678);
    printByteArray(result, dataLength, 1);
}

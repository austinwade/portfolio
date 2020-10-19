#include <stdio.h>
#include "tools.h"

int main(int argc, char *argv[])
{
    printf("This program encrypts the word \"apple\" then decrypts it using a stream cipher.\n\n");

    /* initialize string as data source */
    // unsigned char data[] = "apple";
    unsigned char data[] = "\
        This is a paragraph. I love writing paragraphs. \n\
        They're cool; they're fun, and they convey a large amount of data. \n\
        However, we sometimes need them to be encrypted because they contain s3cr3ts. \n\
        For that purpose, we can use a stream cipher for a variable amount of data. \
    ";
    int dataLength = sizeof(data) - 1;

    printf("TEXT\n********\n");
    printf("%s\n", data);
    printf("********\n\n");

    printf("CIPHERTEXT\n********\n");
    /* run encryption routine and print results */
    unsigned char *result = Crypt(data, dataLength, 0x12345678);
    printByteArray(result, dataLength, 0);
    printf("********\n\n");

    /* initialize encrypted chars as data source */
    // data[0] = 0xcd;
    // data[1] = 0x01;
    // data[2] = 0xef;
    // data[3] = 0xd7;
    // data[4] = 0x30;
    // dataLength = 5;

    printf("DECRYPTED CIPHERTEXT\n********\n");
    /* run encryption routine and print results */
    result = Crypt(result, dataLength, 0x12345678);
    printByteArray(result, dataLength, 1);
    printf("********\n");
}

#include <stdio.h>
#include "tools.h"

int main(int argc, char *argv[])
{
    /* initialize string as data source */
    unsigned char data[] = "\
        This is a paragraph. I love writing paragraphs. \n\
        They're cool; they're fun, and they convey a large amount of data. \n\
        However, we sometimes need them to be encrypted because they contain s3cr3ts. \n\
        For that purpose, we can use a stream cipher for a variable amount of data. \
    ";
    int dataLength = sizeof(data) - 1;

    printByteArray(data, dataLength, 1, "TEXT");

    /* run encryption routine and print results */
    unsigned char *result = Crypt(data, dataLength, 0x12345678);
    printByteArray(result, dataLength, 0, "CIPHERTEXT");

    /* run encryption routine and print results */
    result = Crypt(result, dataLength, 0x12345678);
    printByteArray(result, dataLength, 1, "DECRYPTED CIPHERTEXT");
}

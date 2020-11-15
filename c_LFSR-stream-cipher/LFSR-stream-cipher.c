#include <stdio.h>
#include "tools.h"

int main(int argc, char *argv[])
{
    char text_buffer[100];

    /* initialize string as data source */
    unsigned char data[] = "Your variable-length s3cr3ts go here.";
    int dataLength = sizeof(data) - 1;

    /* print original text */
    printByteArray(data, dataLength, 1, "TEXT");

    /* run encryption routine and print results */
    unsigned char *result = LFSR(data, dataLength, 0x12345678);
    sprintf(text_buffer, "CIPHERTEXT");
    printByteArray(result, dataLength, 0, text_buffer);

    /* run decryption routine and print results */
    result = LFSR(result, dataLength, 0x12345678);
    sprintf(text_buffer, "DECRYPTED CIPHERTEXT");
    printByteArray(result, dataLength, 1, text_buffer);
    
    printf("\n");
}

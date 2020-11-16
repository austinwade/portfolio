#include <stdio.h>
#include <stdlib.h>
#include <string.h>

unsigned char *LFSR(unsigned char *data, int dataLength, unsigned int iv)
{
    if (!data || !dataLength || !iv)
    {
        printf("LFSR error - bad arguments\n");
        return (unsigned char *)malloc(0);
    }
    unsigned int S = iv;
    unsigned int F = 0x87654321;
    unsigned char *res = (unsigned char *)malloc(sizeof(char) * dataLength);

    /* encrypt/decrypt each datum */
    for (int i = 0; i < dataLength; i++)
    {
        /* update LSFR state */
        for (int j = 0; j < 8; j++)
        {
            if (S & 0x1)
                S = (S >> 1) ^ F;
            else
                S >>= 1;
        }
        /* XOR data with state */
        res[i] = data[i] ^ (S & 0xff);
    }
    return res;
}

int printByteArray(unsigned char *data, int dataLength, int characters, char desc[])
{
    if (!data || !dataLength || characters < 0)
    {
        printf("couldn't print byte array\n");
        return -1;
    }

    printf("\n%s: \n", desc);

    if (characters)
        for (int i = 0; i < dataLength; i++)
            printf("%c", data[i] & 0xff);
    else
        for (int i = 0; i < dataLength; i++)
            printf("\\x%02X", data[i] & 0xff);

    printf("\n");
    return 1;
}

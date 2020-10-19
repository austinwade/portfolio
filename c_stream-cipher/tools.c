#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#if defined(__APPLE__)
#define MACOS 1
#else
#define MACOS 0
#endif

#define BYTESPERSIZE 2
#define BYTESPERPOINTER 4
#define BYTESPERENTRY 20

unsigned char *Crypt(unsigned char *data, int dataLength, unsigned int initialValue)
{
    if (!data || !dataLength || !initialValue) {
        printf("Crypt error - bad arguments\n");
    }
    unsigned int S = initialValue;
    unsigned int F = 0x87654321;
    unsigned char *res = malloc(sizeof(char) * dataLength);

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
    if (!data || !dataLength || characters < 0) {
        printf("couldn't print byte array\n");
        return -1;
    }

    printf("%s\n********\n", desc);

    if (characters)
    {
        for (int i = 0; i < dataLength; i++)
        {
            printf("%c", data[i] & 0xff);
        }
    }
    else
    {
        for (int i = 0; i < dataLength; i++)
        {
            printf("\\x%02X", data[i] & 0xff);
        }
    }
    printf("\n********\n\n");
    return 1;
}

int readNBytes(FILE *file, long int index, unsigned int bytes, unsigned char **dest)
{
    if (!file || index < 0 || bytes < 0 || !dest) {
        printf("readNBytes error with arguments\n");
        return 0;
    }
    if (index >= 0)
        fseek(file, index, SEEK_SET);
    unsigned char *result = malloc(bytes);
    for (int i = 0; i < bytes; i++)
        if (fscanf(file, "%c", &result[i]) == EOF)
            break;
    *dest = result;
    return 1;
}

int printMagicBytes(FILE *file, unsigned int bytes)
{
    fseek(file, 0, SEEK_SET);
    unsigned char *fileData;
    if (readNBytes(file, 0, bytes, &fileData) < 0) {
        printf("couldn't print magic bytes");
        return 0;
    }
    printByteArray(fileData, bytes, 1, "");
    printf("\n");
    return 1;
}

int convertByteArrayToInt(unsigned char *bytes, int len, int LE)
{
    if (!bytes || len < 0 || len > 8 || LE < 0 || LE > 1)
        return -1;
    unsigned long int result = 0;
    if (LE)
    {
        for (int i = 0; i < len; i++)
            result |= (bytes[i] << i * 8);
    }
    else
    {
        for (int i = len - 1; i >= 0; i--)
        {
            result |= bytes[i];
            if (i != 0)
                result <<= 8;
        }
    }
    return result;
}

int printEntry(unsigned char *entry, int len)
{
    if (!entry || len < 0)
    {
        printf("unable to print entry due to bad arguments\n");
        return 0;
    }
    for (int i = 0; i < len; i++)
    {
        if (entry[i] == 0x00)
            break;
        printf("%c", entry[i]);
    }
    printf("\n");
    return 1;
}

int checkForTerminatingString(unsigned char *entry, int len)
{
    int foundTerminatingString = 0;
    for (int i = 0; i < len; i++)
    {
        if (entry[i] == 0xff && entry[i + 1] == 0xff && entry[i + 2] == 0xff && entry[i + 3] == 0xff)
        {
            foundTerminatingString = 1;
            break;
        }
    }
    return foundTerminatingString;
}

void printBlocks(unsigned char *arr, int len)
{
    for (int j = 0; j < len; j++)
        printf("%c", arr[j]);
    printf("\n");
}

char *createFilename(int value, char *dirName)
{
    char *fileName = malloc(100);
    strcat(fileName, dirName);
    strcat(fileName, "/");
    // strcat(fileName, "image-");
    char *intString = malloc(50);
    sprintf(intString, "%02d", value);
    strcat(fileName, intString);
    strcat(fileName, ".jpeg");
    return fileName;
}

int filesize(FILE *file)
{
    int size = 0;
    fseek(file, 0, SEEK_END);
    size = ftell(file);
    fseek(file, 0, SEEK_SET);
    return size;
}

void md5File(unsigned char *fileName)
{
    char *command = calloc(100, 1);
    if (MACOS)
    {
        strcpy(command, "md5 ");
    }
    else
    {
        strcat(command, "md5sum ");
    }
    strcat(command, (const char *)fileName);
    system(command);
}

int copyByteArr(unsigned char *from, unsigned char *to, int size, int offset)
{
    for (int i = 0; i < size; i++)
    {
        to[i + offset] = from[i];
    }
    return 1;
}

int catBlockData(FILE *file, unsigned int block_pointer, unsigned char **result)
{
    unsigned char *block_list_block;
    int block_count = 0;
    int data_len = 0;
    while (1)
    {
        /* read one block_entry */
        if (readNBytes(file, block_pointer + (BYTESPERSIZE + BYTESPERPOINTER) * block_count, BYTESPERSIZE + BYTESPERPOINTER, &block_list_block) < 0)
        {
            printf("couldn't read block_entry\n");
            return -1;
        }

        /* break on 0xffffffff */
        if (convertByteArrayToInt(block_list_block, 4, 0) == 0xffffffff)
            break;

        /* read block size */
        unsigned long int block_size = convertByteArrayToInt(block_list_block, BYTESPERSIZE, 1);

        /* read blocks address */
        unsigned char BE_blocks_addr[4] = {block_list_block[BYTESPERSIZE], block_list_block[BYTESPERSIZE + 1], block_list_block[BYTESPERSIZE + 2], block_list_block[BYTESPERSIZE + 3]};
        unsigned int blocks_addr = convertByteArrayToInt(BE_blocks_addr, BYTESPERPOINTER, 1);

        /* read block array, and increase result size */
        *result = realloc(*result, data_len + block_size);
        unsigned char *new_blocks;
        if (readNBytes(file, blocks_addr, block_size, &new_blocks) < 0)
        {
            printf("couldn't read block_entry data\n");
            return -1;
        }
        copyByteArr(new_blocks, *result, block_size, data_len);
        data_len += block_size;
        block_count++;
    }
    return data_len;
}
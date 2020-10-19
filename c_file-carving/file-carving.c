#include <stdlib.h>
#include <stdio.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <string.h>
#include "tools.h"

int main(int argc, char *argv[])
{
    /* initialize variables (for clarifying the code below) */
    unsigned char jpegMagicBytes[3] = {0xff, 0xd8, 0xff};

    /* load bin file */
    FILE *bin = fopen(argv[1], "r");
    if (!bin)
    {
        printf("No bin file\n");
        return -1;
    }

    /* create directory */
    unsigned char dirName[100];
    strcat(dirName, argv[1]);
    strcat(dirName, "_Repaired");
    mkdir(dirName, S_IRWXU);

    /* initialize variables */
    int writeMode = 0;
    int fileCreated = 0;
    int fileIndex = 0;
    FILE *files[100];
    int magicByteMatchCount = 0;
    unsigned char endingBytes[] = {0xff, 0xd9};
    int endByteCount = 0;
    unsigned char currentByte;
    unsigned char *fileName;
    int imageStartingByte = 0;

    /* scan file for images */
    while (fscanf(bin, "%c", &currentByte) != EOF)
    {
        /* if secret magic bytes have been found, begin writing image bytes */
        if (writeMode)
        {
            /* if file hasn't been created, create it */
            if (!fileCreated)
            {
                printf("Image found at %i\n", imageStartingByte);
                fileName = createFilename(imageStartingByte, dirName);
                fileCreated = 1;
                files[fileIndex] = fopen(fileName, "w");
                if (!files[fileIndex])
                {
                    printf("couldn't create image\n");
                    return -1;
                }

                // write JPEG magic bytes
                fwrite(jpegMagicBytes, 1, sizeof(jpegMagicBytes), files[fileIndex]);
            }

            /* write current byte */
            fwrite(&currentByte, 1, 1, files[fileIndex]);

            /* check for next matching byte at JPEG's end */
            if (currentByte == endingBytes[endByteCount])
                endByteCount++;
            else
                endByteCount = 0;

            /* if both bytes are found, increment fileIndex and stop writing */
            if (endByteCount == 2)
            {
                fileIndex++;
                fileCreated = 0;
                writeMode = 0;
                md5File(fileName);
                printf("%s\n\n", fileName);
            }
        }
        else
        {
            /* look for first magic bytes in JPEG */
            if (currentByte == jpegMagicBytes[magicByteMatchCount])
            {
                if (magicByteMatchCount == 0)
                    imageStartingByte = ftell(bin);
                magicByteMatchCount++;
            }
            else
                magicByteMatchCount = 0;

            /* if all magic bytes have been found, start writing file */
            if (magicByteMatchCount == sizeof(jpegMagicBytes))
                writeMode = 1;
        }
    }
}

#define BYTESPERSIZE 2
#define BYTESPERPOINTER 4
#define BYTESPERENTRY 20

unsigned char *LFSR(unsigned char *data, int dataLength, unsigned int iv);

int printByteArray(unsigned char *data, int len, int characters, char desc[]);

int printMagicBytes(FILE *file, unsigned int bytes);

int readNBytes(FILE *file, long int index, unsigned int bytes, unsigned char **dest);

int convertByteArrayToInt(unsigned char *bytes, int byteNum, int LE);

int printEntry(unsigned char *entry, int len);

int checkForTerminatingString(unsigned char *entry, int len);

void printBlocks(unsigned char *arr, int len);

char *createFilename(int value, unsigned char *dirName);

void md5File(unsigned char *fileName);

int copyByteArr(unsigned char *from, unsigned char *to, int size, int offset);

int increaseSize(unsigned char **data, int size_original, int size_new);

int catBlockData(FILE *file, unsigned int block_pointer, unsigned char **result);
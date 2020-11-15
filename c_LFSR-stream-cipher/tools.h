unsigned char *LFSR(unsigned char *data, int dataLength, unsigned int iv);

int printByteArray(unsigned char *data, int len, int characters, char desc[]);

int printMagicBytes(FILE *file, unsigned int bytes);
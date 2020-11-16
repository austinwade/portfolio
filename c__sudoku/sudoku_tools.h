bool valIn(unsigned short arr[], unsigned short val);

bool is_legal(unsigned short board[9][9], unsigned short row, unsigned short col, unsigned short val);

bool hasUnassigned(unsigned short board[9][9], unsigned short *row, unsigned short *col);

bool check9(unsigned short arr[]);

void printBoard(unsigned short board[9][9]);

bool isSolved(unsigned short board[9][9]);

void clearCells(unsigned short board[9][9], unsigned short prob);

void transposeColumn(unsigned short board[9][9], unsigned short col1, unsigned short col2);

void transposeRow(unsigned short board[9][9], unsigned short row1, unsigned short row2);

bool solve(unsigned short board[9][9], unsigned short *difficulty);

void randTransposeColumns(unsigned short board[9][9], unsigned short freq);

void randTransposeRows(unsigned short board[9][9], unsigned short freq);

void randTransposeColsAndRows(unsigned short board[9][9]);

void genRandBoard(unsigned short board[9][9]);

void initBoard(unsigned short board[9][9]);

void copyBoard(unsigned short board1[9][9], unsigned short board2[9][9]);
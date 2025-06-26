// // src/utils/sudokuUtils.js

// export const emptyBoard = () => Array(9).fill(null).map(() => Array(9).fill(null));

// // Check if placing a number (1–9) is valid at a cell
// export const isValidMove = (board, row, col, val) => {
//   for (let i = 0; i < 9; i++) {
//     if (board[row][i] === val || board[i][col] === val) return false;
//   }

//   const startRow = row - (row % 3);
//   const startCol = col - (col % 3);
//   for (let r = startRow; r < startRow + 3; r++) {
//     for (let c = startCol; c < startCol + 3; c++) {
//       if (board[r][c] === val) return false;
//     }
//   }

//   return true;
// };

// export const isBoardComplete = (board) => {
//   return board.every(row => row.every(cell => cell !== null));
// };

// sudokuUtils.js

// Generates a shuffled array of digits 1-9
const shuffle = (array) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

const isSafe = (board, row, col, num) => {
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num || board[x][col] === num) return false;
  }

  const startRow = row - row % 3;
  const startCol = col - col % 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i + startRow][j + startCol] === num) return false;
    }
  }

  return true;
};

const solveBoard = (board) => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === null) {
        const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        for (let num of numbers) {
          if (isSafe(board, row, col, num)) {
            board[row][col] = num;
            if (solveBoard(board)) return true;
            board[row][col] = null;
          }
        }
        return false;
      }
    }
  }
  return true;
};

export const generateSudokuPuzzle = (numEmpty = 40) => {
  const board = Array.from({ length: 9 }, () => Array(9).fill(null));
  solveBoard(board); // Fill the board

  // Now hide `numEmpty` cells
  const puzzle = board.map(row => [...row]);
  let attempts = 0;
  while (attempts < numEmpty) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if (puzzle[row][col] !== null) {
      puzzle[row][col] = null;
      attempts++;
    }
  }

  return { puzzle, solution: board };
};

export const isBoardComplete = (board) => {
  return board.every(row => row.every(cell => cell !== null));
};

export const isValidMove = (board, row, col, val) => {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === val || board[i][col] === val) return false;
  }

  const startRow = row - (row % 3);
  const startCol = col - (col % 3);

  for (let r = startRow; r < startRow + 3; r++) {
    for (let c = startCol; c < startCol + 3; c++) {
      if (board[r][c] === val) return false;
    }
  }

  return true;
};

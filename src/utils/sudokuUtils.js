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
  // Check row
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num) return false;
  }

  // Check column
  for (let x = 0; x < 9; x++) {
    if (board[x][col] === num) return false;
  }

  // Check 3x3 box
  const startRow = row - row % 3;
  const startCol = col - col % 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i + startRow][j + startCol] === num) return false;
    }
  }

  return true;
};

const solveSudoku = (board) => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === null) {
        const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        for (let num of numbers) {
          if (isSafe(board, row, col, num)) {
            board[row][col] = num;
            if (solveSudoku(board)) return true;
            board[row][col] = null;
          }
        }
        return false;
      }
    }
  }
  return true;
};

// Create a deep copy of the board
const copyBoard = (board) => {
  return board.map(row => [...row]);
};

// Count the number of solutions for a given puzzle
const countSolutions = (board, limit = 2) => {
  let solutions = 0;
  
  const solve = (board) => {
    if (solutions >= limit) return; // Early termination
    
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === null) {
          for (let num = 1; num <= 9; num++) {
            if (isSafe(board, row, col, num)) {
              board[row][col] = num;
              solve(board);
              board[row][col] = null;
            }
          }
          return;
        }
      }
    }
    solutions++;
  };
  
  const boardCopy = copyBoard(board);
  solve(boardCopy);
  return solutions;
};

// Generate a complete valid Sudoku board
const generateCompleteBoard = () => {
  const board = Array.from({ length: 9 }, () => Array(9).fill(null));
  
  // Fill diagonal 3x3 boxes first (they don't affect each other)
  for (let box = 0; box < 3; box++) {
    const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    let numIndex = 0;
    
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        board[box * 3 + i][box * 3 + j] = numbers[numIndex++];
      }
    }
  }
  
  // Solve the rest of the board
  solveSudoku(board);
  return board;
};

export const generateSudokuPuzzle = (difficulty = 'medium') => {
  // Set number of cells to remove based on difficulty
  let cellsToRemove;
  switch (difficulty) {
    case 'easy':
      cellsToRemove = 35;
      break;
    case 'medium':
      cellsToRemove = 45;
      break;
    case 'hard':
      cellsToRemove = 55;
      break;
    default:
      cellsToRemove = typeof difficulty === 'number' ? difficulty : 45;
  }
  
  // Generate a complete valid board
  const solution = generateCompleteBoard();
  const puzzle = copyBoard(solution);
  
  // Create list of all cell positions
  const positions = [];
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      positions.push([row, col]);
    }
  }
  
  // Shuffle positions to remove cells randomly
  shuffle(positions);
  
  let removed = 0;
  for (let [row, col] of positions) {
    if (removed >= cellsToRemove) break;
    
    // Temporarily remove the cell
    const backup = puzzle[row][col];
    puzzle[row][col] = null;
    
    // Check if puzzle still has unique solution
    const solutionCount = countSolutions(puzzle);
    
    if (solutionCount === 1) {
      // Keep the cell removed
      removed++;
    } else {
      // Restore the cell
      puzzle[row][col] = backup;
    }
  }
  
  return { puzzle, solution };
};

export const isBoardComplete = (board) => {
  return board.every(row => row.every(cell => cell !== null));
};

export const isValidMove = (board, row, col, val) => {
  // Check if the cell is already filled
  if (board[row][col] !== null) return false;
  
  // Check row for conflicts
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === val) return false;
  }

  // Check column for conflicts
  for (let i = 0; i < 9; i++) {
    if (board[i][col] === val) return false;
  }

  // Check 3x3 box for conflicts
  const startRow = row - (row % 3);
  const startCol = col - (col % 3);

  for (let r = startRow; r < startRow + 3; r++) {
    for (let c = startCol; c < startCol + 3; c++) {
      if (board[r][c] === val) return false;
    }
  }

  return true;
};

// Helper function to validate if a complete board is valid
export const isValidBoard = (board) => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const val = board[row][col];
      if (val !== null) {
        // Temporarily remove the value to check if it's valid in this position
        board[row][col] = null;
        const isValid = isValidMove(board, row, col, val);
        board[row][col] = val; // Restore the value
        
        if (!isValid) return false;
      }
    }
  }
  return true;
};
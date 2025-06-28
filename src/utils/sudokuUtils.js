// sudokuUtils.js

// Generates a shuffled array of digits 1-9
const shuffle = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Check if placing num at board[row][col] is valid
const isSafe = (board, row, col, num) => {
  // Check row - no duplicates in the same row
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num) return false;
  }

  // Check column - no duplicates in the same column
  for (let x = 0; x < 9; x++) {
    if (board[x][col] === num) return false;
  }

  // Check 3x3 box - no duplicates in the same 3x3 block
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[startRow + i][startCol + j] === num) return false;
    }
  }

  return true;
};

// Solve sudoku using backtracking with randomization
const solveSudoku = (board) => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        // Try numbers 1-9 in random order
        const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        for (let num of numbers) {
          if (isSafe(board, row, col, num)) {
            board[row][col] = num;
            if (solveSudoku(board)) return true;
            board[row][col] = 0;
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

// Generate a complete valid Sudoku board
const generateCompleteBoard = () => {
  // Start with empty board (using 0 for empty cells during generation)
  const board = Array.from({ length: 9 }, () => Array(9).fill(0));
  
  // Fill the board using backtracking with randomization
  solveSudoku(board);
  
  return board;
};

// Count solutions for a puzzle (limit to 2 for efficiency)
const countSolutions = (board) => {
  let solutionCount = 0;
  const boardCopy = copyBoard(board);
  
  const solve = (board) => {
    if (solutionCount > 1) return; // Early exit if more than 1 solution
    
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isSafe(board, row, col, num)) {
              board[row][col] = num;
              solve(board);
              board[row][col] = 0;
              if (solutionCount > 1) return;
            }
          }
          return;
        }
      }
    }
    solutionCount++;
  };
  
  solve(boardCopy);
  return solutionCount;
};

// Generate a Sudoku puzzle by removing cells from a complete board
export const generateSudokuPuzzle = (difficulty = 'medium') => {
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
      cellsToRemove = 45;
  }
  
  // Generate a complete valid board
  const solution = generateCompleteBoard();
  const puzzle = copyBoard(solution);
  
  // Convert 0s to nulls for the puzzle format
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      puzzle[i][j] = solution[i][j];
    }
  }
  
  // Create array of all cell positions
  const positions = [];
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      positions.push([row, col]);
    }
  }
  
  // Shuffle positions randomly
  shuffle(positions);
  
  let removed = 0;
  let attempts = 0;
  const maxAttempts = positions.length * 2;
  
  // Try to remove cells while maintaining unique solution
  for (let [row, col] of positions) {
    if (removed >= cellsToRemove || attempts >= maxAttempts) break;
    attempts++;
    
    // Temporarily remove the cell
    const backup = puzzle[row][col];
    puzzle[row][col] = 0; // Use 0 for empty during solution counting
    
    // Check if puzzle still has unique solution
    const solutions = countSolutions(puzzle);
    
    if (solutions === 1) {
      // Keep the cell removed (convert to null for display)
      puzzle[row][col] = null;
      removed++;
    } else {
      // Restore the cell
      puzzle[row][col] = backup;
    }
  }
  
  // Ensure we have the minimum number of clues for a valid puzzle
  if (removed < Math.min(cellsToRemove - 10, 30)) {
    // If we couldn't remove enough cells, try a different approach
    // Remove cells more aggressively but ensure no conflicts
    const minClues = 25; // Minimum clues needed for most puzzles
    const currentClues = 81 - removed;
    
    if (currentClues > minClues + 10) {
      // Try to remove more cells using a simpler approach
      for (let [row, col] of shuffle([...positions])) {
        if (puzzle[row][col] !== null && removed < cellsToRemove) {
          puzzle[row][col] = null;
          removed++;
        }
      }
    }
  }
  
  return { puzzle, solution };
};

// Check if the board is completely filled
export const isBoardComplete = (board) => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === null) return false;
    }
  }
  return true;
};

// Validate if a move is legal according to Sudoku rules
export const isValidMove = (board, row, col, val) => {
  // Check if the cell is already filled
  if (board[row][col] !== null) return false;
  
  // Check row for conflicts
  for (let i = 0; i < 9; i++) {
    if (i !== col && board[row][i] === val) return false;
  }

  // Check column for conflicts
  for (let i = 0; i < 9; i++) {
    if (i !== row && board[i][col] === val) return false;
  }

  // Check 3x3 box for conflicts
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;

  for (let r = startRow; r < startRow + 3; r++) {
    for (let c = startCol; c < startCol + 3; c++) {
      if ((r !== row || c !== col) && board[r][c] === val) return false;
    }
  }

  return true;
};

// Validate if a complete board follows Sudoku rules
export const isValidBoard = (board) => {
  // Check all rows
  for (let row = 0; row < 9; row++) {
    const seen = new Set();
    for (let col = 0; col < 9; col++) {
      const val = board[row][col];
      if (val !== null) {
        if (seen.has(val)) return false;
        seen.add(val);
      }
    }
  }
  
  // Check all columns
  for (let col = 0; col < 9; col++) {
    const seen = new Set();
    for (let row = 0; row < 9; row++) {
      const val = board[row][col];
      if (val !== null) {
        if (seen.has(val)) return false;
        seen.add(val);
      }
    }
  }
  
  // Check all 3x3 boxes
  for (let boxRow = 0; boxRow < 3; boxRow++) {
    for (let boxCol = 0; boxCol < 3; boxCol++) {
      const seen = new Set();
      for (let row = boxRow * 3; row < boxRow * 3 + 3; row++) {
        for (let col = boxCol * 3; col < boxCol * 3 + 3; col++) {
          const val = board[row][col];
          if (val !== null) {
            if (seen.has(val)) return false;
            seen.add(val);
          }
        }
      }
    }
  }
  
  return true;
};

// Helper function to check if puzzle is solvable
export const isPuzzleSolvable = (board) => {
  const boardCopy = copyBoard(board);
  // Convert nulls to 0s for solving
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (boardCopy[i][j] === null) boardCopy[i][j] = 0;
    }
  }
  return solveSudoku(boardCopy);
};
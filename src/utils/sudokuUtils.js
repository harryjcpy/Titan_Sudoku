// sudokuUtils.js - Fixed Sudoku Generation Algorithm

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

// Shuffle array utility
const shuffle = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
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
  const maxAttempts = 5;
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    console.log(`Generating complete board, attempt ${attempt + 1}/${maxAttempts}`);
    
    // Start with empty board (using 0 for empty cells during generation)
    const board = Array.from({ length: 9 }, () => Array(9).fill(0));
    
    // Fill the board using backtracking with randomization
    if (solveSudoku(board)) {
      console.log('Successfully generated complete board');
      return board;
    }
  }
  
  // If generation fails, use a known valid solution
  console.log('Generation failed, using fallback solution');
  return [
    [5,3,4,6,7,8,9,1,2],
    [6,7,2,1,9,5,3,4,8],
    [1,9,8,3,4,2,5,6,7],
    [8,5,9,7,6,1,4,2,3],
    [4,2,6,8,5,3,7,9,1],
    [7,1,3,9,2,4,8,5,6],
    [9,6,1,5,3,7,2,8,4],
    [2,8,7,4,1,9,6,3,5],
    [3,4,5,2,8,6,1,7,9]
  ];
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
  try {
    console.log(`Starting ${difficulty} puzzle generation...`);
    
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
    
    console.log('Complete solution generated, creating puzzle...');
    
    // Create array of all cell positions
    const positions = [];
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        positions.push([row, col]);
      }
    }
    
    // Shuffle positions randomly
    const shuffledPositions = shuffle(positions);
    
    let removed = 0;
    let attempts = 0;
    const maxAttempts = Math.min(cellsToRemove * 3, 150); // Limit attempts to prevent infinite loops
    
    // Try to remove cells while maintaining unique solution
    for (let [row, col] of shuffledPositions) {
      if (removed >= cellsToRemove || attempts >= maxAttempts) break;
      attempts++;
      
      // Temporarily remove the cell
      const backup = puzzle[row][col];
      puzzle[row][col] = 0;
      
      // Check if puzzle still has unique solution
      const solutions = countSolutions(puzzle);
      
      if (solutions === 1) {
        // Keep the cell removed
        removed++;
        console.log(`Removed cell (${row}, ${col}), total removed: ${removed}`);
      } else {
        // Restore the cell
        puzzle[row][col] = backup;
      }
    }
    
    console.log(`Puzzle creation completed. Removed ${removed} cells out of target ${cellsToRemove}`);
    
    // Convert 0s to nulls for the puzzle format and ensure solution stays as numbers
    const puzzleForUI = puzzle.map(row => 
      row.map(cell => cell === 0 ? null : cell)
    );
    
    // Validate the final puzzle
    if (!isValidBoard(puzzleForUI)) {
      console.error('Generated puzzle has conflicts, using fallback');
      throw new Error('Invalid puzzle generated');
    }
    
    console.log('Puzzle validation passed');
    
    return { 
      puzzle: puzzleForUI, 
      solution: solution 
    };
    
  } catch (error) {
    console.error('Error in generateSudokuPuzzle:', error);
    
    // Return a well-tested fallback puzzle
    const fallbackSolution = [
      [5,3,4,6,7,8,9,1,2],
      [6,7,2,1,9,5,3,4,8],
      [1,9,8,3,4,2,5,6,7],
      [8,5,9,7,6,1,4,2,3],
      [4,2,6,8,5,3,7,9,1],
      [7,1,3,9,2,4,8,5,6],
      [9,6,1,5,3,7,2,8,4],
      [2,8,7,4,1,9,6,3,5],
      [3,4,5,2,8,6,1,7,9]
    ];
    
    const fallbackPuzzle = [
      [5,3,null,null,7,null,null,null,null],
      [6,null,null,1,9,5,null,null,null],
      [null,9,8,null,null,null,null,6,null],
      [8,null,null,null,6,null,null,null,3],
      [4,null,null,8,null,3,null,null,1],
      [7,null,null,null,2,null,null,null,6],
      [null,6,null,null,null,null,2,8,null],
      [null,null,null,4,1,9,null,null,5],
      [null,null,null,null,8,null,null,7,9]
    ];
    
    console.log('Using fallback puzzle');
    return {
      puzzle: fallbackPuzzle,
      solution: fallbackSolution
    };
  }
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
        if (seen.has(val)) {
          console.error(`Row ${row} has duplicate value ${val}`);
          return false;
        }
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
        if (seen.has(val)) {
          console.error(`Column ${col} has duplicate value ${val}`);
          return false;
        }
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
            if (seen.has(val)) {
              console.error(`Box (${boxRow}, ${boxCol}) has duplicate value ${val}`);
              return false;
            }
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
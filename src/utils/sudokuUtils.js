// sudokuUtils.js - Proper Sudoku Generation Algorithm

// Check if number is not used in the 3x3 box
const unUsedInBox = (grid, rowStart, colStart, num) => {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[rowStart + i][colStart + j] === num) {
        return false;
      }
    }
  }
  return true;
};

// Fill a 3x3 box with random valid numbers
const fillBox = (grid, row, col) => {
  let num;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      do {
        num = Math.floor(Math.random() * 9) + 1;
      } while (!unUsedInBox(grid, row, col, num));
      grid[row + i][col + j] = num;
    }
  }
};

// Check if number is not used in the row
const unUsedInRow = (grid, i, num) => {
  for (let j = 0; j < 9; j++) {
    if (grid[i][j] === num) {
      return false;
    }
  }
  return true;
};

// Check if number is not used in the column
const unUsedInCol = (grid, j, num) => {
  for (let i = 0; i < 9; i++) {
    if (grid[i][j] === num) {
      return false;
    }
  }
  return true;
};

// Check if it's safe to place number at position (i, j)
const checkIfSafe = (grid, i, j, num) => {
  return unUsedInRow(grid, i, num) && 
         unUsedInCol(grid, j, num) && 
         unUsedInBox(grid, i - (i % 3), j - (j % 3), num);
};

// Fill the diagonal 3x3 matrices
const fillDiagonal = (grid) => {
  for (let i = 0; i < 9; i += 3) {
    fillBox(grid, i, i);
  }
};

// Fill remaining cells using backtracking
const fillRemaining = (grid, i, j) => {
  // If we've reached the end of the grid
  if (i === 9) {
    return true;
  }

  // Move to next row when current row is finished
  if (j === 9) {
    return fillRemaining(grid, i + 1, 0);
  }

  // Skip if cell is already filled
  if (grid[i][j] !== 0) {
    return fillRemaining(grid, i, j + 1);
  }

  // Try numbers 1-9 in current cell
  for (let num = 1; num <= 9; num++) {
    if (checkIfSafe(grid, i, j, num)) {
      grid[i][j] = num;
      if (fillRemaining(grid, i, j + 1)) {
        return true;
      }
      grid[i][j] = 0;
    }
  }

  return false;
};

// Remove K digits randomly from the grid
const removeKDigits = (grid, k) => {
  let count = k;
  while (count > 0) {
    // Pick a random cell
    let cellId = Math.floor(Math.random() * 81);
    
    // Get the row and column indices
    let i = Math.floor(cellId / 9);
    let j = cellId % 9;
    
    // Remove the digit if the cell is not already empty
    if (grid[i][j] !== 0) {
      grid[i][j] = 0;
      count--;
    }
  }
};

// Generate a complete Sudoku grid
const generateCompleteGrid = () => {
  try {
    // Initialize an empty 9x9 grid
    let grid = new Array(9).fill(0).map(() => new Array(9).fill(0));
    
    // Fill the diagonal 3x3 matrices first
    fillDiagonal(grid);
    
    // Fill the remaining blocks in the grid
    const success = fillRemaining(grid, 0, 0);
    
    if (!success) {
      console.error('Failed to generate complete grid, retrying...');
      return generateCompleteGrid(); // Retry
    }
    
    return grid;
  } catch (error) {
    console.error('Error in generateCompleteGrid:', error);
    // Return a simple valid grid as fallback
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
  }
};

// Main function to generate Sudoku puzzle
export const generateSudokuPuzzle = (difficulty = 'medium') => {
  try {
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
    
    console.log('Generating complete grid...');
    // Generate a complete valid Sudoku grid
    const solution = generateCompleteGrid();
    console.log('Complete grid generated:', solution);
    
    // Create a copy for the puzzle
    const puzzle = solution.map(row => [...row]);
    
    // Remove digits to create the puzzle
    removeKDigits(puzzle, cellsToRemove);
    console.log('Puzzle after removing digits:', puzzle);
    
    // Convert 0s to nulls for the UI
    const puzzleForUI = puzzle.map(row => 
      row.map(cell => cell === 0 ? null : cell)
    );
    
    console.log('Final puzzle for UI:', puzzleForUI);
    
    return { 
      puzzle: puzzleForUI, 
      solution: solution 
    };
  } catch (error) {
    console.error('Error in generateSudokuPuzzle:', error);
    // Return a simple fallback puzzle
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
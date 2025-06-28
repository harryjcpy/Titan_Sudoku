// sudokuUtils.js - Robust Sudoku Generation Algorithm

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

// Fill a 3x3 box with random valid numbers - improved version
const fillBox = (grid, row, col) => {
  // Create array of numbers 1-9 and shuffle them
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  
  // Shuffle the numbers array
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }
  
  let numIndex = 0;
  
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      // Find the next available number for this position
      let placed = false;
      let attempts = 0;
      
      while (!placed && attempts < 9) {
        const num = numbers[(numIndex + attempts) % 9];
        
        if (unUsedInBox(grid, row, col, num)) {
          grid[row + i][col + j] = num;
          
          // Remove this number from available numbers for this box
          const usedIndex = numbers.indexOf(num);
          numbers.splice(usedIndex, 1);
          numbers.push(num); // Add to end to avoid reuse
          
          placed = true;
        }
        attempts++;
      }
      
      // If we couldn't place a number, restart this box
      if (!placed) {
        // Clear the box and try again
        for (let x = 0; x < 3; x++) {
          for (let y = 0; y < 3; y++) {
            grid[row + x][col + y] = 0;
          }
        }
        return fillBox(grid, row, col); // Recursive retry
      }
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

// Fill remaining cells using backtracking with randomization
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

  // Create shuffled array of numbers 1-9 for randomization
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (let k = numbers.length - 1; k > 0; k--) {
    const randomIndex = Math.floor(Math.random() * (k + 1));
    [numbers[k], numbers[randomIndex]] = [numbers[randomIndex], numbers[k]];
  }

  // Try numbers in random order
  for (let num of numbers) {
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
  const attempts = new Set();
  
  while (count > 0 && attempts.size < 81) {
    // Pick a random cell
    let cellId = Math.floor(Math.random() * 81);
    
    // Skip if we've already tried this cell
    if (attempts.has(cellId)) {
      continue;
    }
    attempts.add(cellId);
    
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

// Generate a complete Sudoku grid with retry mechanism
const generateCompleteGrid = () => {
  const maxAttempts = 10;
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      console.log(`Grid generation attempt ${attempt + 1}/${maxAttempts}`);
      
      // Initialize an empty 9x9 grid
      let grid = new Array(9).fill(0).map(() => new Array(9).fill(0));
      
      // Fill the diagonal 3x3 matrices first
      fillDiagonal(grid);
      console.log('Diagonal boxes filled');
      
      // Fill the remaining blocks in the grid
      const success = fillRemaining(grid, 0, 0);
      
      if (success) {
        console.log('Complete grid generated successfully');
        return grid;
      } else {
        console.log(`Attempt ${attempt + 1} failed, retrying...`);
      }
    } catch (error) {
      console.error(`Error in attempt ${attempt + 1}:`, error);
    }
  }
  
  // If all attempts failed, return a known valid grid
  console.log('All generation attempts failed, using fallback grid');
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

// Validate that a grid is a valid complete Sudoku
const isValidCompleteGrid = (grid) => {
  // Check all rows
  for (let row = 0; row < 9; row++) {
    const seen = new Set();
    for (let col = 0; col < 9; col++) {
      const val = grid[row][col];
      if (val < 1 || val > 9 || seen.has(val)) return false;
      seen.add(val);
    }
  }
  
  // Check all columns
  for (let col = 0; col < 9; col++) {
    const seen = new Set();
    for (let row = 0; row < 9; row++) {
      const val = grid[row][col];
      if (val < 1 || val > 9 || seen.has(val)) return false;
      seen.add(val);
    }
  }
  
  // Check all 3x3 boxes
  for (let boxRow = 0; boxRow < 3; boxRow++) {
    for (let boxCol = 0; boxCol < 3; boxCol++) {
      const seen = new Set();
      for (let row = boxRow * 3; row < boxRow * 3 + 3; row++) {
        for (let col = boxCol * 3; col < boxCol * 3 + 3; col++) {
          const val = grid[row][col];
          if (val < 1 || val > 9 || seen.has(val)) return false;
          seen.add(val);
        }
      }
    }
  }
  
  return true;
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
    
    console.log(`Generating ${difficulty} puzzle (removing ${cellsToRemove} cells)...`);
    
    // Generate a complete valid Sudoku grid
    const solution = generateCompleteGrid();
    
    // Validate the complete grid
    if (!isValidCompleteGrid(solution)) {
      console.error('Generated grid is invalid, using fallback');
      throw new Error('Invalid grid generated');
    }
    
    console.log('Valid complete grid generated');
    
    // Create a copy for the puzzle
    const puzzle = solution.map(row => [...row]);
    
    // Remove digits to create the puzzle
    removeKDigits(puzzle, cellsToRemove);
    console.log(`Removed ${cellsToRemove} digits from puzzle`);
    
    // Convert 0s to nulls for the UI
    const puzzleForUI = puzzle.map(row => 
      row.map(cell => cell === 0 ? null : cell)
    );
    
    console.log('Puzzle generation completed successfully');
    
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
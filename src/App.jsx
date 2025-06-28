import { useState, useEffect } from 'react';
import Cell from './components/Cell';
import { generateSudokuPuzzle, isValidMove, isBoardComplete, isValidBoard } from './utils/sudokuUtils';
import TitleImg from './components/Title.jpg';
import './App.css';

function App() {
  const [board, setBoard] = useState([]);
  const [solution, setSolution] = useState([]);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [initialBoard, setInitialBoard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [gameWon, setGameWon] = useState(false);

  const generateNewPuzzle = () => {
    console.log('Starting puzzle generation...');
    setIsLoading(true);
    setGameWon(false);
    
    // Use setTimeout to prevent UI blocking during puzzle generation
    setTimeout(() => {
      try {
        console.log('Calling generateSudokuPuzzle...');
        const result = generateSudokuPuzzle('medium');
        console.log('Generated result:', result);
        
        if (!result || !result.puzzle || !result.solution) {
          console.error('Invalid result from generateSudokuPuzzle');
          return;
        }
        
        const { puzzle, solution } = result;
        
        console.log('Setting board state...');
        setBoard(puzzle);
        setSolution(solution);
        setInitialBoard(puzzle.map(row => [...row])); // Deep copy
        setSelectedNumber(null);
        setIsLoading(false);
        
        console.log('Puzzle generation completed successfully');
      } catch (error) {
        console.error('Error in generateNewPuzzle:', error);
        setIsLoading(false);
        
        // Set a fallback puzzle if generation fails
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
        
        setBoard(fallbackPuzzle);
        setSolution(fallbackSolution);
        setInitialBoard(fallbackPuzzle.map(row => [...row]));
        setSelectedNumber(null);
      }
    }, 100);
  };

  useEffect(() => {
    console.log('App component mounted, generating initial puzzle...');
    generateNewPuzzle();
  }, []);

  const handleCellClick = (row, col) => {
    if (selectedNumber === null || initialBoard[row][col] !== null || gameWon) return;

    // Validate the move
    if (!isValidMove(board, row, col, selectedNumber)) {
      alert("Invalid move! This Titan conflicts with Sudoku rules - each Titan must appear only once in each row, column, and 3x3 block.");
      return;
    }

    const newBoard = board.map(row => [...row]);
    newBoard[row][col] = selectedNumber;
    setBoard(newBoard);

    // Check if game is complete
    if (isBoardComplete(newBoard)) {
      if (isValidBoard(newBoard)) {
        setGameWon(true);
        alert("🎉 Victory! You've mastered the Titan Sudoku! All Titans are in their correct positions!");
      } else {
        alert("The board is full but contains conflicts. Please check your moves.");
      }
    }
  };

  const handleNewGame = () => {
    generateNewPuzzle();
  };

  const clearCell = (row, col) => {
    if (initialBoard[row][col] !== null || gameWon) return;
    
    const newBoard = board.map(row => [...row]);
    newBoard[row][col] = null;
    setBoard(newBoard);
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px' }}>
        <img
          src={TitleImg}
          alt="Attack on Titan Sudoku"
          style={{ height: '150px', borderRadius: '20px', marginBottom: '20px' }}
        />
        <h2 style={{ color: '#e21b1b', textAlign: 'center' }}>
          Generating Titan Sudoku...<br/>
          <span style={{ fontSize: '14px', color: '#999' }}>
            Creating a conflict-free puzzle
          </span>
        </h2>
      </div>
    );
  }

  // Safety check to ensure board is properly initialized
  if (!board || board.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px' }}>
        <h2 style={{ color: '#e21b1b', textAlign: 'center' }}>
          Error loading puzzle. Please refresh the page.
        </h2>
        <button onClick={generateNewPuzzle} style={{ marginTop: '20px', padding: '10px 20px' }}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <img
        src={TitleImg}
        alt="Attack on Titan Sudoku"
        style={{ height: '150px', borderRadius: '20px', marginTop: '24px', marginBottom: '22px' }}
      />
      
      {gameWon && (
        <div style={{ 
          backgroundColor: '#f8e71c', 
          color: '#000', 
          padding: '10px 20px', 
          borderRadius: '8px', 
          marginBottom: '20px',
          fontWeight: 'bold',
          fontSize: '18px'
        }}>
          🎉 VICTORY! All Titans are positioned correctly! 🎉
        </div>
      )}
      
      <button 
        onClick={handleNewGame}
        style={{ 
          marginBottom: '20px', 
          fontSize: '16px', 
          padding: '10px 20px',
          backgroundColor: '#e21b1b',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        New Game
      </button>

      <div className="selector">
        <h3>Select Your Titan</h3>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
          <button 
            key={n} 
            onClick={() => setSelectedNumber(n)}
            style={{
              backgroundColor: selectedNumber === n ? '#f8e71c' : '#e21b1b',
              color: selectedNumber === n ? '#000' : 'white',
              border: selectedNumber === n ? '2px solid #000' : '2px solid transparent'
            }}
          >
            <img
              src={`/titans/${n}.png`}
              alt={`Titan ${n}`}
              style={{ width: '40px', height: '40px', pointerEvents: 'none' }}
            />
          </button>
        ))}
      </div>

      <div style={{ marginBottom: '10px', color: '#ccc', fontSize: '14px', textAlign: 'center' }}>
        Right-click on a cell to clear it | Each Titan must appear once per row, column, and 3x3 block
      </div>
      
      <table style={{ borderCollapse: 'collapse', marginTop: '10px' }}>
        <tbody>
          {board.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((val, colIndex) => (
                <Cell
                  key={`${rowIndex}-${colIndex}`}
                  value={val}
                  onClick={handleCellClick}
                  onRightClick={clearCell}
                  row={rowIndex}
                  col={colIndex}
                  isInitial={initialBoard[rowIndex][colIndex] !== null}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
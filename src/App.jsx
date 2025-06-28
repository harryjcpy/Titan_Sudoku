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
    setIsLoading(true);
    setGameWon(false);
    
    // Use setTimeout to prevent UI blocking during puzzle generation
    setTimeout(() => {
      try {
        console.log('Generating new Sudoku puzzle...');
        const { puzzle, solution } = generateSudokuPuzzle('medium');
        
        console.log('Generated puzzle:', puzzle);
        console.log('Generated solution:', solution);
        
        // Validate the generated puzzle
        if (!isValidBoard(puzzle)) {
          console.error('Generated puzzle has conflicts, regenerating...');
          generateNewPuzzle();
          return;
        }
        
        setBoard(puzzle);
        setSolution(solution);
        setInitialBoard(puzzle.map(row => [...row])); // Deep copy
        setSelectedNumber(null);
        setIsLoading(false);
        
        console.log('New puzzle generated successfully');
      } catch (error) {
        console.error('Error generating puzzle:', error);
        // Retry generation
        setTimeout(generateNewPuzzle, 100);
      }
    }, 100);
  };

  useEffect(() => {
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
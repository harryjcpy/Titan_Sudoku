import { useState, useEffect } from 'react';
import Cell from './components/Cell';
import { generateSudokuPuzzle, isValidMove, isBoardComplete } from './utils/sudokuUtils';
import TitleImg from './components/Title.jpg';
import './App.css';

function App() {
  const [board, setBoard] = useState([]);
  const [solution, setSolution] = useState([]);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [initialBoard, setInitialBoard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generatePuzzle = () => {
      setIsLoading(true);
      // Use setTimeout to prevent UI blocking during puzzle generation
      setTimeout(() => {
        const { puzzle, solution } = generateSudokuPuzzle('medium');
        setBoard(puzzle);
        setSolution(solution);
        setInitialBoard(puzzle.map(row => [...row])); // Deep copy
        setIsLoading(false);
      }, 100);
    };
    
    generatePuzzle();
  }, []);

  const handleCellClick = (row, col) => {
    if (selectedNumber === null || initialBoard[row][col] !== null) return;

    if (!isValidMove(board, row, col, selectedNumber)) {
      alert("Invalid move! This number conflicts with Sudoku rules.");
      return;
    }

    const newBoard = board.map(row => [...row]);
    newBoard[row][col] = selectedNumber;
    setBoard(newBoard);

    if (isBoardComplete(newBoard)) {
      alert("🎉 Victory! The Titan Sudoku is complete!");
    }
  };

  const handleNewGame = () => {
    setIsLoading(true);
    setTimeout(() => {
      const { puzzle, solution } = generateSudokuPuzzle('medium');
      setBoard(puzzle);
      setSolution(solution);
      setInitialBoard(puzzle.map(row => [...row]));
      setSelectedNumber(null);
      setIsLoading(false);
    }, 100);
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px' }}>
        <img
          src={TitleImg}
          alt="Attack on Titan Sudoku"
          style={{ height: '150px', borderRadius: '20px', marginBottom: '20px' }}
        />
        <h2 style={{ color: '#e21b1b' }}>Generating Titan Sudoku...</h2>
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
              color: selectedNumber === n ? '#000' : 'white'
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
      
      <table style={{ borderCollapse: 'collapse', marginTop: '10px' }}>
        <tbody>
          {board.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((val, colIndex) => (
                <Cell
                  key={`${rowIndex}-${colIndex}`}
                  value={val}
                  onClick={handleCellClick}
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
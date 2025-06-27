
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

  useEffect(() => {
    const { puzzle, solution } = generateSudokuPuzzle(40); // 40 empty cells = medium
    setBoard(puzzle);
    setSolution(solution);
    setInitialBoard(puzzle);
  }, []);

  const handleCellClick = (row, col) => {
    if (selectedNumber === null || initialBoard[row][col] !== null) return;

    if (!isValidMove(board, row, col, selectedNumber)) {
      alert("Wrong move! This breaks the Sudoku rules!");
      return;
    }

    const newBoard = board.map(row => [...row]);
    newBoard[row][col] = selectedNumber;
    setBoard(newBoard);

    if (isBoardComplete(newBoard)) {
      alert("🎉 Victory! The Titan Sudoku is complete!");
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <img
        src={TitleImg}
        alt="Attack on Titan Sudoku"
        style={{ height: '150px', borderRadius: '20px', marginTop: '24px', marginBottom: '22px' }}
      />
      <div className="selector">
  <h3>Select Your Titan</h3>
  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
    <button key={n} onClick={() => setSelectedNumber(n)}>
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

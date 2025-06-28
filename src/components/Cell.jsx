function Cell({ value, onClick, onRightClick, row, col, isInitial }) {
  const handleClick = () => {
    if (!isInitial) {
      onClick(row, col);
    }
  };

  const handleRightClick = (e) => {
    e.preventDefault();
    if (!isInitial && onRightClick) {
      onRightClick(row, col);
    }
  };

  const renderValue = () => {
    if (!value) return null;

    return (
      <img
        src={`/titans/${value}.png`}
        alt={`Titan ${value}`}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          pointerEvents: 'none',
          opacity: isInitial ? 1 : 0.9,
        }}
      />
    );
  };

  // Determine if this cell is in a highlighted 3x3 block
  const blockRow = Math.floor(row / 3);
  const blockCol = Math.floor(col / 3);
  const isAlternateBlock = (blockRow + blockCol) % 2 === 1;

  return (
    <td 
      onClick={handleClick}
      onContextMenu={handleRightClick}
      style={{
        backgroundColor: isInitial 
          ? (isAlternateBlock ? 'rgba(40, 40, 40, 0.9)' : 'rgba(30, 30, 30, 0.9)')
          : (isAlternateBlock ? 'rgba(25, 25, 25, 0.85)' : 'rgba(20, 20, 20, 0.85)'),
        cursor: isInitial ? 'default' : 'pointer',
        border: isInitial ? '2px solid #666' : '1px solid #555',
        width: '60px',
        height: '60px',
        position: 'relative'
      }}
      title={isInitial ? 'Given clue' : (value ? 'Right-click to clear' : 'Click to place selected Titan')}
    >
      {renderValue()}
      {!isInitial && !value && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#666',
          fontSize: '12px',
          pointerEvents: 'none'
        }}>
          {/* Empty cell indicator */}
        </div>
      )}
    </td>
  );
}

export default Cell;
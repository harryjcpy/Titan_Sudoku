function Cell({ value, onClick, row, col, isInitial }) {
  const handleClick = () => {
    if (!isInitial) {
      onClick(row, col);
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
          opacity: isInitial ? 1 : 0.8,
        }}
      />
    );
  };

  return (
    <td 
      onClick={handleClick}
      style={{
        backgroundColor: isInitial 
          ? 'rgba(30, 30, 30, 0.9)' 
          : 'rgba(20, 20, 20, 0.85)',
        cursor: isInitial ? 'default' : 'pointer',
        border: isInitial ? '2px solid #666' : '1px solid #555'
      }}
    >
      {renderValue()}
    </td>
  );
}

export default Cell;
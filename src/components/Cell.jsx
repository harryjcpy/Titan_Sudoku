// // src/components/Cell.jsx

// export default function Cell({ value, onClick, row, col }) {
//   return (
//     <td
//       onClick={() => onClick(row, col)}
//       style={{
//         width: '40px',
//         height: '40px',
//         border: '1px solid black',
//         textAlign: 'center',
//         cursor: 'pointer'
//       }}
//     >
//       {value}
//     </td>
//   );
// }

// Cell.jsx

function Cell({ value, onClick, row, col }) {
  const handleClick = () => {
    onClick(row, col);
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
        }}
      />
    );
  };

  return (
    <td onClick={handleClick}>
      {renderValue()}
    </td>
  );
}

export default Cell;

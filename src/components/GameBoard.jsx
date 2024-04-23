const initialGameBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null]
]

export default function GameBoard({ onSelectSquare, turns }) {
  // transform turns array into gameboard nested array
  let gameBoard = initialGameBoard;

  for ( const turn of turns ) {
    const { square, player } = turn;
    const { row, col } = square;

    gameBoard[row][col] = player;
  }

  return <ol id="game-board">
    {gameBoard.map((row, rowIndex) => <li key={rowIndex}>
      <ol>
        {row.map((playerSymbol, colIndex) => (
          <li key={colIndex}>
            <button onClick={() => onSelectSquare(rowIndex, colIndex)} disabled={playerSymbol !== null}>
              {playerSymbol}
            </button>
          </li>
        ))}
      </ol>
    </li>)}
  </ol>
}

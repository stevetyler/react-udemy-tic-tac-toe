import { useState } from 'react';

import Player from './components/Player.jsx';
import GameBoard from './components/GameBoard.jsx';
import GameOver from './components/GameOver.jsx';
import Log from './components/Log.jsx';
import { WINNING_COMBINATIONS } from './components/winning-combinations.js';

// Arrays are passed by reference only!
const initialGameBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null]
]; 

function deriveActivePlayer(gameTurns) {
  let currentPlayer = 'X';

  if (gameTurns.length > 0 && gameTurns[0].player === 'X') {
    currentPlayer = 'O';
  }
  return currentPlayer;
}

function App() {
  // CALLED EVERYTIME BOARD UPDATES
  const [gameTurns, setGameTurns] = useState([]);
  const activePlayer = deriveActivePlayer(gameTurns);

  // create a deep copy of gameboard so we don't always reference initialGameBoard 
  const gameBoard = [...initialGameBoard.map(arr => [...arr])];

  for ( const turn of gameTurns ) {
    const { square, player } = turn;
    const { row, col } = square;

    gameBoard[row][col] = player; 
    console.log(JSON.stringify(gameBoard));
  }

  function handleSelectSquare(rowIndex, colIndex) {
    console.log('handleSelectSquare');
    setGameTurns(prevTurns => {
      const currentPlayer = deriveActivePlayer(prevTurns);
      const updatedTurns = [
        { square: { row: rowIndex, col: colIndex }, player: currentPlayer},
        ...prevTurns
      ];

      return updatedTurns;
    });
  }

  let winner = null;

  for (const combination of WINNING_COMBINATIONS) {
    const firstSquareSymbol = gameBoard[combination[0].row][combination[0].column];
    const secondSquareSymbol = gameBoard[combination[1].row][combination[1].column];
    const thirdSquareSymbol = gameBoard[combination[2].row][combination[2].column];

    if (firstSquareSymbol && 
      firstSquareSymbol == secondSquareSymbol && 
      firstSquareSymbol == thirdSquareSymbol) {
      winner = firstSquareSymbol;
    } 
  }

  const hasDraw = gameTurns.length === 9 && !winner;

  function handleRestart() {
    setGameTurns([]);
  }

  return <main>
    <div id ="game-container">
      <ol id="players" className="highlight-player">
        <Player initialName="Player 1" symbol="X" isActive={activePlayer === 'X'}/>
        <Player initialName="Player 2" symbol="O" isActive={activePlayer === 'O'}/>
      </ol>
      <GameBoard 
        onSelectSquare={handleSelectSquare} 
        board={gameBoard}
      />
      {(winner || hasDraw) && <GameOver winner={winner} onRestart={handleRestart}/>}
    </div>

    <Log turns={gameTurns}/>
  </main>

}

export default App

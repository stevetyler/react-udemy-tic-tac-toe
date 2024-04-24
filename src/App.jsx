import { useState } from 'react';

import Player from './components/Player.jsx';
import GameBoard from './components/GameBoard.jsx';
import GameOver from './components/GameOver.jsx';
import Log from './components/Log.jsx';
import { WINNING_COMBINATIONS } from './components/winning-combinations.js';

const PLAYERS = {
  X: 'Player1',
  O: 'Player2'
}
// Arrays are passed by reference only!
const INITIAL_GAME_BOARD = [
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

function deriveGameBoard(gameTurns) {
  // create a deep copy of gameboard so we don't always reference initialGameBoard 
  let gameBoard = [...INITIAL_GAME_BOARD.map(arr => [...arr])];

  for ( const turn of gameTurns ) {
    const { square, player } = turn;
    const { row, col } = square;

    gameBoard[row][col] = player; 
    //console.log(JSON.stringify(gameBoard));
  }
  return gameBoard;
}

function deriveWinner(gameBoard, players) {
  let winner = null;

  for (const combination of WINNING_COMBINATIONS) {
    const firstSquareSymbol = gameBoard[combination[0].row][combination[0].column];
    const secondSquareSymbol = gameBoard[combination[1].row][combination[1].column];
    const thirdSquareSymbol = gameBoard[combination[2].row][combination[2].column];

    if (firstSquareSymbol && 
      firstSquareSymbol == secondSquareSymbol && 
      firstSquareSymbol == thirdSquareSymbol) {
      winner = players[firstSquareSymbol];
    } 
  }
  return winner;
}

// CALLED EVERYTIME BOARD UPDATES
function App() {
  const [players, setPlayers] = useState(PLAYERS);
  const [gameTurns, setGameTurns] = useState([]);
  const gameBoard = deriveGameBoard(gameTurns);
  const activePlayer = deriveActivePlayer(gameTurns);
  const winner = deriveWinner(gameBoard, players);
  const hasDraw = gameTurns.length === 9 && !winner;

  function handleSelectSquare(rowIndex, colIndex) {
    setGameTurns(prevTurns => {
      const currentPlayer = deriveActivePlayer(prevTurns);
      const updatedTurns = [
        { square: { row: rowIndex, col: colIndex }, player: currentPlayer},
        ...prevTurns
      ];

      return updatedTurns;
    });
  }

  function handleRestart() {
    setGameTurns([]);
  }

  // Don't lift state up from Player or App will rerender on input onChange event
  function handlePlayerNameChange(symbol, newName) {
    setPlayers(prevPlayers => {
      return {
        ...prevPlayers,
        [symbol]: newName 
      };
    });
  }

  return <main>
    <div id ="game-container">
      <ol id="players" className="highlight-player">
        <Player 
          initialName={PLAYERS.X}
          symbol="X" 
          isActive={activePlayer === 'X'}
          onChangeName={handlePlayerNameChange}
        />
        <Player 
          initialName={PLAYERS.O}
          symbol="O" 
          isActive={activePlayer === 'O'}
          onChangeName={handlePlayerNameChange}
        />
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

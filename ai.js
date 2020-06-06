/* globals board gridSize emptyCells board2d compareArrays report getRows getColumns */

/* ai.js
 *
 * Tic Tac Toe Game Player File (an Artificial Intelligence program)
 *
 * by 👉enter yourself here, with email 👈
 *
 *           INSTRUCTIONS
 *
 * - Write your AI in this file.
 * - You may create new functions, variables, and anything else your AI needs in this file.
 * - Don't edit the sketch.js file. You can look, but don't touch.
 * - The AI takes one turn at a time.
 * - The AI is invoked when the game calls the aiSelect() function.
 * - The aiSelect() function returns the number of which cell to mark, 0-8:
 *
 *     0 | 1 | 2
 *    -----------
 *     3 | 4 | 5
 *    -----------
 *     6 | 7 | 8
 *
 * - The AI may NOT edit the game state in any way.
 * - The AI MUST return 0-8 from aiSelect (as long the game hasn't ended yet, after which we don't care)
 * - The AI may look at the game state variables: board, gridSize, etc, but not change them.
 *
 * - The game is 2-dimensional, but the board is stored a 1-dimensional array, using the cell numbers above.
 * - If you want to think about the board as 2D, we provided a function board2d() to provide a 2d interface to it.
 * - Each cell of the board is either 'X', 'O', or '', where empty string means the cell is empty.
 *
 *        RESOURCES
 * board        ➡️ variable containing the board state array. Readable like this: board[5]
 * gridSize     ➡️ variable describing the width (and heigh) of the board. Default is 3.
 * player       ➡️ variable containing the mark of the current player (that's you!)
 *
 * board2d()    ➡️ function to read the board while thinking 2D, like this: board(2,3) <- reads value row 2, column 3
 * cell2d()     ➡️ function that converts coordinates (row, col) into a 1D cell number.
 *
 * getRows()    ➡️ function that slices the game stateinto rows. Returns an array of the rows. Each row is an array.
 * getColumns() ➡️ function that slices the game state into columns. Returns an array of cols, each is an array.
 *
 * emptyCells() ➡️ function to give you what cells are empty in a given board state (or array). emptyCells(board)
 */
const copyArray = function(array){
  return JSON.parse(JSON.stringify(array));
}

const testBoard2d = function(board, i, j){
    const iOffset = i * gridSize;
    return board[iOffset + j];
}

const testBoardWin = function(board, direction) {
  let pathResult;
  let headerCell;
  let comparisonCell;
  if (direction === 'diagonal') {
    for (let i = -1; i <= 1; i = i + 2) {
      const yCoord = ((gridSize - 1) / 2) * (1 + i);
      headerCell = testBoard2d(board, yCoord, 0);
      if (headerCell !== '') {
        pathResult = true;
        for (let j = 1; j < gridSize; j++) {
          const compY = yCoord + j * -i;
          comparisonCell = testBoard2d(board, compY, j);
          if (comparisonCell !== headerCell) {
            pathResult = false;
          }
        }
        if (pathResult === true) {
          return headerCell;
        }
      }
    }
  } else {
    for (let i = 0; i < gridSize; i++) {
      if (direction === 'vertical') {
        headerCell = testBoard2d(board, 0, i);
      } else if (direction === 'horizontal') {
        headerCell = testBoard2d(board, i, 0);
      }
      if (headerCell !== '') {
        pathResult = true;
        for (let j = 1; j < gridSize; j++) {
          if (direction === 'vertical') {
            comparisonCell = testBoard2d(board, j, i);
          } else if (direction === 'horizontal') {
            comparisonCell = testBoard2d(board, i, j);
          }
          if (comparisonCell !== headerCell) {
            pathResult = false;
          }
        }
        if (pathResult === true) {
          return headerCell;
        }
      }
    }
  }
  return '';
}

function testBoardWins(board) {
  const winResults = [testBoardWin(board, 'horizontal'), testBoardWin(board, 'vertical'), testBoardWin(board, 'diagonal')];

  const reducer = function (total, num) {
    if (num === '' && total === '') {
      return '';
    } else if (total === '') {
      return num;
    } else {
      return total;
    }
  };

  return winResults.reduce(reducer);
}

// returns a string representing the winner, or an empty string if nobody has won
function checkWins() {
  const winResults = [checkWin('horizontal'), checkWin('vertical'), checkWin('diagonal')];

  const reducer = function (total, num) {
    if (num === '' && total === '') {
      return '';
    } else if (total === '') {
      return num;
    } else {
      return total;
    }
  };

  return winResults.reduce(reducer);
}

const boardForecast = function(board, availableCells, forecastArray, forecastIteration, player, opponent, activePlayer, upstreamCell){
  if(availableCells.length > 0){
    let nextIteration = forecastIteration + 1;
    availableCells.forEach(function(trialCell){
      print(availableCells);
      print(activePlayer);
      print("=====");
      let trialAvailableCells = copyArray(availableCells);
      let trialBoard = copyArray(board);
      trialBoard[trialCell] = activePlayer;
      let trialResult = testBoardWins(trialBoard);

      let trialIndex;
      let arrayIndexer = function(array, target){
        let result = array.findIndex(function(e){
          return (e[0] == target);
        });
        return result;
      }
      if (upstreamCell == undefined){
        trialIndex = arrayIndexer(forecastArray, trialCell);
      } else{
        trialIndex = upstreamCell;
      }

      let increment = 1 / nextIteration;
      //tempprint = trialBoard.map(function(x){ if(x==""){return "⬛️";}else{return x;}});
      if (trialResult == player){
        forecastArray[trialIndex][1] = forecastArray[trialIndex][1] - (increment);
      } else if (trialResult == opponent){
        forecastArray[trialIndex][1] = forecastArray[trialIndex][1] - (increment);
      } else {
        forecastArray[trialIndex][1] = forecastArray[trialIndex][1] + (increment);
        trialAvailableCells.splice(trialAvailableCells.indexOf(trialCell), 1);
        if (activePlayer == players[0]){
          activePlayer = players[1];
        } else{
          activePlayer = players[0];
        }
        boardForecast(trialBoard, trialAvailableCells, forecastArray, nextIteration, player, opponent, activePlayer, trialIndex);
      }
    });
  } else {
    return forecastArray;
  }
  return forecastArray;
}


const forecastAlgorithm = function(board, availableCells, forecastArray, depth, forecastIteration){
  let opponent;
  if (player == players[1]){
    opponent = players[0];
  } else{
    opponent = players[1];
  }
  forecastArray = boardForecast(board, availableCells, forecastArray, forecastIteration, player, opponent, player);
  return forecastArray;
}

const aiSelect = function() {
  let decision; 
  let forecastArray = [];
  let currentBoard = copyArray(board);
  let currentAvailableCells = copyArray(emptyCells(currentBoard));

  for(let i = 0; i < currentAvailableCells.length; i++){
    forecastArray.push([currentAvailableCells[i], 0]);
  }

  let depth = 0;
  forecastArray = forecastAlgorithm(currentBoard, currentAvailableCells, forecastArray, depth, 0);

  print(forecastArray);

  decision = forecastArray.sort(function(a ,b){
    return a[1] - b[1];
  })[0][0];
  return decision;
}

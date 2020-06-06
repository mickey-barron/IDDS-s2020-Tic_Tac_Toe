/*
 * Tic tac toe game for AI/ML
 *
 * by Jamie O'Sullivan & Mickey Barron Summer 2020
 *
 *    🚫 STUDENTS: DO NOT MODIFY THIS FILE 🚫
 *
 * Based On:
 *
 * Daniel Shiffman
 * https://thecodingtrain.com/CodingChallenges/149-tic-tac-toe.html
 * https://youtu.be/GTWrWM1UsnA
 * https://editor.p5js.org/codingtrain/sketches/5JngATm3c
 *
 *           HOW TO PLAY
 *
 * - Open the JavaScript console in your browser
 * - Press the SPACEBAR to make the AI play a move.
 * - To play manually, run the play() function in the console. Example—both of these play the center square:
 *    » play(4)
 *    » play(1, 1)
 * - You can press the spacebar for every turn, making the AI effectively play itself or play manually, or any combination.
 *
 *           INSTRUCTIONS
 *
 * - Write your AI in the ai.js file
 * - Don't edit this file.
 * - You may look at this file to see how the game works.
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
 *    🚫 STUDENTS: DO NOT MODIFY THIS FILE 🚫
 */


/* Declaration of variables 
*
* - This game is generated procedurally allowing you to change the size of the board and the dimensions of the grid.
*
* - gridSize dictates the size of the grid by defining one side of the square. 
*   For example, if you set gridSize = 4, it will make 4x4 grid with a total of 16 squares.
*
*- The canvas dimensions are specified by the canvasWidth and canvasHeight variables.
*  The defauly setting for canvasHeight is to be equal to the canvasWidth such that it's a square.
*
*/
var board = [];
const players = ['❌', '⭕'];
const gridSize = 3;
const canvasWidth = 500;
const canvasHeight = canvasWidth;
const columnWidth = canvasWidth / gridSize;
const rowHeight = canvasHeight / gridSize;
var player;

// Whenever the Spacebar is pressed, the AI takes a turn
function keyPressed() {
  if (keyCode === 32) {
    play(aiSelect());
  }
}

// Whenever a board cell is clicked, a turn is played there
function mouseClicked(){
  if (mouseX > canvasWidth || mouseY > canvasHeight){
    return;
  } else{
    let cellX = floor(mouseX / columnWidth);
    let cellY = floor(mouseY / rowHeight);
    play(cellY, cellX);
    return;
  }
}

//This procedurally generates an array of based upon the size of the grid. The array is empty to be filled with player characters
function generateBoard() {
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      board.push('');
    }
  }
}


//When invoked, this function detects if there is a win in one of the following diretions: horizontal, verticle, or diagonal. The function accepts a direction argument.
function checkWin(direction) {
  let pathResult;
  let headerCell;
  let comparisonCell;
  if (direction === 'diagonal') {
    for (let i = -1; i <= 1; i = i + 2) {
      const yCoord = ((gridSize - 1) / 2) * (1 + i);
      headerCell = board2d(yCoord, 0);
      if (headerCell !== '') {
        pathResult = true;
        for (let j = 1; j < gridSize; j++) {
          const compY = yCoord + j * -i;
          comparisonCell = board2d(compY, j);
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
        headerCell = board2d(0, i);
      } else if (direction === 'horizontal') {
        headerCell = board2d(i, 0);
      }
      if (headerCell !== '') {
        pathResult = true;
        for (let j = 1; j < gridSize; j++) {
          if (direction === 'vertical') {
            comparisonCell = board2d(j, i);
          } else if (direction === 'horizontal') {
            comparisonCell = board2d(i, j);
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

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  generateBoard(gridSize);
  player = players[0];
  report('Game started');
  noLoop(); // noLoop should be the last line in the block
}


//Procedural generation of grid.
function drawGrid() {
  background(255, 255, 255);
  let columnWidth = canvasWidth / gridSize;
  let rowHeight = canvasHeight / gridSize;
  strokeWeight(4);
  for (let i = 0; i < gridSize - 1; i++) {
    const xCoord = columnWidth * (i + 1);
    line(xCoord, 0, xCoord, canvasHeight);
  }
  for (let j = 0; j < gridSize - 1; j++) {
    const yCoord = rowHeight * (j + 1);
    line(0, yCoord, canvasWidth, yCoord);
  }
}

function numberCells() {
  textSize(20);
  fill('red');
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      text(cell2d(i, j), columnWidth * j + (columnWidth / 2), rowHeight * i + (rowHeight / 2));      
    }
  }
}

//Generation of Xs and Os in the grid
function drawMarks() {
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (board2d(j, i) !== '') {
        var xPos = columnWidth * i + columnWidth / 2;
        var yPos = rowHeight * j + rowHeight / 2;
      }
      if (board2d(j, i) === players[1]) {
        noFill();
        ellipse(xPos, yPos, columnWidth / 2, rowHeight / 2);
      } else if (board2d(j, i) === players[0]) {
        const xLength = columnWidth / 4;
        const yLength = rowHeight / 4;
        line(xPos - xLength, yPos - yLength, xPos + xLength, yPos + yLength);
        line(xPos + xLength, yPos - yLength, xPos - xLength, yPos + yLength);
      }
    }
  }
}

function report(message) {
  if (message !== '') {
    print(message);
  }
}

// Make a play, or, Takes a turn.
//
// Takes the cell number as an argument: play(6)
//  - OR -
// Takes two arguments representing the cell by (row, column): play(2, 0)
function play(cell, column) {
  if (column !== undefined) {
    cell = cell * gridSize + column;
  }
  report(`${player} plays ${cell}`);
  if (board[cell] === '') {
    board[cell] = player;
  } else {
    report(`Cell ${cell} is already taken!`);
    return;
  }
  const turnResult = checkWins();
  if (turnResult !== '') {
    report(`Game Over: ${turnResult} has won!`);
  } else if (emptyCells(board).length === 0) {
    report('Game Over: Tie!');
  } else {
    if (player === players[0]) {
      player = players[1];
    } else {
      player = players[0];
    }
    report(`${player} goes next`);
  }
  redraw();
}

function draw() {
  drawGrid();
  numberCells();
  drawMarks();
}

/* Utility Functions  */

// Returns an array of which cells are empty from the given board.
// (technically works on *any* array!)
// Examples:
//  A brand-new game with an empty board would return [0, 1, 2, 3, 4, 5, 6, 7, 8]
//  If the only empty cell is the center, it will return [4] If every cell is occupied, returns an empty list, []
function emptyCells(board) {
  const b = board.map((value, index) => {
    if (value == '') {
      return index;
    } else {
      return '';
    }
  });

  return b.filter((value) => value !== '');
}

// 2D interface to the board.
// Using this, you can think of the board as a 2d array, like this: board[i][j].
// Takes two or three arguments: i, j, newValue
//    i: row
//    j: column
//    newValue: (optional) If given, will SET the cell to that value.
// Returns the value of the board at [i][j], after the set if a set was done.
//
// Examples:
//  to get the value at row 2, column 1:
//      board2d(2, 1)
//  to set the value at row 2, column 1 to 'X':
//      board2d(2, 1, 'X')
//  both return the value of that cell.
const board2d = function (i, j, newValue) {
  const iOffset = i * gridSize;
  if (newValue !== undefined) {
    board[iOffset + j] = newValue;
  }
  return board[iOffset + j];
};

// Converts 2d style (row, col) into 1d cell number
// Given a 3x3 grid, cell2d(1,2) -> 5
const cell2d = function (row, col) {
  return row * gridSize + col;
};

// Slices up the current board state into rows.
// Returns an array, where each element is a row.
// A row is also an array.
function getRows() {
  let rows = [];
  for (let row = 0; row < gridSize; row++) {
    let thisRow = [];
    for (let col = 0; col < gridSize; col++) {
      thisRow.push(board2d(row, col));
    }
    rows.push(thisRow);
  }
  return rows;
}

// Slices up the current board state into columns.
// Returns an array, where each element is a column.
// A column is also an array.
function getColumns() {
  let columns = [];
  for (let col = 0; col < gridSize; col++) {
    let thisColumn = [];
    for (let row = 0; row < gridSize; row++) {
      thisColumn.push(board2d(row, col));
    }
    columns.push(thisColumn);
  }
  return columns;
}

// Comparing arrays in javascript is not easy.
// Just in case you need to, here is a "deep" compare function.
// This function will test if two arrays are identical by looking at every element,
//  including sub-elements, and will return true only if every single value is the same.
// This function is recursive- for each element it re-calls itself to compare, so it will work with nested data.
function compareArrays(arr1, arr2) {
  if (arr1 === arr2) return true;
  if (arr1 == null || arr2 == null) return false;
  if (arr1.length !== arr2.length) return false;

  for (let i = 0; i < arr1.length; ++i) {
    return compareArrays(arr1[i], arr2[i]);
  }
  return true;
}

/* 🚫 STUDENTS: DO NOT MODIFY THIS FILE 🚫*/

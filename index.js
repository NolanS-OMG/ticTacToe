// Contains the parent element of the game
const ticTacToe = document.getElementById('ticTacToe');
ticTacToe.classList.add('normal-border');

// Variables necessary to manage the game
let simulation = [ [0,0,0], [0,0,0], [0,0,0] ];
let turn = true;
let startTurn = turn;
let turnsCount = 0;
let isGameFinished = false;
let vsPlayer = true;
let computerTurn = !turn;

// Creates and configures the 9 squares of the game
for(let i=0; i<9; i++) {
  const square = document.createElement('div');

  // Each square's ID is a number representing its position
  square.id = `${Math.floor(i/3)}${i%3}`;

  square.className = "square pointer normal-border";
  square.addEventListener( 'click', squareClick );
  const innerDiv = document.createElement('div');
  innerDiv.className = "svg";
  square.appendChild( innerDiv );
  ticTacToe.appendChild(square);
}

const changeTurnButton = document.getElementById("changeTurnButton");
changeTurnButton.addEventListener( 'click', changeTurn );

function changeTurn() {
  turn = !turn;
  computerTurn = !turn;
  startTurn = turn;

  if(turn) {
    messageDiv.innerText = "X TURN";
    messageDiv.className = "x-color";
  } else {
    messageDiv.innerText = "CIRCLE TURN";
    messageDiv.className = "c-color";
  }
}

const computerStartsButton = document.getElementById("computerStartsButton");
computerStartsButton.addEventListener( 'click', computerStarts);

function computerStarts() {
  computerTurn = startTurn;
  computersMove();
}

// Get the modeButton and adds click functionality to it
const modeButton = document.getElementById("modeButton");
modeButton.addEventListener( 'click', changeMode );

// Changes game mode: "vsPlayer" <---> "vsComputer"
function changeMode() {
  if( vsPlayer ) {
    modeButton.firstChild.innerText = "vs Computer";
    computerStartsButton.style.display = "inline-block";
  } else {
    modeButton.firstChild.innerText = "vs Player";
    computerStartsButton.style.display = "none";
  }
  vsPlayer = !vsPlayer;
}

// Get the reset button and add click functionality to it
const resetButton = document.getElementById('resetButton');
resetButton.addEventListener( 'click', resetGame );

// Reset function
function resetGame() {
  // Reset variables
  simulation = [ [0,0,0], [0,0,0], [0,0,0] ];
  turn = startTurn;
  computerTurn = !startTurn;
  turnsCount = 0;
  isGameFinished = false;

  // Get squares as an array (otherwise it would be an HTML collection)
  const squares = Array.from( ticTacToe.children );
  for(let i=0; i<squares.length; i++) {
    // Restore classes
    squares[i].className = "square pointer normal-border";
    squares[i].firstChild.innerHTML = "";
  }

  // Restart message
  if(turn) {
    messageDiv.innerText = "X TURN";
    messageDiv.className = "x-color";
  } else {
    messageDiv.innerText = "CIRCLE TURN";
    messageDiv.className = "c-color";
  }

  // it is possible to change game mode, game turn or let the computer Starts
  modeButton.removeAttribute("disabled");
  changeTurnButton.removeAttribute("disabled");
  computerStartsButton.removeAttribute("disabled");
}

// SVG HTML code of the circle
const circleSvgString = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +
                '<g id="Shape / Circle">' +
                '<circle cx="12" cy="12" r="9" stroke="#ff6700" stroke-width="2" fill="none"/>' +
                '</g>' +
                '</svg>';
// SVG HTML code for the X
const XSvgString =  '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +
                '<g id="Menu / Close_MD">' +
                '<path id="Vector" d="M18 18L12 12M12 12L6 6M12 12L18 6M12 12L6 18" stroke="#3a86ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'+
                '</g>' +
                '</svg>';

// Container for dynamic message on screen
const messageDiv = document.getElementById('message');
messageDiv.innerText = "X TURN";
messageDiv.className = "x-color";

// This function, triggered by clicking a square, contains all the necessary game logic
function squareClick(event) {

  if( isGameFinished ) {
    return;
  }

  let element = event.target;

  // If the element does not have the 'square' class, it's not the square, but an inner element,
  // so we go up until we reach the square one
  while( !element.classList.contains('square') ) {
    element = element.parentElement;
  }

  // If the square already has an X or a circle, clicking does not affect
  if (element.classList.contains('has-x') || element.classList.contains('has-c')) {
    return;
  }

  // Because the game starts, it is impossible to change the game mode, game turn or let the computer starts
  modeButton.setAttribute( "disabled", "disabled" );
  changeTurnButton.setAttribute( "disabled", "disabled" );
  computerStartsButton.setAttribute( "disabled", "disabled" );

  // Increase turn count
  turnsCount += 1;

  // Depending on the turn, draw X or circle
  if(turn) {
    drawX(element);
  } else {
    drawC(element);
  }

  // Check if the game has ended
  endCondition(element.id);

  // Switch turn
  turn = !turn;

  // if it is not in "vsPlayer" mode (it is on "vsComputer")
  // and it is the computer turn
  if( !vsPlayer && turn === computerTurn ) {
    // Computer moves
    computersMove();
  }
}

// This function makes the computer choose a square and click it
function computersMove() {
  const availableSquares = document.getElementsByClassName("pointer");
  const clickEvent = new Event('click');
  availableSquares[ Math.floor(Math.random()*availableSquares.length) ].dispatchEvent(clickEvent);
}

// Draw X
function drawX(element) {
  element.classList.remove('pointer');
  element.classList.add('has-x');
  element.firstChild.innerHTML = XSvgString;

  messageDiv.innerText = "CIRCLE TURN";
  messageDiv.className = "c-color";

  const row = Number(element.id.slice(0,1));
  const column = Number(element.id.slice(1,2));
  simulation[row][column] = 1;
}

// Draw circle
function drawC(element) {
  element.classList.remove('pointer');
  element.classList.add('has-c');
  element.firstChild.innerHTML = circleSvgString;

  messageDiv.innerText = "X TURN";
  messageDiv.className = "x-color";

  const row = Number(element.id.slice(0,1));
  const column = Number(element.id.slice(1,2));
  simulation[row][column] = -1;
}

// Check if the game has ended
function endCondition(place) {
  // Save the clicked place
  const row = Number(place.slice(0,1));
  const column = Number(place.slice(1,2));
  
  // If there's a line, we have a winner
  if( isLine(row, column) ) {
    isGameFinished = true;

    if( vsPlayer ) {
      if( turn ) {
        messageDiv.innerText = "X WINS !!!";
      } else {
        messageDiv.innerText = "CIRCLE WINS !!!";
      }
      endOptions("win");
      endAnimation(row,column, "win");
      return;
    }

    if( turn === computerTurn ) {
      messageDiv.innerText = "YOU LOST :(";
      endOptions("looser");
      endAnimation(row,column, "looser");
    } else {
      messageDiv.innerText = "YOU WON :D";
      endOptions("win");
      endAnimation(row,column, "win");
    }

    return;
  }

  // If the game is full, it's a draw
  if( turnsCount === 9 ) {
    messageDiv.innerText = "IT'S A DRAW";
    endOptions("draw");
    isGameFinished = true;
  }
}

// Check if it's a line
function isLine(row,column) {
  // Save whether it's X or a circle
  let searchNum = simulation[row][column];

  // If there's a row, a column, or a diagonal, we have a line
  return isRow(row, searchNum) || isColumn(column, searchNum) || isDiagonal(row,column,searchNum);
}

// Check if it's a row
function isRow(row, num) {
  for(let i=0; i<3; i++) {
    // If one of the numbers is not equal, it's not a row
    if(simulation[row][i] !== num) {
      return false;
    }
  }
  return true;
}

// Check if it's a column
function isColumn(column, num) {
  for(let i=0; i<3; i++) {
    // If one of the numbers is not equal, it's not a column
    if(simulation[i][column] !== num) {
      return false;
    }
  }
  return true;
}

// Check if it's a diagonal
function isDiagonal(row, column, num) {
  // Check if it's the center or corners, if it's not, it's not possible to make a diagonal
  if( !(row === column || Math.abs(row - column) === 2) ) {
    return false;
  }

  return isDirectDiagonal(num) || isCounterDiagonal(num);
}

function isDirectDiagonal(num) {
  // Variables to search the direct diagonal
  let direct = 0
  for( let i=0; i<3; i++ ) {
    // If it's the diagonal, increment diagonal count
    if ( simulation[i][i] === num ) {
      direct += 1;
    }
  }

  // If the diagonal sum up to 3 squares with the same value, it's a diagonal
  return direct === 3;
}
function isCounterDiagonal(num) {
  // Variables to search the counter diagonal
  let counter = 0;
  for( let i=0; i<3; i++ ) {
    // If it's the counter diagonal, increment counter diagonal count
    if( simulation[2-i][i] === num ) {
      counter += 1;
    }
  }

  // If the diagonal sum up to 3 squares with the same value, it's a diagonal
  return counter === 3;
}

// Set the options for the game when it ends
function endOptions(word) {
  messageDiv.className = word + "-color";
  const allSquares = Array.from( ticTacToe.children );
  for(let i=0; i<allSquares.length; i++) {
    allSquares[i].classList.remove('normal-border');
    allSquares[i].classList.remove('pointer');
    allSquares[i].classList.add(word + '-border');
  }
}

// Triggers when the games ends and its not a draw
function endAnimation(row, column, word) {
  let searchNum = -1;
  if(turn) {
    searchNum = 1;
  }
  const winningElements = getWinningPositions(row,column, searchNum);
  for( let i=0; i<winningElements.length; i++ ) {
    winningElements[i].classList.add(word+"-color");
    winningElements[i].classList.add("animate");
  }
}

// Gets the positions of the winning squares that make the line
function getWinningPositions(row,column, searchNum) {
  const retObj = {};
  if( isDouble(row, column, searchNum) ) {
    let searchClass = turn ? "has-x" : "has-c";
    return document.getElementsByClassName(searchClass);
  }

  if( isRow(row, searchNum) ) {
    retObj.one = `${row}0`;
    retObj.two = `${row}1`;
    retObj.three = `${row}2`;
  }
  if( isColumn(column, searchNum) ) {
    retObj.one = `0${column}`;
    retObj.two = `1${column}`;
    retObj.three = `2${column}`;
  }
  if( isDiagonal(row, column, searchNum) ) {
    let diagonal = 0;
    for( let i=0; i<3; i++ ) {
      if ( simulation[i][i] === searchNum ) {
        diagonal += 1;
      }
    }
    if( diagonal === 3 ) {
      retObj.one = `00`;
      retObj.two = `11`;
      retObj.three = `22`;
    } else {
      retObj.one = `02`;
      retObj.two = `11`;
      retObj.three = `20`;
    }
  }

  const keys = Object.keys( retObj );
  const winningElements = [];
  for( let i=0; i<3; i++ ) {
    winningElements.push( document.getElementById(retObj[ keys[i] ]) );
  }

  return winningElements;
}

function isDouble(row,column, num) {
  return (isRow(row,num) && isColumn(column,num)) || (isDirectDiagonal(num) && isCounterDiagonal(num));
}

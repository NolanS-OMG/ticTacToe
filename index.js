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

// Gets the change turn button and adds functionality to it
const changeTurnButton = document.getElementById("changeTurnButton");
changeTurnButton.addEventListener( 'click', changeTurn );

// Changes the turn: "X" <---> "CIRCLE"
function changeTurn() {
  // The new turn is the opposite
  turn = !turn;
  // The computer turn is opposite from the actual turn
  computerTurn = !turn;
  // The new start turn is the actual one
  startTurn = turn;

  // Prints message depending on the turn
  if(turn) {
    messageDiv.innerText = "X TURN";
    messageDiv.className = "x-color";
  } else {
    messageDiv.innerText = "CIRCLE TURN";
    messageDiv.className = "c-color";
  }
}

// Gets the computer start cutton and adds functionality to it
const computerStartsButton = document.getElementById("computerStartsButton");
computerStartsButton.addEventListener( 'click', computerStarts);

// Makes the start move of the computer
function computerStarts() {
  // The computer turn is the initial one
  computerTurn = startTurn;
  // The computer moves
  computersMove();
}

// Get the modeButton and adds click functionality to it
const modeButton = document.getElementById("modeButton");
modeButton.addEventListener( 'click', changeMode );

// Changes game mode: "vsPlayer" <---> "vsComputer"
function changeMode() {
  // Changes the mode to the opposite
  vsPlayer = !vsPlayer;
  if( vsPlayer ) {
    // if its "vsPlayer" mode, it prints it
    modeButton.firstChild.innerText = "vs Player";
    // Hiddes the computer start button
    computerStartsButton.style.display = "none";
  } else {
    // if its "vsComputer" mode, it prints it
    modeButton.firstChild.innerText = "vs Computer";
    // Shows the computer start button
    computerStartsButton.style.display = "inline-block";
  }
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
// GOLD CIRCLE
const circleSvgStringGold = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +
                '<g id="Shape / Circle">' +
                '<circle cx="12" cy="12" r="9" stroke="#efb810" stroke-width="2" fill="none"/>' +
                '</g>' +
                '</svg>';
// GOLD X
const XSvgStringGold =  '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +
                '<g id="Menu / Close_MD">' +
                '<path id="Vector" d="M18 18L12 12M12 12L6 6M12 12L18 6M12 12L6 18" stroke="#efb810" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'+
                '</g>' +
                '</svg>';

// Container for dynamic message on screen
const messageDiv = document.getElementById('message');
messageDiv.innerText = "X TURN";
messageDiv.className = "x-color";

// This function, triggered by clicking a square, contains all the necessary game logic
function squareClick(event) {

  // If the game is finished doesnt do anything
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
  // Gets the available squares
  // (when a square is pressed, the class pointer is eliminated)
  const availableSquares = document.getElementsByClassName("pointer");

  // Clicks on any random available squares
  const clickEvent = new Event('click');
  availableSquares[ Math.floor(Math.random()*availableSquares.length) ].dispatchEvent(clickEvent);
}

// Draw X
function drawX(element) {
  // Removes the pointer
  element.classList.remove('pointer');
  // Adds the class for X and the svg to show the shape
  element.classList.add('has-x');
  element.firstChild.innerHTML = XSvgString;

  // Shows the new turn message
  messageDiv.innerText = "CIRCLE TURN";
  messageDiv.className = "c-color";

  // Sets its place on the simulation
  const row = Number(element.id.slice(0,1));
  const column = Number(element.id.slice(1,2));
  simulation[row][column] = 1;
}

// Draw circle
function drawC(element) {
  // Removes the pointer
  element.classList.remove('pointer');
  // Adds the class for circle and the avg to show the shape
  element.classList.add('has-c');
  element.firstChild.innerHTML = circleSvgString;

  // Shows the nest turn message
  messageDiv.innerText = "X TURN";
  messageDiv.className = "x-color";

  // Sets its place on the simulation
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

    // "vs Player mode"
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

    // "vs Computer mode"
    if( turn === computerTurn ) {
      // When its the computer turn
      messageDiv.innerText = "YOU LOST :(";
      endOptions("looser");
      endAnimation(row,column, "looser");
    } else {
      // When its the computer turn
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

  // If any of the diagonals gives true, it is a diagonal
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
  // winner / looser / draw color
  messageDiv.className = word + "-color";
  // Adds all square end classes
  const allSquares = Array.from( ticTacToe.children );
  for(let i=0; i<allSquares.length; i++) {
    allSquares[i].classList.remove('normal-border');
    allSquares[i].classList.remove('pointer');
    allSquares[i].classList.add(word + '-border');
  }
}

// Triggers when the games ends and its not a draw
function endAnimation(row, column, word) {
  // The number we search on the simulation
  let searchNum = -1;
  if(turn) {
    searchNum = 1;
  }
  // Gets the winning elements and adds them the classes for animations
  const {winningElements, animation} = getWinningPositions(row,column, searchNum);

  // When it is a double it has a special golden animation
  if( animation === "golden" ) {
    const allSquares = Array.from( ticTacToe.children );
    setTimeout( () => {
      messageDiv.className = "golden" + "-color";
      for(let i=0; i<allSquares.length; i++) {
        allSquares[i].classList.remove("win" + '-border');
        allSquares[i].classList.remove("looser" + '-border');
        allSquares[i].classList.add("golden" + '-border');
      }
    }, 400 );
  }
  for( let i=0; i<winningElements.length; i++ ) {
    winningElements[i].classList.add(word+"-color");
    winningElements[i].classList.add(animation);
    // When it is a double we wait 400miliseconds to set the golden color
    if( animation === "golden" ) {
      setTimeout( () => {
        winningElements[i].firstChild.innerHTML = !turn ? XSvgStringGold : circleSvgStringGold;
      }, 400 );
    }
  }
}

// Gets the positions of the winning squares that make the line
function getWinningPositions(row,column, searchNum) {
  // If it is a double, return all the X or circle positions
  // (A double, is when you win with two lines at the same time, it si only posible with 5 X or circles, so it has to be all of them)
  if( isDouble(row, column, searchNum) ) {
    let searchClass = turn ? "has-x" : "has-c";
    return {winningElements: document.getElementsByClassName(searchClass), animation: "golden"};
  }

  // Object to add the ids of the winning positions
  const idsObject = {};
  if( isRow(row, searchNum) ) {
    // Row Ids
    idsObject.one = `${row}0`;
    idsObject.two = `${row}1`;
    idsObject.three = `${row}2`;
  }
  if( isColumn(column, searchNum) ) {
    // Colums Ids
    idsObject.one = `0${column}`;
    idsObject.two = `1${column}`;
    idsObject.three = `2${column}`;
  }
  if( isDiagonal(row, column, searchNum) ) {
    let diagonal = 0;
    for( let i=0; i<3; i++ ) {
      if ( simulation[i][i] === searchNum ) {
        diagonal += 1;
      }
    }
    // Diagonal Ids
    if( diagonal === 3 ) {
      idsObject.one = `00`;
      idsObject.two = `11`;
      idsObject.three = `22`;
    } else {
      idsObject.one = `02`;
      idsObject.two = `11`;
      idsObject.three = `20`;
    }
  }

  // Gets a list of the keys
  const keys = Object.keys( idsObject );
  const winningElements = [];
  for( let i=0; i<keys.length; i++ ) {
    // Saves the 3 winning squares
    winningElements.push( document.getElementById(idsObject[ keys[i] ]) );
  }

  return {winningElements, animation: "animate"};
}

// Returns if it is a Double
function isDouble(row,column, num) {
  // If it is a row and a column or both diagonals is a double
  // (Is impossible to make a double with diagonal and row, or diagonal and column)
  return (isRow(row,num) && isColumn(column,num)) || (isDirectDiagonal(num) && isCounterDiagonal(num));
}

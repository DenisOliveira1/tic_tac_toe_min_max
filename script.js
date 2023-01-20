const X_CLASS_NAME = 'x'
const O_CLASS_NAME = 'o'
const WINNING_COMBINATIONS = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [1, 4, 7],
  [2, 5, 8],
  [3, 6, 9],
  [1, 5, 9],
  [3, 5, 7]
]

let boardMinMax = [
  ['','',''],
  ['','',''],
  ['','','']
]

const boardElement = document.getElementById('board')
const cellElements = document.querySelectorAll('[data-cell]')
const winningMessageElement = document.getElementById('winningMessage')
const winningMessageTextElement = document.querySelector('[data-winning-message-text]')
const restartButton = document.getElementById('restartButton')

let isCircleTurn

startGame()

restartButton.addEventListener('click', startGame)

function startGame() {
  isCircleTurn = false
  cleanElementCells()
  cleanBoardsMinMax()
  setBoardHoverClassOnCells()
  winningMessageElement.classList.remove('show')
}

function cleanElementCells(){
  cellElements.forEach(cell => {
    cell.classList.remove(X_CLASS_NAME)
    cell.classList.remove(O_CLASS_NAME)
    cell.removeEventListener('click', handleClick)
    cell.addEventListener('click', handleClick, { once: true })
  })
}

function cleanBoardsMinMax(){
  boardMinMax = [
    ['','',''],
    ['','',''],
    ['','','']
  ]
}


function setBoardHoverClassOnCells() {
  boardElement.classList.remove(X_CLASS_NAME)
  boardElement.classList.remove(O_CLASS_NAME)
  if (isCircleTurn) {
    boardElement.classList.add(O_CLASS_NAME)
  } else {
    boardElement.classList.add(X_CLASS_NAME)
  }
}

function handleClick(e) {
  const cell = e.target
  const currentClassName = isCircleTurn ? O_CLASS_NAME : X_CLASS_NAME
  placeMark(cell, currentClassName)
  if (checkWinner(currentClassName)) {
    endGame(false)
  } else if (isDraw()) {
    endGame(true)
  } else {
    swapTurns()
    playIA()
    swapTurns()
    setBoardHoverClassOnCells()
  }
}

function playIA(){
  const currentClassName = isCircleTurn ? O_CLASS_NAME : X_CLASS_NAME
  if(isCircleTurn){
    performBestMove()
    if (checkWinner(currentClassName)) {
      endGame(false)
    } else if (isDraw()) {
      endGame(true)
    }
  }
}

function placeMark(cell, currentClassName) {
  //console.log("placeMark.currentClassName: " + currentClassName)

  cell.classList.add(currentClassName)
  //console.log("placeMark.cell.name: " + cell.getAttribute("name"))

  var xPositon = cell.getAttribute("name").substring(0,1)
  var yPosition = cell.getAttribute("name").substring(1,2)

  updateMinMaxBoard(xPositon, yPosition, currentClassName)
}

function updateMinMaxBoard(xPositon, yPosition, currentClassName) {
  //console.log("placeMark.cell.position: " + xPositon + yPosition)
  boardMinMax[xPositon - 1][yPosition - 1] = currentClassName

  //console.log("placeMark.boardFoxMinMaxCalculation: " + boardMinMax)
}

function checkWinner(currentClass) {
  return WINNING_COMBINATIONS.some(combination => {
    return combination.every(index => {
      return cellElements[index-1].classList.contains(currentClass)
    })
  })
}

function isDraw() {
  return [...cellElements].every(cell => {
    return cell.classList.contains(X_CLASS_NAME) || cell.classList.contains(O_CLASS_NAME)
  })
}

function endGame(isDraw) {
  if (isDraw) {
    winningMessageTextElement.innerText = 'Draw!'
  } else {
    winningMessageTextElement.innerText = `${isCircleTurn ? "O's" : "X's"} wins!`
  }
  winningMessageElement.classList.add('show')
}


function swapTurns() {
  isCircleTurn = !isCircleTurn
}

function performBestMove() {
  // AI to make its turn
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      // Is the spot available?
      if (boardMinMax[i][j] == '') {
        boardMinMax[i][j] = "o";
        let score = minimax(boardMinMax, 0, false);
        boardMinMax[i][j] = '';
        ////console.log("here"+score)
        if (score > bestScore) {
          bestScore = score;
          ////console.log("score "+score)
          move = { i, j };
        }
      }
    }
  }
  boardMinMax[move.i][move.j] = "o";
  //console.log("bestMove: "+(move.i+1)+" "+(move.j+1))
  cell = document.getElementsByName((move.i+1)+""+(move.j+1))[0]
  //console.log("bestMove.cellName:" + cell.getAttribute("name"))
  placeMark(cell, O_CLASS_NAME)
}

let scores = {
  x: -1,
  o: 1,
  tie: 0
};

function minimax(boardFoxMinMaxCalculation, depth, isMaximizing) {
  let result = checkWinnerMinMax();
  if (result !== null) {
    return scores[result];
  }
  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        // Is the spot available?
        if (boardFoxMinMaxCalculation[i][j] == '') {
          boardFoxMinMaxCalculation[i][j] = "o";
          let score = minimax(boardFoxMinMaxCalculation, depth + 1, false);
          boardFoxMinMaxCalculation[i][j] = '';
          bestScore = Math.max(score, bestScore);
        }
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        // Is the spot available?
        if (boardFoxMinMaxCalculation[i][j] == '') {
          boardFoxMinMaxCalculation[i][j] = "x";
          let score = minimax(boardFoxMinMaxCalculation, depth + 1, true);
          boardFoxMinMaxCalculation[i][j] = '';
          bestScore = Math.min(score, bestScore);
        }
      }
    }
    return bestScore;
  }
}

function equals3(a, b, c) {
  return a == b && b == c && a != '';
}

function checkWinnerMinMax() {
  let winner = null;

  // horizontal
  for (let i = 0; i < 3; i++) {
    if (equals3(boardMinMax[i][0], boardMinMax[i][1], boardMinMax[i][2])) {
      winner = boardMinMax[i][0];
    }
  }

  // Vertical
  for (let i = 0; i < 3; i++) {
    if (equals3(boardMinMax[0][i], boardMinMax[1][i], boardMinMax[2][i])) {
      winner = boardMinMax[0][i];
    }
  }

  // Diagonal
  if (equals3(boardMinMax[0][0], boardMinMax[1][1], boardMinMax[2][2])) {
    winner = boardMinMax[0][0];
  }
  if (equals3(boardMinMax[2][0], boardMinMax[1][1], boardMinMax[0][2])) {
    winner = boardMinMax[2][0];
  }

  let openSpots = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (boardMinMax[i][j] == '') {
        openSpots++;
      }
    }
  }

  if (winner == null && openSpots == 0) {
    return 'tie';
  } else {
    return winner;
  }
}

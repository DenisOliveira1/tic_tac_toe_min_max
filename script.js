const X_CLASS = 'x'
const CIRCLE_CLASS = 'o'
const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]

let board2 = [
  ['','',''],
  ['','',''],
  ['','','']
]

const cellElements = document.querySelectorAll('[data-cell]')
const board = document.getElementById('board')
const winningMessageElement = document.getElementById('winningMessage')
const restartButton = document.getElementById('restartButton')
const winningMessageTextElement = document.querySelector('[data-winning-message-text]')
let circleTurn

startGame()

restartButton.addEventListener('click', startGame)

function startGame() {
  circleTurn = false
  cellElements.forEach(cell => {
    cell.classList.remove(X_CLASS)
    cell.classList.remove(CIRCLE_CLASS)
    cell.removeEventListener('click', handleClick)
    cell.addEventListener('click', handleClick, { once: true })
  })
  setBoardHoverClass()
  winningMessageElement.classList.remove('show')
}

function handleClick(e) {
  const cell = e.target
  const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS
  placeMark(cell, currentClass)
  if (checkWin(currentClass)) {
    endGame(false)
  } else if (isDraw()) {
    endGame(true)
  } else {
    swapTurns()
    setBoardHoverClass()
  }
}

function endGame(draw) {
  if (draw) {
    winningMessageTextElement.innerText = 'Draw!'
  } else {
    winningMessageTextElement.innerText = `${circleTurn ? "O's" : "X's"} Wins!`
  }
  winningMessageElement.classList.add('show')
}

function isDraw() {
  return [...cellElements].every(cell => {
    return cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS)
  })
}

function placeMark(cell, currentClass) {
  console.log("placeMark.currentClass: " + currentClass)
  cell.classList.add(currentClass)
  console.log("placeMark.cellName: " + cell.getAttribute("name"))

  var l = cell.getAttribute("name").substring(0,1)-1
  var c = cell.getAttribute("name").substring(1,2)-1
  console.log("placeMark.cellPosition: " + l + " " + c)
  board2[l][c] = currentClass
  console.log("placeMark.Board2: " + board2)
}

function swapTurns() {
  circleTurn = !circleTurn
  if(circleTurn) bestMove()
  circleTurn = !circleTurn
}

function setBoardHoverClass() {
  board.classList.remove(X_CLASS)
  board.classList.remove(CIRCLE_CLASS)
  if (circleTurn) {
    board.classList.add(CIRCLE_CLASS)
  } else {
    board.classList.add(X_CLASS)
  }
}

function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some(combination => {
    return combination.every(index => {
      return cellElements[index].classList.contains(currentClass)
    })
  })
}

// Tic Tac Toe AI with Minimax Algorithm
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/154-tic-tac-toe-minimax.html
// https://youtu.be/I64-UTORVfU
// https://editor.p5js.org/codingtrain/sketches/0zyUhZdJD

function bestMove() {
  // AI to make its turn
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      // Is the spot available?
      if (board2[i][j] == '') {
        board2[i][j] = "o";
        let score = minimax(board2, 0, false);
        board2[i][j] = '';
        //console.log("here"+score)
        if (score > bestScore) {
          bestScore = score;
          //console.log("score "+score)
          move = { i, j };
        }
      }
    }
  }
  board2[move.i][move.j] = "o";
  console.log("bestMove: "+(move.i+1)+" "+(move.j+1))
  cell = document.getElementsByName((move.i+1)+""+(move.j+1))[0]
  console.log("bestMove.cellName:" + cell.getAttribute("name"))
  placeMark(cell, CIRCLE_CLASS)
}

let scores = {
  x: -1,
  o: 1,
  tie: 0
};

function minimax(board2, depth, isMaximizing) {
  let result = checkWinner();
  if (result !== null) {
    return scores[result];
  }
  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        // Is the spot available?
        if (board2[i][j] == '') {
          board2[i][j] = "o";
          let score = minimax(board2, depth + 1, false);
          board2[i][j] = '';
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
        if (board2[i][j] == '') {
          board2[i][j] = "x";
          let score = minimax(board2, depth + 1, true);
          board2[i][j] = '';
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

function checkWinner() {
  let winner = null;

  // horizontal
  for (let i = 0; i < 3; i++) {
    if (equals3(board2[i][0], board2[i][1], board2[i][2])) {
      winner = board2[i][0];
    }
  }

  // Vertical
  for (let i = 0; i < 3; i++) {
    if (equals3(board2[0][i], board2[1][i], board2[2][i])) {
      winner = board2[0][i];
    }
  }

  // Diagonal
  if (equals3(board2[0][0], board2[1][1], board2[2][2])) {
    winner = board2[0][0];
  }
  if (equals3(board2[2][0], board2[1][1], board2[0][2])) {
    winner = board2[2][0];
  }

  let openSpots = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board2[i][j] == '') {
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

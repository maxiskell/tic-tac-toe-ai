const AI = "O";
const EMPTY = "_";
const HUMAN = "X";

let board;
let gameRun;
let currentPlayer;

const winningCombinations = [
  // horizontal
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // vertical
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // vertical
  [0, 4, 8],
  [2, 4, 6],
];

const createBoard = () => Array.from({ length: 9 }, () => EMPTY);

const info = (type) => {
  let text = "";

  switch (type) {
    case "win":
      text += currentPlayer === AI ? "AI wins" : "You win";
      break;
    case "tie":
      text += "Tie!";
      break;
    default:
      break;
  }

  document.getElementById("info").innerText = text;
};

const minimax = (board, isMaximizer) => {
  const evaluate = () => {
    for (let combination of winningCombinations) {
      const [a, b, c] = combination;

      if (board[a] === EMPTY || board[b] === EMPTY || board[c] === EMPTY) {
        continue;
      }

      if (board[a] === board[b] && board[b] === board[c]) {
        return board[a] === AI ? 1 : -1;
      }
    }

    return 0;
  };

  let score = evaluate();

  if (score !== 0) {
    return score;
  }

  if (!board.includes(EMPTY)) {
    return 0;
  }

  let best;

  if (isMaximizer) {
    best = -Infinity;

    for (let position in board) {
      if (board[position] === EMPTY) {
        board[position] = AI;

        let minimized = minimax(board, false);

        board[position] = EMPTY;

        best = Math.max(best, minimized);
      }
    }
  } else {
    best = Infinity;

    for (let position in board) {
      if (board[position] === EMPTY) {
        board[position] = HUMAN;

        let maximized = minimax(board, true);

        board[position] = EMPTY;

        best = Math.min(best, maximized);
      }
    }
  }

  return best;
};

const findBestMove = () => {
  let bestScore = -Infinity;
  let bestPosition = -1;

  for (let position in board) {
    if (board[position] === EMPTY) {
      board[position] = AI;

      let score = minimax(board, false);

      board[position] = EMPTY;

      if (score > bestScore) {
        bestScore = score;
        bestPosition = position;
      }
    }
  }

  return bestPosition;
};

const checkWinner = () => {
  for (let combination of winningCombinations) {
    const [a, b, c] = combination;

    if (board[a] === EMPTY || board[b] === EMPTY || board[c] === EMPTY) {
      continue;
    }

    if (board[a] === board[b] && board[b] === board[c]) {
      return true;
    }
  }

  return false;
};

const mark = (position) =>
  (document.getElementById(`square-${position}`).textContent = currentPlayer);

const move = (position) => {
  if (gameRun && board[position] === EMPTY) {
    board[position] = currentPlayer;

    mark(position);

    if (checkWinner()) {
      gameRun = false;
      info("win");
    } else if (!board.includes(EMPTY)) {
      gameRun = false;
      info("tie");
    } else {
      currentPlayer = currentPlayer === HUMAN ? AI : HUMAN;
      if (currentPlayer === AI) {
        move(findBestMove());
      }
    }
  }
};

const initState = () => {
  info("");
  gameRun = true;
  board = createBoard();
  currentPlayer = HUMAN;
};

const restart = () => {
  initState();

  document
    .querySelectorAll(".square")
    .forEach((square) => (square.textContent = ""));
};

const init = () => {
  initState();

  const boardContainer = document.getElementById("board");

  if (document.querySelectorAll(".square").length === 0) {
    for (let i = 0; i < board.length; i++) {
      let btn = document.createElement("button");
      btn.classList.add("square");
      btn.id = `square-${i}`;
      btn.onclick = () => move(i);
      boardContainer.appendChild(btn);
    }
  }

  document.getElementById("restart").onclick = () => restart();
};

init();

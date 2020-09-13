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

const info = (text) => (document.getElementById("info").innerText = text);

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
      info(currentPlayer + " wins!");
    } else if (!board.includes(EMPTY)) {
      gameRun = false;
      info("Tie!");
    } else {
      currentPlayer = currentPlayer === HUMAN ? AI : HUMAN;
      info(currentPlayer + " Turn");
    }
  }
};

const initState = () => {
  gameRun = true;
  board = createBoard();
  currentPlayer = HUMAN;
  info(currentPlayer + " Turn");
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

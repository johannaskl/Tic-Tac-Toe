function myFunction() {
  var element = document.body;
  element.classList.toggle("dark-mode");
}

const statusDisplay = document.querySelector(".game-status");

let gameActive = true;

let currentPlayer = "X";

let gameState = ["", "", "", "", "", "", "", "", ""];

const winningMessage = () => `Spelare ${currentPlayer} har vunnit!`;
const drawMessage = () => `Spelet blev oavgjort!`;
const currentPlayerTurn = () => `Det är ${currentPlayer} tur`;

statusDisplay.innerHTML = currentPlayerTurn();

document.querySelectorAll(".cell").forEach((cell) => cell.addEventListener("click", handleCellClick));
document.querySelector(".game-restart").addEventListener("click", handleRestartGame);

function handleCellClick(clickedCellEvent) {
  const clickedCell = clickedCellEvent.target;
  const clickedCellIndex = parseInt(clickedCell.getAttribute("cell-index"));

  if (gameState[clickedCellIndex] !== "" || !gameActive) {
    return;
  }

  handleCellPlayed(clickedCell, clickedCellIndex);
  handleResultValidation();
}

function handleCellPlayed(clickedCell, clickedCellIndex) {
  gameState[clickedCellIndex] = currentPlayer;
  clickedCell.innerHTML = currentPlayer;
}

const winningCondissions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function handleResultValidation() {
  let roundWon = false;
  let winningCombo = [];

  for (let i = 0; i <= 7; i++) {
    const winCondition = winningCondissions[i];
    let a = gameState[winCondition[0]];
    let b = gameState[winCondition[1]];
    let c = gameState[winCondition[2]];
    if (a === "" || b === "" || c === "") {
      continue;
    }
    if (a === b && b === c) {
      roundWon = true;
      winningCombo = winCondition;
      break;
    }
  }
  if (roundWon) {
    winningCombo.forEach((index) => {
      document.querySelector(`.cell[cell-index="${index}"]`).classList.add("winning-cell");
    });

    statusDisplay.innerHTML = winningMessage();
    gameActive = false;
    return;
  }

  let roundDraw = !gameState.includes("");
  if (roundDraw) {
    statusDisplay.innerHTML = drawMessage();
    gameActive = false;
    return;
  }

  handlePlayerchange();
}

function handlePlayerchange() {
  currentPlayer = currentPlayer == "X" ? "O" : "X";
  statusDisplay.innerHTML = currentPlayerTurn();
}

function handleRestartGame() {
  gameActive = true;
  currentPlayer = "X";
  gameState = ["", "", "", "", "", "", "", "", ""];
  statusDisplay.innerHTML = currentPlayerTurn();
  document.querySelectorAll(".cell").forEach((cell) => (cell.innerHTML = ""));

  document.querySelectorAll(".cell").forEach((cell) => {
    cell.innerHTML = "";
    cell.classList.remove("winning-cell");
  });
}

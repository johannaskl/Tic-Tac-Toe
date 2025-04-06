const toggleButton = document.getElementById('toggleMode');

toggleButton.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});



const statusDisplay = document.querySelector(".game-status");

let gameActive = true;
let currentPlayer = "X";
let gameState = Array(9).fill("");

const messages = {
  winning: () => `Spelare ${currentPlayer} har vunnit!`,
  draw: () => "Spelet blev oavgjort!",
  turn: () => `Det är ${currentPlayer} tur` 
};

statusDisplay.innerHTML = messages.turn();

document.querySelectorAll(".cell").forEach(cell => {
  cell.addEventListener("click", handleCellClick);
})
document.querySelector(".game-restart").addEventListener("click", handleRestartGame);

const winningConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function handleCellClick(clickedCellEvent) {
  const clickedCell = clickedCellEvent.target;
  const clickedCellIndex = parseInt(clickedCell.getAttribute("cell-index"));

  if (gameState[clickedCellIndex] !== "" || !gameActive) return;

  gameState[clickedCellIndex] = currentPlayer;
  clickedCell.innerHTML = currentPlayer;
  handleResultValidation();
}

function handleResultValidation() {
  let roundWon = false;
  for (const condition of winningConditions) {
    const [a, b, c] = condition.map(i => gameState[i]);
    if (a && a === b && a === c) {
      roundWon = true;
      condition.forEach(i => document.querySelector(`.cell[cell-index="${i}"]`).classList.add("winning-cell"));
      break;
    }
  }

  if (roundWon) {
    statusDisplay.innerHTML = messages.winning();
    gameActive = false;
    return;
  }

  if (!gameState.includes("")) {
    statusDisplay.innerHTML = messages.draw();
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusDisplay.innerHTML = messages.turn();
}

function handleRestartGame() {
  gameActive = true;
  currentPlayer = "X";
  gameState.fill("");
  statusDisplay.innerHTML = messages.turn();
  document.querySelectorAll(".cell").forEach(cell => {
    cell.innerHTML = "";
    cell.classList.remove("winning-cell");
  });
}
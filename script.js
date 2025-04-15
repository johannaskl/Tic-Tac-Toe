
// Hämta elementet som används för att växla mellan mörkt och ljust läge
const toggleButton = document.getElementById('toggleMode');

// Funktion för att uppdatera knappens text och ikon
function updateToggleButton() {
  const isDarkMode = document.body.classList.contains('dark-mode');
  toggleButton.innerHTML = isDarkMode
  ? 'Ljust läge <i class="bi bi-brightness-high"></i>'
  : 'Mörkt läge <i class="bi bi-moon"></i>';
}

// Toggle dark mode och uppdaterea knappen
toggleButton.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  updateToggleButton();
});

// Uppdatera kanppen när sidan laddas (default - ljust läge)
updateToggleButton();




// Hämta elementet där spelstatus visas
const statusDisplay = document.querySelector(".game-status");


// Initialisera spelets tillstånd: spelet är aktivt, första spelaren är "x"
let gameActive = true;
let currentPlayer = "X";

// Spelets tillstånd, en array med 9 tomma celler
let gameState = Array(9).fill("");

// Objekt som innehåller funktioner för meddelanden som ska visas i status
const messages = {
  winning: () => `Spelare ${currentPlayer} har vunnit!`,
  draw: () => "Spelet blev oavgjort!",
  turn: () => `Det är ${currentPlayer} tur` 
};

// Uppdatera status för att visa att det är första spelarens tur
statusDisplay.innerHTML = messages.turn();

// Lägg till eventlyssnare för att starta om när "börja om (game-restart)" knappen klickas på
document.querySelectorAll(".cell").forEach(cell => {
  cell.addEventListener("click", handleCellClick);
})
document.querySelector(".game-restart").addEventListener("click", handleRestartGame);

// Definiera allla vinstkombinationer
const winningConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horisontella rader
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertikala kolumner
  [0, 4, 8], [2, 4, 6]  // Diagonaler
];

// Funktion som hanterar vad som sker när en cell klickas på
function handleCellClick(clickedCellEvent) {
  const clickedCell = clickedCellEvent.target; // Hämta cellen som klickades på
  const clickedCellIndex = parseInt(clickedCell.getAttribute("cell-index")); // Hämta index för den cellen

  // Om cellen redan är ifylld eller om spelet inte är aktivt, gör ingenting
  if (gameState[clickedCellIndex] !== "" || !gameActive) return;

  // Uppdatera spelets tillstånd med den aktuella spelaren symbol
  gameState[clickedCellIndex] = currentPlayer;
  clickedCell.innerHTML = currentPlayer;  // sätt spelarens symbol i den valda cellen

  // Kontrollera om det finns en vinnare eller om det är oavgjort
  handleResultValidation();

  // Om spelet fortfarande är aktivt och det är datorns tur
  if (gameActive && currentPlayer === "O") {
    setTimeout(computerMove, 300); // Vänta 0.3 sek för mer naturligt spel
  }
}


//Datorn drag - välj en slupmässig ledig cell
function computerMove() {
  const availableCells = gameState
    .map((value, index) => value === "" ? index : null)
    .filter(index => index !== null);

  if (availableCells.length === 0) return;

  const randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
  const cell = document.querySelector(`.cell[cell-index="${randomIndex}"]`);

  gameState[randomIndex] = "0";
  cell.innerHTML = "0";

  handleResultValidation();
}


// Funktion att kontrollera om spelet har en vinnande tillstånd eller om det är oavgjort
function handleResultValidation() {
  let roundWon = false;

  // Gå ingen varje vinstkombination för att kontrollera om någon är uppfylld
  for (const condition of winningConditions) {
    const [a, b, c] = condition.map(i => gameState[i]); // Hämta värden för de tre cellerna i vinstkombinationen
    
    // Om någon cell är tom, hoppa över
    if (a && a === b && a === c) {
      roundWon = true; // Om alla tre celler har samma värde, då har vi en vinnare
      condition.forEach(i => document.querySelector(`.cell[cell-index="${i}"]`).classList.add("winning-cell")); // Markera vinnande celler
      break; // Avsluta loopen när vi har en vinnare
    }
  }

  // Om en spelare har vunnit, uppdatera status och avsluta spelet
  if (roundWon) {
    statusDisplay.innerHTML = messages.winning();
    gameActive = false;
    return;
  }

  // Om alla celler är ifyllda men ingen har vunnit. avsluta spelet som oavgjort
  if (!gameState.includes("")) {
    statusDisplay.innerHTML = messages.draw();
    gameActive = false;
    return;
  }

  // Om ingen har vunnit och det finns drag kvar, byt spelare
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusDisplay.innerHTML = messages.turn();
}

// Funktion som startar om spelet och återställer alla tillstånd
function handleRestartGame() {
  gameActive = true; // återställ spelet till aktivt
  currentPlayer = "X"; // återställ den första spelaren
  gameState.fill(""); // Återställ spelets tillstånd ( alla celler är tomma )
  statusDisplay.innerHTML = messages.turn(); // uppdatera status för den örsta spelarens tur

  // Rensa innehållet i alla celer och ta bort eventuella vinnande celler
  document.querySelectorAll(".cell").forEach(cell => {
    cell.innerHTML = "";
    cell.classList.remove("winning-cell");
  });
}
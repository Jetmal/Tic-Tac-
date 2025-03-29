const board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let scores = { X: 0, O: 0 };
let aiMode = "easy"; // 'easy' or 'hard'
const cells = document.querySelectorAll(".cell");
const statusDisplay = document.getElementById("status");
const playerXScore = document.getElementById("player-x-score");
const playerOScore = document.getElementById("player-o-score");
const aiToggle = document.getElementById("ai-toggle");
const resetButton = document.getElementById("reset");

// Initialize game
function initGame() {
  board.fill("");
  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("x", "o", "win");
  });
  currentPlayer = "X";
  statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
  if (currentPlayer === "O" && aiMode !== "off") aiMove();
}

// Handle cell click
function handleCellClick(e) {
  const index = e.target.dataset.index;
  if (board[index] === "" && !checkWinner()) {
    board[index] = currentPlayer;
    e.target.textContent = currentPlayer;
    e.target.classList.add(currentPlayer.toLowerCase());
    
    if (checkWinner()) {
      scores[currentPlayer]++;
      updateScores();
      highlightWinningCells();
      statusDisplay.textContent = `Player ${currentPlayer} wins!`;
    } else if (board.every(cell => cell !== "")) {
      statusDisplay.textContent = "Game Draw!";
    } else {
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
      if (currentPlayer === "O" && aiMode !== "off") setTimeout(aiMove, 500);
    }
  }
}

// AI Move (Simple vs Hard)
function aiMove() {
  let index;
  if (aiMode === "easy") {
    // Easy AI: Random move
    const emptyCells = board.map((cell, i) => cell === "" ? i : null).filter(val => val !== null);
    index = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  } else {
    // Hard AI: Minimax algorithm (simplified)
    index = bestMove();
  }
  
  if (index !== undefined) {
    board[index] = "O";
    const cell = document.querySelector(`.cell[data-index="${index}"]`);
    cell.textContent = "O";
    cell.classList.add("o");
    
    if (checkWinner()) {
      scores.O++;
      updateScores();
      highlightWinningCells();
      statusDisplay.textContent = "AI (O) wins!";
    } else if (board.every(cell => cell !== "")) {
      statusDisplay.textContent = "Game Draw!";
    } else {
      currentPlayer = "X";
      statusDisplay.textContent = "Player X's turn";
    }
  }
}

// Minimax for Hard AI (simplified)
function bestMove() {
  // Simplified version - blocks wins and takes center/corners first
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];
  
  // 1. Check for winning move
  for (let line of lines) {
    const [a, b, c] = line;
    if (board[a] === "O" && board[a] === board[b] && board[c] === "") return c;
    if (board[a] === "O" && board[a] === board[c] && board[b] === "") return b;
    if (board[b] === "O" && board[b] === board[c] && board[a] === "") return a;
  }
  
  // 2. Block opponent's winning move
  for (let line of lines) {
    const [a, b, c] = line;
    if (board[a] === "X" && board[a] === board[b] && board[c] === "") return c;
    if (board[a] === "X" && board[a] === board[c] && board[b] === "") return b;
    if (board[b] === "X" && board[b] === board[c] && board[a] === "") return a;
  }
  
  // 3. Take center or corners
  if (board[4] === "") return 4;
  const corners = [0, 2, 6, 8];
  const emptyCorners = corners.filter(i => board[i] === "");
  if (emptyCorners.length > 0) return emptyCorners[Math.floor(Math.random() * emptyCorners.length)];
  
  // 4. Random move
  const emptyCells = board.map((cell, i) => cell === "" ? i : null).filter(val => val !== null);
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

// Check winner
function checkWinner() {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];
  return winPatterns.some(pattern => 
    pattern.every(index => board[index] === currentPlayer)
  );
}

// Highlight winning cells
function highlightWinningCells() {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  
  winPatterns.forEach(pattern => {
    if (pattern.every(index => board[index] === currentPlayer)) {
      pattern.forEach(index => {
        document.querySelector(`.cell[data-index="${index}"]`).classList.add("win");
      });
    }
  });
}

// Update scoreboard
function updateScores() {
  playerXScore.textContent = `X: ${scores.X}`;
  playerOScore.textContent = `O: ${scores.O}`;
}

// Toggle AI difficulty
aiToggle.addEventListener("click", () => {
  aiMode = aiMode === "easy" ? "hard" : "easy";
  aiToggle.textContent = `AI: ${aiMode === "easy" ? "Easy" : "Hard"}`;
  initGame();
});

// Reset game
resetButton.addEventListener("click", () => {
  scores = { X: 0, O: 0 };
  updateScores();
  initGame();
});

// Cell click event
cells.forEach(cell => cell.addEventListener("click", handleCellClick));

// Initialize first game
initGame();
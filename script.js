let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = false;
let gameMode = null; // "player" or "computer"

const statusDisplay = document.getElementById("status");
const cells = document.querySelectorAll(".cell");

// Celebration canvas
const canvas = document.getElementById("celebration");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let confetti = [];
let fireworks = [];

// ----------------- Game Functions -----------------
function setMode(mode) {
  gameMode = mode;
  resetGame(); // reset board
  gameActive = true;
  currentPlayer = "X";
  statusDisplay.textContent =
    mode === "player" ? "Player X's turn" : "You are X. Computer is O.";
}

function handleCellClick(e) {
  const index = e.target.dataset.index;

  if (!gameActive || board[index] !== "") return;

  makeMove(index, currentPlayer);

  if (checkWin()) {
    statusDisplay.textContent = `${currentPlayer} Wins! 🎉`;
    gameActive = false;
    launchCelebration();
    return;
  } else if (!board.includes("")) {
    statusDisplay.textContent = "It's a Draw!";
    gameActive = false;
    return;
  }

  // Switch player
  currentPlayer = currentPlayer === "X" ? "O" : "X";

  if (gameMode === "player") {
    statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
  } else if (gameMode === "computer" && currentPlayer === "O") {
    statusDisplay.textContent = "Computer's turn...";
    setTimeout(computerMove, 500);
  }
}

function makeMove(index, player) {
  board[index] = player;
  cells[index].textContent = player;
}

function computerMove() {
  let available = board.map((val, i) => val === "" ? i : null).filter(v => v !== null);
  if (available.length === 0) return;

  let randomIndex = available[Math.floor(Math.random() * available.length)];
  makeMove(randomIndex, "O");

  if (checkWin()) {
    statusDisplay.textContent = "Computer Wins! 🤖";
    gameActive = false;
    launchCelebration();
    return;
  } else if (!board.includes("")) {
    statusDisplay.textContent = "It's a Draw!";
    gameActive = false;
    return;
  }

  currentPlayer = "X";
  statusDisplay.textContent = "Your turn!";
}

function checkWin() {
  const winningCombos = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];

  for (let combo of winningCombos) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      combo.forEach(i => cells[i].classList.add("winning-cell"));
      return true;
    }
  }
  return false;
}

function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = gameMode !== null;
  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("winning-cell");
  });
  statusDisplay.textContent = gameMode
    ? (gameMode === "player" ? "Player X's turn" : "You are X. Computer is O.")
    : "Choose a mode to start!";
}

// ----------------- Celebration Effects -----------------
class Particle {
  constructor(x, y, color, size, speed, angle, gravity = 0.05, fade = 0.01) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = size;
    this.speed = speed;
    this.angle = angle;
    this.alpha = 1;
    this.gravity = gravity;
    this.fade = fade;
  }
  update() {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed + this.gravity;
    this.alpha -= this.fade;
  }
  draw() {
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

function launchCelebration() {
  // clear old particles
  fireworks = [];
  confetti = [];

  // Fireworks burst
  for (let i = 0; i < 3; i++) {
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height / 2;
    for (let j = 0; j < 60; j++) {
      fireworks.push(new Particle(
        x, y,
        `hsl(${Math.random() * 360}, 100%, 50%)`,
        Math.random() * 3 + 2,
        Math.random() * 6 + 2,
        Math.random() * Math.PI * 2,
        0.05,
        0.015
      ));
    }
  }

  // Confetti rain
  for (let i = 0; i < 120; i++) {
    confetti.push(new Particle(
      Math.random() * canvas.width,
      -20,
      `hsl(${Math.random() * 360}, 100%, 50%)`,
      Math.random() * 4 + 2,
      Math.random() * 1.5 + 0.5,
      Math.PI / 2 + (Math.random() * 0.5 - 0.25),
      0.05,
      0.004
    ));
  }
}

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  fireworks.forEach((p, i) => {
    p.update();
    p.draw();
    if (p.alpha <= 0) fireworks.splice(i, 1);
  });

  confetti.forEach((p, i) => {
    p.update();
    p.draw();
    if (p.alpha <= 0 || p.y > canvas.height + 20) confetti.splice(i, 1);
  });
}
animate();

cells.forEach(cell => cell.addEventListener("click", handleCellClick));

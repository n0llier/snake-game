//Define game and context
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

class SnakePart {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

//Set loop refresh sequencies
let speed = 7;

//Set size of the board tiles and where start the snake (middle here)
let tileCount = 20;
let tileSize = canvas.width / tileCount - 2;

let headX = 10;
let headY = 10;

const snakeParts = [];
let tailLength = 2;

let xVelocity = 0;
let yVelocity = 0;

// Set Apples <position></position>
let appleX = 5;
let appleY = 5;

// Game loop
function drawGame() {
  clearScreen();
  changeSnakePosition();
  let result = isGameOver();
  if (result) {
    return;
  }
  checkAppleCollision();
  drawApple();
  drawSnake();
  setTimeout(drawGame, 1000 / speed);
}

function isGameOver() {
  let gameOver = false;

  if (yVelocity === 0 && xVelocity === 0) {
    return false;
  }

  // Wall collision
  if (headX < 0) {
    gameOver = true;
  } else if (headX === tileCount) {
    gameOver = true;
  } else if (headY < 0) {
    gameOver = true;
  } else if (headY === tileCount) {
    gameOver = true;
  }

  for (let i = 0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
    if (part.x === headX && part.y === headY) {
      gameOver = true;
      break;
    }
  }

  if (gameOver) {
    ctx.fillStyle = "white";
    ctx.font = "68px Open-sans";
    ctx.fillText("☠️", canvas.width / 2.4, canvas.height / 2);

    ctx.fillStyle = "#3c4043";
    ctx.font = "28px sans-serif";
    ctx.fillText("Game Over!", canvas.width / 3.2, canvas.height / 1.6);

    document.getElementById("panel").classList.add("is-active");
  }
  return gameOver;
}

function clearScreen() {
  ctx.fillStyle = "#202124";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
  ctx.fillStyle = "white";
  ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);

  ctx.fillStyle = "#3c4043";

  for (let i = 0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
    ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
  }

  snakeParts.push(new SnakePart(headX, headY));

  if (snakeParts.length > tailLength) {
    snakeParts.shift();
  }
}

function changeSnakePosition() {
  headX = headX + xVelocity;
  headY = headY + yVelocity;
  hasMoved = true;
}

function drawApple() {
  ctx.fillStyle = "#00a6fc";
  ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize);
}

//Set up score
const displayScore = document.getElementById("score");
let score = parseInt(displayScore.textContent);

function checkAppleCollision() {
  if (appleX === headX && appleY === headY) {
    appleX = Math.floor(Math.random() * tileCount);
    appleY = Math.floor(Math.random() * tileCount);
    tailLength++;
    score++;
    displayScore.textContent = score;
  }
}

// Define key detection

document.body.addEventListener("keydown", keyDown);

function keyDown(event) {
  if (!hasMoved) {
    return;
  }
  // If up key pressed
  if (event.keyCode === 38) {
    if (yVelocity === 1) {
      return;
    }
    hasMoved = false;
    yVelocity = -1;
    xVelocity = 0;
  }
  // If down key pressed
  if (event.keyCode === 40) {
    if (yVelocity === -1) {
      return;
    }
    yVelocity = 1;
    xVelocity = 0;
    hasMoved = false;
  }
  // If left key pressed
  if (event.keyCode === 37) {
    if (xVelocity === 1) {
      return;
    }
    yVelocity = 0;
    xVelocity = -1;
    hasMoved = false;
  }
  // If down right pressed
  if (event.keyCode === 39) {
    if (xVelocity === -1) {
      return;
    }
    yVelocity = 0;
    xVelocity = +1;
    hasMoved = false;
  }
}

function resetGame() {
  headX = 10;
  headY = 10;

  snakeParts.splice(0, snakeParts.length);
  tailLength = 2;

  xVelocity = 0;
  yVelocity = 0;

  appleX = 5;
  appleY = 5;

  document.getElementById("panel").classList.remove("is-active");

  drawGame();
}

document.getElementById("retry").addEventListener("click", resetGame);

drawGame();

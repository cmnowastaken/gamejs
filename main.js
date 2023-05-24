// Name: Εlliott Bell
// Date: 23/5/23
// Iteration 1

let ctx;
const CANVASWIDTH = 500;
const CANVASHEIGHT = 500;
const PLAYER_WIDTH = 20;
const PLAYER_HEIGHT = 30;
const PROJ_WIDTH = 5;
const PROJ_HEIGHT = 5;
let projY = playerY;
let projX = playerX + PLAYER_WIDTH / 2;
let playerX = CANVASWIDTH / 2;
let playerY = CANVASHEIGHT - 50;
let playerColor = "#45A1E9";

const startCanvas = () => {
  ctx = document.getElementById("canvas").getContext("2d");
  console.log("canvas started");
  timer = setInterval(updateCanvas, 1000 / 60);
};

const updateCanvas = () => {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, CANVASWIDTH, CANVASHEIGHT);
  ctx.fillStyle = "green";
  ctx.fillRect(playerX, playerY, PLAYER_WIDTH, PLAYER_HEIGHT);
  movePlayer();
};

const keyPressed = (keyboardEvent) => {
  let keyPressed = keyboardEvent.key;
  if (keyPressed == "a") {
    leftPressed = true;
  } else if (keyPressed == "d") {
    rightPressed = true;
  } else if (keyPressed == "space") {
    drawProjectile();
  }
};

window.addEventListener("keydown", keyPressed);

const keyDepressed = (keyboardEvent) => {
  let keyDepressed = keyboardEvent.key;
  if (keyDepressed == "a") {
    leftPressed = false;
  } else if (keyDepressed == "d") {
    rightPressed = false;
  }
};

const movePlayer = () => {
  const playerSpeed = Math.PI / (Math.PI / 2);
  if (leftPressed) {
    playerX -= playerSpeed;
  } else if (rightPressed) {
    playerX += playerSpeed;
  }
};

const drawProjectile = () => {
  ctx.fillRect(projX, projY, PROJ_WIDTH, PROJ_HEIGHT);
};

window.addEventListener("keyup", keyDepressed);

startCanvas();

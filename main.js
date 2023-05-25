// Name: Εlliott Bell
// Date: 23/5/23
// Iteration 2

// Declaring the variables that will be used

let ctx;
const CANVASWIDTH = 500;
const CANVASHEIGHT = 500;
const PLAYER_WIDTH = 20;
const PLAYER_HEIGHT = 30;
const PROJ_WIDTH = 5;
const PROJ_HEIGHT = 5;
let playerX = CANVASWIDTH / 2;
let playerY = CANVASHEIGHT - 50;
let projY = playerY;
let projX = playerX + PLAYER_WIDTH / 2;
let playerColor = "#45A1E9";
let leftPressed;
let rightPressed;

// starting the canvas and making the framerate 60fps

const startCanvas = () => {
  ctx = document.getElementById("canvas").getContext("2d");
  console.log("canvas started");
  timer = setInterval(updateCanvas, 1000 / 60);
};

// drawing the player and background 60 times/second in order to make smooth movement

const updateCanvas = () => {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, CANVASWIDTH, CANVASHEIGHT);
  ctx.fillStyle = "green";
  ctx.fillRect(playerX, playerY, PLAYER_WIDTH, PLAYER_HEIGHT);
  movePlayer();
};

const drawProjectile = () => {
  ctx.fillStyle = "white";
  ctx.fillRect(projX, projY, PROJ_WIDTH, PROJ_HEIGHT);
};

// logging which keys were pressed in order to move or shoot projectiles

const keyPressed = (keyboardEvent) => {
  let keyPressed = keyboardEvent.key;
  if (keyPressed == "a") {
    leftPressed = true;
    console.log(keyboardEvent.key);
  } else if (keyPressed == "d") {
    rightPressed = true;
    console.log(keyboardEvent.key);
  } else if (keyPressed == " ") {
    console.log("space");
    drawProjectile();
  }
};

window.addEventListener("keydown", keyPressed);

// figuring out when keys are not pressed so that the character stops moving

const keyDepressed = (keyboardEvent) => {
  let keyDepressed = keyboardEvent.key;
  if (keyDepressed == "a") {
    leftPressed = false;
  } else if (keyDepressed == "d") {
    rightPressed = false;
  }
};

window.addEventListener("keyup", keyDepressed);

// taking the info from the keyPressed function and using it to move the player

const movePlayer = () => {
  const playerSpeed = Math.PI / (Math.PI / 2);
  if (leftPressed) {
    playerX -= playerSpeed;
    if (playerX < -PLAYER_WIDTH / 2) {
      playerX = CANVASWIDTH - PLAYER_WIDTH / 2;
    }
  } else if (rightPressed) {
    playerX += playerSpeed;
    if (playerX > CANVASWIDTH - PLAYER_WIDTH / 2) {
      playerX = -PLAYER_WIDTH / 2;
    }
  }
};

startCanvas();

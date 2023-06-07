// Name: Εlliott Bell
// Date: 23/5/23
// Iteration 2

// Declaring the variables that will be used

let ctx;
const CANVASWIDTH = 500;
const CANVASHEIGHT = 500;
const PLAYER_WIDTH = 35;
const PLAYER_HEIGHT = 35;
const PLAYER_IMAGE = new Image();
PLAYER_IMAGE.src = "ship_v1.png";
const PROJ_IMAGE = new Image();
PROJ_IMAGE.src = "bullet.png";
const BASIC_ENEMY_IMAGE = new Image();
BASIC_ENEMY_IMAGE.src = "enemyshipdefault.png";
const PROJ_WIDTH = 5;
const PROJ_HEIGHT = 10;
const PROJ_SPEED = 5;
let playerX = CANVASWIDTH / 2;
let playerY = CANVASHEIGHT - 50;
let projY = playerY;
let projectileArray = [];
const keysPressed = {};
let basicEnemyArray = [];
let basicEnemyNumber = 0;

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
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(PLAYER_IMAGE, playerX, playerY, PLAYER_WIDTH, PLAYER_HEIGHT);
  movePlayer();
  drawProjectiles();
};

const movePlayer = () => {
  const playerSpeed = Math.PI / (Math.PI / 2); // lol
  if (keysPressed["a"]) {
    playerX -= playerSpeed;
    if (playerX < -PLAYER_WIDTH / 2) {
      playerX = CANVASWIDTH - PLAYER_WIDTH / 2;
    }
  }
  if (keysPressed["d"]) {
    playerX += playerSpeed;
    if (playerX > CANVASWIDTH - PLAYER_WIDTH / 2) {
      playerX = -PLAYER_WIDTH / 2;
    }
  }
};

const spawnL1Enemies = () => {
  if (basicEnemyNumber < 4) {
    basicEnemyArray.push(new Enemy(enemySpawnX, enemySpawnY));
    basicEnemyNumber++;
  }
  for (const enemy of basicEnemyArray) {
    ctx.drawImage(BASIC_ENEMY_IMAGE, enemySpawnX, enemySpawnY);
  }
};

const drawProjectiles = () => {
  for (const projectile of projectileArray) {
    console.log(projectile);
    ctx.drawImage(
      PROJ_IMAGE,
      projectile.x,
      projectile.y,
      PROJ_WIDTH,
      PROJ_HEIGHT
    );
    projectile.y -= PROJ_SPEED;
  }
};

// logging which keys were pressed in order to move or shoot projectiles

const keyPressed = (keyboardEvent) => {
  keysPressed[keyboardEvent.key] = true;
};

window.addEventListener("keydown", keyPressed);

// figuring out when keys are not pressed so that the character stops moving

const keyUp = (keyboardEvent) => {
  delete keysPressed[keyboardEvent.key];
  if (keyboardEvent.key == " ") {
    projectileArray.push(
      new Projectile(playerX + PLAYER_WIDTH / 2 - PROJ_WIDTH / 2, playerY)
    );
  }
};

window.addEventListener("keyup", keyUp);

class Projectile {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  moveProjectile() {
    this.y -= PROJ_SPEED;
  }
}

class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

// taking the info from the keyPressed function and using it to move the player

startCanvas();

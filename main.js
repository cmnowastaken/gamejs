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
const L1_ENEMY_SPAWN_X = 250;
const L1_ENEMY_SPAWN_Y = 150;
const BASIC_ENEMY_HEIGHT = 30;
const BASIC_ENEMY_WIDTH = 30;
const L1_ENEMY_CIRCLE_RADIUS = 50;
const TOTAL_L1_ENEMY_COUNT = 4;

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
  moveL1Enemies();
  renderL1Enemies();
  basicEnemyHit();
  removeRedundantProjectiles();
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

const spawnNewEnemy = () => {
  basicEnemyArray.push(
    new Enemy(
      L1_ENEMY_SPAWN_X,
      L1_ENEMY_SPAWN_Y + L1_ENEMY_CIRCLE_RADIUS,
      BASIC_ENEMY_HEIGHT,
      BASIC_ENEMY_WIDTH,
      0
    )
  );
};

const moveL1Enemies = () => {
  for (const enemy of basicEnemyArray) {
    enemy.pos += 0.02;
    enemy.x = -Math.sin(enemy.pos) * L1_ENEMY_CIRCLE_RADIUS + L1_ENEMY_SPAWN_X;
    enemy.y = Math.cos(enemy.pos) * L1_ENEMY_CIRCLE_RADIUS + L1_ENEMY_SPAWN_Y;
  }

  const lastEnemy = basicEnemyArray.at(-1);
  if (
    lastEnemy.pos >= (2 * Math.PI) / TOTAL_L1_ENEMY_COUNT &&
    basicEnemyArray.length < 4
  ) {
    spawnNewEnemy();
  }
};

const renderL1Enemies = () => {
  for (const enemy of basicEnemyArray) {
    ctx.drawImage(
      BASIC_ENEMY_IMAGE,
      enemy.x,
      enemy.y,
      BASIC_ENEMY_HEIGHT,
      BASIC_ENEMY_WIDTH
    );
  }
};

const drawProjectiles = () => {
  for (const projectile of projectileArray) {
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

const basicEnemyHit = () => {
  for (const projectile of projectileArray) {
    for (const enemy of basicEnemyArray) {
      if (projectile.checkEnemyCollision(enemy)) {
        const projIndex = projectileArray.indexOf(projectile);
        const enemyIndex = basicEnemyArray.indexOf(enemy);
        basicEnemyArray.splice(enemyIndex, 1);
        projectileArray.splice(projIndex, 1);
      }
      // die
    }
  }
};

const removeRedundantProjectiles = () => {
  for (const projectile of projectileArray) {
    if (projectile.y < 0) {
      const projIndex = projectileArray.indexOf(projectile);
      projectileArray.splice(projIndex, 1);
    }
  }
};

class Projectile {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  moveProjectile() {
    this.y -= PROJ_SPEED;
  }
  checkEnemyCollision(enemy) {
    return (
      this.x > enemy.x &&
      this.x < enemy.x + enemy.width &&
      this.y > enemy.y &&
      this.y < enemy.y + enemy.height
    );
  }
}

class Enemy {
  constructor(x, y, width, height, pos) {
    this.x = x;
    this.y = y;
    this.pos = pos;
    this.height = height;
    this.width = width;
  }
}

// taking the info from the keyPressed function and using it to move the player

startCanvas();
spawnNewEnemy();

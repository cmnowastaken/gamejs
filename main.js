// Name: Εlliott Bell
// Game: Cosmos Intruders

// Declaring the variables that will be used

let ctx;
let player;
const CANVASWIDTH = 500; // setting the canvas width and height
const CANVASHEIGHT = 500;

const PLAYER_WIDTH = 35; // setting player width and height
const PLAYER_HEIGHT = 35;

const PLAYER_IMAGE = new Image(); // setting the images that will be used in the game
PLAYER_IMAGE.src = "ship_v1.png";
const PROJ_IMAGE = new Image();
PROJ_IMAGE.src = "bullet.png";
const BASIC_ENEMY_IMAGE = new Image();
BASIC_ENEMY_IMAGE.src = "enemyshipdefault.png";
const HEART_IMAGE = new Image();
HEART_IMAGE.src = "playerheart.png";
const ENEMY_PROJ_IMAGE = new Image();
ENEMY_PROJ_IMAGE.src = "enemybullet.png";

const PROJ_WIDTH = 5; //projectile sizing and speed
const PROJ_HEIGHT = 10;
const PROJ_SPEED = 5;

let playerX = CANVASWIDTH / 2; // setting player x and y position
let playerY = CANVASHEIGHT - 50;

let projY = playerY; // original projectile position
let projectileArray = []; // the array of projectiles that will be pushed to and removed from when space is pressed
const keysPressed = {}; // logging which keys are pressed
let L1EnemyArray = []; // setting the array of enemies
const L1_ENEMY_SPAWN_X = 250; // setting the original enemy spawn positions
const L1_ENEMY_SPAWN_Y = 150;
const BASIC_ENEMY_HEIGHT = 30; // basic enemy sizing
const BASIC_ENEMY_WIDTH = 30;
const L1_ENEMY_CIRCLE_RADIUS = 50; // sizing the circle which the enemies spin around
const TOTAL_L1_ENEMY_COUNT = 4; // setting the total number of enemies in the first level
let L1EnemiesSpawned = 0; // this variable increases as more enemies are pushed to the array
let hearts = 5;
let enemyProjectileArray = [];

// starting the canvas and making the framerate 60fps

const startCanvas = () => {
  ctx = document.getElementById("canvas").getContext("2d");
  console.log("canvas started");
  player = new Player(
    PLAYER_IMAGE,
    playerX,
    playerY,
    PLAYER_WIDTH,
    PLAYER_HEIGHT,
    0
  );

  for (let i = 0; i < TOTAL_L1_ENEMY_COUNT; i++) {
    spawnNewEnemy();
  }

  timer = setInterval(updateCanvas, 1000 / 60);
};

// drawing the various graphics and background as well as calling functions 60 times/second in order to make smooth movement

const updateCanvas = () => {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, CANVASWIDTH, CANVASHEIGHT);
  ctx.imageSmoothingEnabled = false;
  movePlayer();
  drawProjectiles();
  moveL1Enemies();
  renderL1Enemies();
  basicEnemyHit();
  removeRedundantProjectiles();
  drawL1EnemyProjectiles();
  moveL1EnemyProjectiles();
  playerHit();
  drawPlayer();

  const lastEnemy = L1EnemyArray.at(-1);
  if (
    lastEnemy &&
    lastEnemy.pos >= (2 * Math.PI) / TOTAL_L1_ENEMY_COUNT &&
    L1EnemyArray.length < 4
  ) {
    spawnNewEnemy();
  }
};

const drawPlayer = () => {
  ctx.drawImage(player.image, player.x, player.y, player.width, player.height);
};

// this function is to move the player using the keysPressed variable

const movePlayer = () => {
  const playerSpeed = Math.PI / (Math.PI / 2); // setting player speed to 2
  if (keysPressed["a"]) {
    // making the player move left when A is pressed
    player.x -= playerSpeed;
    if (player.x < -PLAYER_WIDTH / 2) {
      // making the player wrap around the screen
      player.x = CANVASWIDTH - PLAYER_WIDTH / 2;
    }
  }
  if (keysPressed["d"]) {
    // ensuring the player moves right when D is pressed
    player.x += playerSpeed;
    if (player.x > CANVASWIDTH - PLAYER_WIDTH / 2) {
      player.x = -PLAYER_WIDTH / 2;
    }
  }
};

const spawnNewEnemy = () => {
  if (L1EnemiesSpawned >= TOTAL_L1_ENEMY_COUNT) return;
  const initialPos = ((2 * Math.PI) / TOTAL_L1_ENEMY_COUNT) * L1EnemiesSpawned;

  L1EnemyArray.push(
    new Enemy(
      L1_ENEMY_SPAWN_X,
      L1_ENEMY_SPAWN_Y + L1_ENEMY_CIRCLE_RADIUS,
      BASIC_ENEMY_HEIGHT,
      BASIC_ENEMY_WIDTH,
      initialPos
    )
  );
  L1EnemiesSpawned++;
};

const moveL1Enemies = () => {
  for (const enemy of L1EnemyArray) {
    enemy.pos += 0.03;
    enemy.x = -Math.sin(enemy.pos) * L1_ENEMY_CIRCLE_RADIUS + L1_ENEMY_SPAWN_X;
    enemy.y = Math.cos(enemy.pos) * L1_ENEMY_CIRCLE_RADIUS + L1_ENEMY_SPAWN_Y;
    enemy.tryShoot();
  }
};

const renderL1Enemies = () => {
  for (const enemy of L1EnemyArray) {
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

const drawL1EnemyProjectiles = () => {
  for (const projectile of enemyProjectileArray) {
    ctx.drawImage(
      ENEMY_PROJ_IMAGE,
      projectile.x,
      projectile.y,
      PROJ_WIDTH,
      PROJ_HEIGHT
    );
  }
};

const moveL1EnemyProjectiles = () => {
  for (const projectile of enemyProjectileArray) {
    projectile.moveL1EnemyProjectile();
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
      new Projectile(player.x + PLAYER_WIDTH / 2 - PROJ_WIDTH / 2, player.y)
    );
  }
};

window.addEventListener("keyup", keyUp);

const basicEnemyHit = () => {
  for (const projectile of projectileArray) {
    for (const enemy of L1EnemyArray) {
      if (projectile.checkEnemyCollision(enemy)) {
        const projIndex = projectileArray.indexOf(projectile);
        const enemyIndex = L1EnemyArray.indexOf(enemy);
        L1EnemyArray.splice(enemyIndex, 1);
        projectileArray.splice(projIndex, 1);
      } // die
    }
  }
};

const playerHit = () => {
  for (const L1EnemyProjectile of enemyProjectileArray) {
    if (L1EnemyProjectile.checkPlayerCollision(player)) {
      const enemyProjIndex = enemyProjectileArray.indexOf(L1EnemyProjectile);
      enemyProjectileArray.splice(enemyProjIndex, 1);
      hearts--;
      console.log(hearts);
    } // die
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
    this.canShoot = true;
  }
  tryShoot() {
    if (!this.canShoot) return;
    enemyProjectileArray.push(
      new L1EnemyProjectile(
        this.x + BASIC_ENEMY_WIDTH / 2 - PROJ_WIDTH / 2,
        this.y
      )
    );

    this.canShoot = false; // Prevents further shooting
    const shootingDelay = Math.floor(Math.random() * 2000) + 1000;
    setTimeout(() => {
      this.canShoot = true;
    }, shootingDelay);
  }
}

class Player {
  constructor(image, x, y, width, height, pos) {
    this.image = image;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.pos = pos;
  }
}

class L1EnemyProjectile {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  moveL1EnemyProjectile() {
    this.y += PROJ_SPEED;
  }
  checkPlayerCollision(player) {
    return (
      this.x > player.x &&
      this.x < player.x + player.width &&
      this.y > player.y &&
      this.y < player.y + player.height
    );
  }
}

startCanvas();
spawnNewEnemy();

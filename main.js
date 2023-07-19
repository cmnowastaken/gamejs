// Name: Εlliott Bell
// Game: Cosmos Intruders

// Declaring the variables that will be used

let ctx;
let player;
const CANVASWIDTH = 500;
const CANVASHEIGHT = 500;

const PLAYER_IMAGE = new Image();
PLAYER_IMAGE.src = "ship_v1.png";
const PROJ_IMAGE = new Image();
PROJ_IMAGE.src = "bullet.png";
const BASIC_ENEMY_IMAGE = new Image();
BASIC_ENEMY_IMAGE.src = "enemyshipdefault.png";
const HEART_IMAGE = new Image();
HEART_IMAGE.src = "playerheart.png";
const ENEMY_PROJ_IMAGE = new Image();
ENEMY_PROJ_IMAGE.src = "enemybullet.png";

const PROJ_WIDTH = 5;
const PROJ_HEIGHT = 10;
const PROJ_SPEED = 5;

let playerX = CANVASWIDTH / 2;
let playerY = CANVASHEIGHT - 50;

const PLAYER_WIDTH = 35;
const PLAYER_HEIGHT = 35;

const HEART_WIDTH = 25;
const HEART_HEIGHT = 25;

let heartX = CANVASWIDTH - 40;
const HEART_Y = 40 - HEART_HEIGHT;

let projY = playerY;
let projectileArray = [];
const keysPressed = {};
let L1EnemyArray = [];
const L1_ENEMY_SPAWN_X = 250;
const L1_ENEMY_SPAWN_Y = 150;
const L1_ENEMY_CIRCLE_RADIUS = 50;

const L2_ENEMY_SPAWN_X = 250;
const L2_ENEMY_SPAWN_Y = 150;
const L2_ENEMY_CIRCLE_RADIUS = 60;

const L3_ENEMY_SPAWN_X = 250;
const L3_ENEMY_SPAWN_Y = 150;
const L3_ENEMY_CIRCLE_RADIUS = 70;

const BASIC_ENEMY_HEIGHT = 30;
const BASIC_ENEMY_WIDTH = 30;

const TOTAL_L1_ENEMY_COUNT = 4;
let L1EnemiesSpawned = 0;
let enemyProjectileArray = [];
let L2EnemyProjectileArray = [];
let L3EnemyProjectileArray = [];
let hearts = 5;
let killPlayer = false;
let screenName;

let L2EnemyArray = [];
const TOTAL_L2_ENEMY_COUNT = 5;
let L2EnemiesSpawned = 0;

let L3EnemyArray = [];
const TOTAL_L3_ENEMY_COUNT = 6;
let L3EnemiesSpawned = 0;
// starting the canvas, calling my function which makes the start screen, and making sure the player will not be dead (this boolean turns true when the hearts = 0)

const startCanvas = () => {
  ctx = document.getElementById("canvas").getContext("2d");
  console.log("canvas started");
  drawStartScreen();
  killPlayer = false;
};

const handleClicks = () => {
  if (screenName == "startScreen") {
    startGame();
  } else if (screenName == "gameOver") {
    drawStartScreen();
  } else if (screenName == "level1Completed") {
    startLevel2();
  } else if (screenName == "level2Completed") {
    startLevel3();
  } else if (screenName == "level3Completed") {
    drawStartScreen();
  }
};
// starts the screen

const drawStartScreen = () => {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, CANVASWIDTH, CANVASHEIGHT);
  ctx.fillStyle = "white";
  ctx.font = "40px system-ui";
  ctx.fillText(
    "Cosmos Intruders",
    CANVASWIDTH / 2 - 150, // the start of the text will be 150 px left of the center of the canvas
    CANVASHEIGHT / 2 - 40
  );
  ctx.font = "20px system-ui";
  ctx.fillText("Click to Start", CANVASWIDTH / 2 - 50, CANVASHEIGHT / 2);
  screenName = "startScreen";
  hearts = 5;
  killPlayer = false;
};

const spawnNewEnemy2 = () => {
  if (L2EnemiesSpawned >= TOTAL_L2_ENEMY_COUNT) return;
  const initialPos = ((2 * Math.PI) / TOTAL_L2_ENEMY_COUNT) * L2EnemiesSpawned;

  L2EnemyArray.push(
    new Enemy(
      L2_ENEMY_SPAWN_X,
      L2_ENEMY_SPAWN_Y + L2_ENEMY_CIRCLE_RADIUS,
      BASIC_ENEMY_HEIGHT,
      BASIC_ENEMY_WIDTH,
      initialPos
    )
  );
  L2EnemiesSpawned++;
};

const spawnNewEnemy3 = () => {
  if (L3EnemiesSpawned >= TOTAL_L3_ENEMY_COUNT) return;
  const initialPos = ((2 * Math.PI) / TOTAL_L3_ENEMY_COUNT) * L3EnemiesSpawned;

  L3EnemyArray.push(
    new Enemy(
      L3_ENEMY_SPAWN_X,
      L3_ENEMY_SPAWN_Y + L3_ENEMY_CIRCLE_RADIUS,
      BASIC_ENEMY_HEIGHT,
      BASIC_ENEMY_WIDTH,
      initialPos
    )
  );
  L3EnemiesSpawned++;
};

const startLevel2 = () => {
  player = new Player(
    PLAYER_IMAGE,
    playerX,
    playerY,
    PLAYER_WIDTH,
    PLAYER_HEIGHT,
    0
  );

  for (let i = 0; i < TOTAL_L2_ENEMY_COUNT; i++) {
    spawnNewEnemy2();
  }

  timer = setInterval(updateCanvas, 1000 / 60);
  screenName = "level2";
};

const startLevel3 = () => {
  player = new Player(
    PLAYER_IMAGE,
    playerX,
    playerY,
    PLAYER_WIDTH,
    PLAYER_HEIGHT,
    0
  );

  for (let i = 0; i < TOTAL_L3_ENEMY_COUNT; i++) {
    spawnNewEnemy3();
  }

  timer = setInterval(updateCanvas, 1000 / 60);
  screenName = "level3";
};

const startGame = () => {
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
  screenName = "level1";
};

// drawing the various graphics and background as well as calling functions 60 times/second in order to make smooth movement

const updateCanvas = () => {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, CANVASWIDTH, CANVASHEIGHT);
  ctx.imageSmoothingEnabled = false;
  movePlayer();
  drawProjectiles();
  drawPlayer();
  heartFunction();
  removeRedundantProjectiles();

  if (screenName == "level1") {
    moveL1Enemies();
    renderL1Enemies();
    drawL1EnemyProjectiles();
    moveL1EnemyProjectiles();
    basicEnemyHit(L1EnemyArray);
    L1PlayerHit();
    L1Passed();
    L1Failed();

    const L1LastEnemy = L1EnemyArray.at(-1);
    if (
      L1LastEnemy &&
      L1LastEnemy.pos >= (2 * Math.PI) / TOTAL_L1_ENEMY_COUNT &&
      L1EnemyArray.length < 4
    ) {
      spawnNewEnemy();
    }
  } else if (screenName == "level2") {
    moveL2Enemies();
    renderL2Enemies();
    drawL2EnemyProjectiles();
    moveL2EnemyProjectiles();
    basicEnemyHit(L2EnemyArray);
    L2PlayerHit();
    L2Passed();
    L2Failed();

    const L2LastEnemy = L2EnemyArray.at(-1);
    if (
      L2LastEnemy &&
      L2LastEnemy.pos >= (2 * Math.PI) / TOTAL_L2_ENEMY_COUNT &&
      L2EnemyArray.length < 5
    ) {
      spawnNewEnemy();
    }
  } else if (screenName == "level3") {
    moveL3Enemies();
    renderL3Enemies();
    drawL3EnemyProjectiles();
    moveL3EnemyProjectiles();
    basicEnemyHit(L3EnemyArray);
    L3PlayerHit();
    L3Passed();
    L3Failed();

    const L3LastEnemy = L3EnemyArray.at(-1);
    if (
      L3LastEnemy &&
      L3LastEnemy.pos >= (2 * Math.PI) / TOTAL_L3_ENEMY_COUNT &&
      L3EnemyArray.length < 6
    ) {
      spawnNewEnemy();
    }
  }

  removePlayer();
};

const drawPlayer = () => {
  if (!killPlayer) {
    ctx.drawImage(
      player.image,
      player.x,
      player.y,
      player.width,
      player.height
    );
  }
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

const moveL2Enemies = () => {
  for (const enemy of L2EnemyArray) {
    enemy.pos += 0.04;
    enemy.x = -Math.sin(enemy.pos) * L2_ENEMY_CIRCLE_RADIUS + L2_ENEMY_SPAWN_X;
    enemy.y = Math.cos(enemy.pos) * L2_ENEMY_CIRCLE_RADIUS + L2_ENEMY_SPAWN_Y;
    enemy.tryShoot();
  }
};

const moveL3Enemies = () => {
  for (const enemy of L3EnemyArray) {
    enemy.pos += 0.04;
    enemy.x = -Math.sin(enemy.pos) * L3_ENEMY_CIRCLE_RADIUS + L3_ENEMY_SPAWN_X;
    enemy.y = Math.cos(enemy.pos) * L3_ENEMY_CIRCLE_RADIUS + L3_ENEMY_SPAWN_Y;
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

const renderL2Enemies = () => {
  for (const enemy of L2EnemyArray) {
    ctx.drawImage(
      BASIC_ENEMY_IMAGE,
      enemy.x,
      enemy.y,
      BASIC_ENEMY_HEIGHT,
      BASIC_ENEMY_WIDTH
    );
  }
};

const renderL3Enemies = () => {
  for (const enemy of L3EnemyArray) {
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

const drawL2EnemyProjectiles = () => {
  for (const projectile of L2EnemyProjectileArray) {
    ctx.drawImage(
      ENEMY_PROJ_IMAGE,
      projectile.x,
      projectile.y,
      PROJ_WIDTH,
      PROJ_HEIGHT
    );
  }
};

const drawL3EnemyProjectiles = () => {
  for (const projectile of L3EnemyProjectileArray) {
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

const moveL2EnemyProjectiles = () => {
  for (const projectile of L2EnemyProjectileArray) {
    projectile.moveL2EnemyProjectile();
  }
};

const moveL3EnemyProjectiles = () => {
  for (const projectile of L3EnemyProjectileArray) {
    projectile.moveL3EnemyProjectile();
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

const basicEnemyHit = (enemyArray) => {
  for (const projectile of projectileArray) {
    for (const enemy of enemyArray) {
      if (projectile.checkEnemyCollision(enemy)) {
        const projIndex = projectileArray.indexOf(projectile);
        const enemyIndex = enemyArray.indexOf(enemy);
        enemyArray.splice(enemyIndex, 1);
        projectileArray.splice(projIndex, 1);
      } // die
    }
  }
};

const L1PlayerHit = () => {
  for (const L1EnemyProjectile of enemyProjectileArray) {
    if (L1EnemyProjectile.checkPlayerCollision(player)) {
      const enemyProjIndex = enemyProjectileArray.indexOf(L1EnemyProjectile);
      enemyProjectileArray.splice(enemyProjIndex, 1);
      hearts--;
    } // die
  }
};

const L2PlayerHit = () => {
  for (const L2EnemyProjectile of L2EnemyProjectileArray) {
    if (L2EnemyProjectile.checkPlayerCollision(player)) {
      const L2EnemyProjIndex =
        L2EnemyProjectileArray.indexOf(L2EnemyProjectile);
      L2EnemyProjectileArray.splice(L2EnemyProjIndex, 1);
      hearts--;
    } // die
  }
};

const L3PlayerHit = () => {
  for (const L3EnemyProjectile of L3EnemyProjectileArray) {
    if (L3EnemyProjectile.checkPlayerCollision(player)) {
      const L3EnemyProjIndex =
        L3EnemyProjectileArray.indexOf(L3EnemyProjectile);
      L3EnemyProjectileArray.splice(L3EnemyProjIndex, 1);
      hearts--;
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

const heartFunction = () => {
  for (let i = 0; i < hearts; i++) {
    ctx.drawImage(
      HEART_IMAGE,
      heartX - i * 30,
      HEART_Y,
      HEART_WIDTH,
      HEART_HEIGHT
    );
  }
};

const L1Passed = () => {
  if (hearts > 0 && L1EnemyArray.length <= 0) {
    setTimeout(() => {
      ctx.fillStyle = "black";
      ctx.clearRect(0, 0, CANVASHEIGHT, CANVASWIDTH);
      clearInterval(timer);
      ctx.fillRect(0, 0, CANVASHEIGHT, CANVASWIDTH);
      ctx.fillStyle = "white";
      ctx.font = "40px system-ui";
      ctx.fillText("Level 2", CANVASWIDTH / 2 - 59, CANVASHEIGHT / 2 - 40);
      ctx.font = "20px system-ui";
      ctx.fillText("Click to continue", CANVASWIDTH / 2 - 75, CANVASHEIGHT / 2);
    }, 2000);
    screenName = "level1Completed";
  }
};

const L2Passed = () => {
  if (hearts > 0 && L2EnemyArray.length <= 0) {
    setTimeout(() => {
      ctx.fillStyle = "black";
      ctx.clearRect(0, 0, CANVASHEIGHT, CANVASWIDTH);
      clearInterval(timer);
      ctx.fillRect(0, 0, CANVASHEIGHT, CANVASWIDTH);
      ctx.fillStyle = "white";
      ctx.font = "40px system-ui";
      ctx.fillText("Level 3", CANVASWIDTH / 2 - 59, CANVASHEIGHT / 2 - 40);
      ctx.font = "20px system-ui";
      ctx.fillText("Click to continue", CANVASWIDTH / 2 - 75, CANVASHEIGHT / 2);
      screenName = "level2Completed";
    }, 2000);
  }
};

const L3Passed = () => {
  if (hearts > 0 && L3EnemyArray.length <= 0) {
    setTimeout(() => {
      ctx.fillStyle = "black";
      ctx.clearRect(0, 0, CANVASHEIGHT, CANVASWIDTH);
      clearInterval(timer);
      ctx.fillRect(0, 0, CANVASHEIGHT, CANVASWIDTH);
      ctx.fillStyle = "white";
      ctx.font = "40px system-ui";
      ctx.fillText(
        "Congrats! You Win!",
        CANVASWIDTH / 2 - 170,
        CANVASHEIGHT / 2 - 40
      );
      ctx.font = "20px system-ui";
      ctx.fillText(
        "Click to play again",
        CANVASWIDTH / 2 - 75,
        CANVASHEIGHT / 2
      );
      screenName = "level3Completed";
    }, 2000);
  }
};

const L1Failed = () => {
  if (hearts <= 0) {
    setTimeout(() => {
      ctx.fillStyle = "black";
      ctx.clearRect(0, 0, CANVASHEIGHT, CANVASWIDTH);
      clearInterval(timer);
      screenName = "gameOver";
      console.log(screenName);
      ctx.fillRect(0, 0, CANVASHEIGHT, CANVASWIDTH);
      ctx.fillStyle = "white";
      ctx.font = "40px system-ui";
      ctx.fillText("Game over", CANVASWIDTH / 2 - 90, CANVASHEIGHT / 2 - 40);
      ctx.font = "20px system-ui";
      ctx.fillText(
        "Click anywhere to return to main menu",
        CANVASWIDTH / 2 - 170,
        CANVASHEIGHT / 2
      );
    }, 2000);
  }
};

const L2Failed = () => {
  if (hearts <= 0) {
    setTimeout(() => {
      ctx.fillStyle = "black";
      ctx.clearRect(0, 0, CANVASHEIGHT, CANVASWIDTH);
      clearInterval(timer);
      screenName = "gameOver";
      console.log(screenName);
      ctx.fillRect(0, 0, CANVASHEIGHT, CANVASWIDTH);
      ctx.fillStyle = "white";
      ctx.font = "40px system-ui";
      ctx.fillText("Game over", CANVASWIDTH / 2 - 90, CANVASHEIGHT / 2 - 40);
      ctx.font = "20px system-ui";
      ctx.fillText(
        "Click anywhere to return to main menu",
        CANVASWIDTH / 2 - 170,
        CANVASHEIGHT / 2
      );
    }, 2000);
  }
};

const L3Failed = () => {
  if (hearts <= 0) {
    setTimeout(() => {
      ctx.fillStyle = "black";
      ctx.clearRect(0, 0, CANVASHEIGHT, CANVASWIDTH);
      clearInterval(timer);
      screenName = "gameOver";
      console.log(screenName);
      ctx.fillRect(0, 0, CANVASHEIGHT, CANVASWIDTH);
      ctx.fillStyle = "white";
      ctx.font = "40px system-ui";
      ctx.fillText("Game over", CANVASWIDTH / 2 - 90, CANVASHEIGHT / 2 - 40);
      ctx.font = "20px system-ui";
      ctx.fillText(
        "Click anywhere to return to main menu",
        CANVASWIDTH / 2 - 170,
        CANVASHEIGHT / 2
      );
    }, 2000);
  }
};

const removePlayer = () => {
  if (hearts <= 0) {
    killPlayer = true;
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
    if (screenName == "level1") {
      enemyProjectileArray.push(
        new L1EnemyProjectile(
          this.x + BASIC_ENEMY_WIDTH / 2 - PROJ_WIDTH / 2,
          this.y
        )
      );
    } else if (screenName == "level2") {
      console.log("level two shoot");
      L2EnemyProjectileArray.push(
        new L2EnemyProjectile(
          this.x + BASIC_ENEMY_WIDTH / 2 - PROJ_WIDTH / 2,
          this.y
        )
      );
    } else if (screenName == "level3") {
      console.log("level three shoot");
      L3EnemyProjectileArray.push(
        new L3EnemyProjectile(
          this.x + BASIC_ENEMY_WIDTH / 2 - PROJ_WIDTH / 2,
          this.y
        )
      );
    }

    this.canShoot = false;
    const shootingDelay = Math.floor(Math.random() * 1000) + 1000;
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

class L2EnemyProjectile {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  moveL2EnemyProjectile() {
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

class L3EnemyProjectile {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  moveL3EnemyProjectile() {
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

canvas.addEventListener("click", handleClicks);

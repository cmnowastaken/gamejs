// Name: Εlliott Bell
// Game: Cosmos Intruders
// Version 25

// Declaring the variables that will be used

let ctx;
let player;
const CANVASWIDTH = 500;
const CANVASHEIGHT = 500;

// declaring the various images used in the game
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
const BACKGROUND_IMAGE = new Image();
BACKGROUND_IMAGE.src = "starbackground.png";

// declaring projectile dimensions
const PROJ_WIDTH = 5;
const PROJ_HEIGHT = 10;
const PROJ_SPEED = 5;

// dimensions and location of the player
let playerX = CANVASWIDTH / 2;
let playerY = CANVASHEIGHT - 50;
const PLAYER_WIDTH = 35;
const PLAYER_HEIGHT = 35;

// dimensions and location of the heart sprite
const HEART_WIDTH = 25;
const HEART_HEIGHT = 25;
let heartX = CANVASWIDTH - 40;
const HEART_Y = 40 - HEART_HEIGHT;

// projectile variables
let projY = playerY;
let projectileArray = [];
const keysPressed = {};

// level 1 enemy variables
let L1EnemyArray = [];
const L1_ENEMY_SPAWN_X = 250;
const L1_ENEMY_SPAWN_Y = 150;
const L1_ENEMY_CIRCLE_RADIUS = 50;

// level 2 enemy variables
const L2_ENEMY_SPAWN_X = 250;
const L2_ENEMY_SPAWN_Y = 150;
const L2_ENEMY_CIRCLE_RADIUS = 60;

// level 3 enemy variables
const L3_ENEMY_SPAWN_X = 250;
const L3_ENEMY_SPAWN_Y = 150;
const L3_ENEMY_CIRCLE_RADIUS = 70;

// enemy dimensions
const BASIC_ENEMY_HEIGHT = 30;
const BASIC_ENEMY_WIDTH = 30;

// level 1 enemy counter variables
const TOTAL_L1_ENEMY_COUNT = 4;
let L1EnemiesSpawned = 0;

// variables related to the character dying
let hearts = 5;
let killPlayer = false;
let screenName;

// level 2 enemy counting
let L2EnemyArray = [];
const TOTAL_L2_ENEMY_COUNT = 5;
let L2EnemiesSpawned = 0;

// level 3 enemy counting
let L3EnemyArray = [];
const TOTAL_L3_ENEMY_COUNT = 6;
let L3EnemiesSpawned = 0;

// enemy projectile arrays
let enemyProjectileArray = [];
let L2EnemyProjectileArray = [];
let L3EnemyProjectileArray = [];

// starting the canvas, calling my function which makes the start screen, and making sure the player will not be dead (this boolean turns true when the hearts = 0)

const startCanvas = () => {
  ctx = document.getElementById("canvas").getContext("2d");
  console.log("canvas started");
  drawStartScreen();
  killPlayer = false;
};

//handling clicks for the later levels in the game

const handleClicks = () => {
  if (screenName == "startScreen") {
    // if a click is registered when the screen name is startScreen, run the function startGame
    startGame();
  } else if (screenName == "gameOver") {
    // if a click is registered when the screen name is gameOver, run the function drawStartScreen
    drawStartScreen();
  } else if (screenName == "level1Completed") {
    // if a click is registered when the screen name is level1Completed, run the function startLevel2
    startLevel2();
  } else if (screenName == "level2Completed") {
    // if a click is registered when the screen name is level2Completed, run the function startLevel3
    startLevel3();
  } else if (screenName == "level3Completed") {
    // if a click is registered when the screen name is level3Completed, run the function drawStartScreen
    drawStartScreen();
  }
};

// starts the screen

const drawStartScreen = () => {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, CANVASHEIGHT, CANVASWIDTH); // drawing a black square over the canvas
  ctx.fillStyle = "white";
  ctx.font = "40px system-ui";
  ctx.fillText(
    "Cosmos Intruders",
    CANVASWIDTH / 2 - 150, // the start of the text will be 150 px left of the center of the canvas
    CANVASHEIGHT / 2 - 40 // the start of the text will be 40 px left of the center of the canvas
  );
  ctx.font = "30px system-ui";
  ctx.fillText("Click to Start", CANVASWIDTH / 2 - 70, CANVASHEIGHT / 2);
  ctx.font = "20px system-ui";
  ctx.fillText("Commands", CANVASWIDTH / 2 - 47.5, CANVASHEIGHT / 2 + 75);
  ctx.font = "20px system-ui";
  ctx.fillText(
    "a to move left, d to move right, space to shoot",
    50,
    CANVASHEIGHT / 2 + 120
  ); // the start of the text will be 50 px left of the center of the canvas
  screenName = "startScreen"; // setting the screen name to be referenced by the click handler
  hearts = 5; // setting the hearts the character has
  killPlayer = false; // making sure the game doesn't immediately kill the player
};

const spawnNewEnemy = () => {
  if (L1EnemiesSpawned >= TOTAL_L1_ENEMY_COUNT) return; // if the enemies spawned is less than 4, spawn another enemy.
  const initialPos = ((2 * Math.PI) / TOTAL_L1_ENEMY_COUNT) * L1EnemiesSpawned; // spawn the enemies perfectly in a circle.

  L1EnemyArray.push(
    // push an enemy to the enemy array in order to spawn it
    new Enemy(
      L1_ENEMY_SPAWN_X,
      L1_ENEMY_SPAWN_Y + L1_ENEMY_CIRCLE_RADIUS,
      BASIC_ENEMY_HEIGHT,
      BASIC_ENEMY_WIDTH,
      initialPos
    )
  );
  L1EnemiesSpawned++; // tell the computer that the amount of enemies spawned increased by 1
};

const spawnNewEnemy2 = () => {
  if (L2EnemiesSpawned >= TOTAL_L2_ENEMY_COUNT) return; // if the enemies spawned is less than 5, spawn another enemy.
  const initialPos = ((2 * Math.PI) / TOTAL_L2_ENEMY_COUNT) * L2EnemiesSpawned; // spawn the enemies perfectly in a circle.

  L2EnemyArray.push(
    new Enemy(
      L2_ENEMY_SPAWN_X,
      L2_ENEMY_SPAWN_Y + L2_ENEMY_CIRCLE_RADIUS,
      BASIC_ENEMY_HEIGHT,
      BASIC_ENEMY_WIDTH,
      initialPos
    )
  );
  L2EnemiesSpawned++; // tell the computer that the amount of enemies spawned increased by 1
};

const spawnNewEnemy3 = () => {
  if (L3EnemiesSpawned >= TOTAL_L3_ENEMY_COUNT) return; // if the enemies spawned is less than 6, spawn another enemy.
  const initialPos = ((2 * Math.PI) / TOTAL_L3_ENEMY_COUNT) * L3EnemiesSpawned; // spawn the enemies perfectly in a circle.

  L3EnemyArray.push(
    new Enemy(
      L3_ENEMY_SPAWN_X,
      L3_ENEMY_SPAWN_Y + L3_ENEMY_CIRCLE_RADIUS,
      BASIC_ENEMY_HEIGHT,
      BASIC_ENEMY_WIDTH,
      initialPos
    )
  );
  L3EnemiesSpawned++; // tell the computer that the amount of enemies spawned increased by 1
};

const startLevel2 = () => {
  // start level 2 once the click handler registers that level 2 should be started
  player = new Player( // draw a new player on the screen
    PLAYER_IMAGE,
    playerX,
    playerY,
    PLAYER_WIDTH,
    PLAYER_HEIGHT,
    0
  );

  for (let i = 0; i < TOTAL_L2_ENEMY_COUNT; i++) {
    // spawn new enemies until there are 5 of them
    spawnNewEnemy2();
  }

  timer = setInterval(updateCanvas, 1000 / 60); // set the game to tick every 60th of a second
  screenName = "level2";
};

const startLevel3 = () => {
  // start level 3 once the click handler registers that level 3 should be started
  player = new Player( // draw a new player on the screen
    PLAYER_IMAGE,
    playerX,
    playerY,
    PLAYER_WIDTH,
    PLAYER_HEIGHT,
    0
  );

  for (let i = 0; i < TOTAL_L3_ENEMY_COUNT; i++) {
    // spawn new enemies until there are 5 of them
    spawnNewEnemy3();
  }

  timer = setInterval(updateCanvas, 1000 / 60); // set the game to tick every 60th of a second
  screenName = "level3"; // setting the screenName for the click handler
};

const startGame = () => {
  // starting the game
  L1EnemiesSpawned = 0; // setting the enemy spawn count to 0 so that the game can be replaye dover and over
  L2EnemiesSpawned = 0;
  L3EnemiesSpawned = 0;
  player = new Player( // drawing the player
    PLAYER_IMAGE,
    playerX,
    playerY,
    PLAYER_WIDTH,
    PLAYER_HEIGHT,
    0
  );

  for (let i = 0; i < TOTAL_L1_ENEMY_COUNT; i++) {
    // for loop in order to spawn the enemies
    spawnNewEnemy();
  }

  timer = setInterval(updateCanvas, 1000 / 60); // update every 60th of a second
  screenName = "level1"; // screen named level 1 for the click handler
};

// drawing the various graphics and background as well as calling functions 60 times/second in order to make smooth movement

const updateCanvas = () => {
  ctx.fillStyle = "black"; // drawing the background
  ctx.fillRect(0, 0, CANVASWIDTH, CANVASHEIGHT);
  ctx.imageSmoothingEnabled = false; // making the sprites show each pixel instead of being smoothed out and weird looking

  // calling each of these functions 60x per second
  movePlayer();
  drawProjectiles();
  drawPlayer();
  heartFunction();
  removeRedundantProjectiles();

  if (screenName == "level1") {
    // if the screen name is level1, call the level1 functions
    moveL1Enemies();
    renderL1Enemies();
    drawL1EnemyProjectiles();
    moveL1EnemyProjectiles();
    basicEnemyHit(L1EnemyArray); // passing the enemy array into this function so that it can be referenced
    L1PlayerHit();
    L1Passed();
    L1Failed();

    const L1LastEnemy = L1EnemyArray.at(-1); // finding the first enemy in the array
    if (
      // parameters that the enemy has to adhere to in order to spawn a new enemy
      L1LastEnemy && // last enemy exists
      L1LastEnemy.pos >= (2 * Math.PI) / TOTAL_L1_ENEMY_COUNT && // last enemy is at least a quarter of the way around the enemy movement circle
      L1EnemyArray.length < 4 // there are less than 4 enemies in the array
    ) {
      spawnNewEnemy(); // if these are met, spawn a new enemy
    }
  } else if (screenName == "level2") {
    // if the screen name is level2, run the level2 functions
    moveL2Enemies();
    renderL2Enemies();
    drawL2EnemyProjectiles();
    moveL2EnemyProjectiles();
    basicEnemyHit(L2EnemyArray); // pass in the enemy array for level 2 so the basicEnemyHit function can access it
    L2PlayerHit();
    L2Passed();
    L2Failed();

    const L2LastEnemy = L2EnemyArray.at(-1); // finding the first enemy in the array
    if (
      // parameters that the enemy has to adhere to in order to spawn a new enemy
      L2LastEnemy && // last enemy exists
      L2LastEnemy.pos >= (2 * Math.PI) / TOTAL_L2_ENEMY_COUNT && // last enemy is at least a quarter of the way around the enemy movement circle
      L2EnemyArray.length < 5 // there are less than 5 enemies in the array
    ) {
      spawnNewEnemy(); // if these are met, spawn a new enemy
    }
  } else if (screenName == "level3") {
    // if the screen name is level2, run the level2 functions
    moveL3Enemies();
    renderL3Enemies();
    drawL3EnemyProjectiles();
    moveL3EnemyProjectiles();
    basicEnemyHit(L3EnemyArray); // pass in the enemy array for level 2 so the basicEnemyHit function can access it
    L3PlayerHit();
    L3Passed();
    L3Failed();

    const L3LastEnemy = L3EnemyArray.at(-1); // finding the first enemy in the array
    if (
      // parameters that the enemy has to adhere to in order to spawn a new enemy
      L3LastEnemy && // last enemy exists
      L3LastEnemy.pos >= (2 * Math.PI) / TOTAL_L3_ENEMY_COUNT && // last enemy is at least a quarter of the way around the enemy movement circle
      L3EnemyArray.length < 6 // there are less than 6 enemies in the array
    ) {
      spawnNewEnemy(); // if these are met, spawn a new enemy
    }
  }

  removePlayer(); // check if removePlayer is true. If so, run the function
};

const drawPlayer = () => {
  // drawing the player onto the screen
  if (!killPlayer) {
    // if the killPlayer variable evaluates to false (hearts =< 0) then draw the player
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
    // ensuring the player moves right when d is pressed
    player.x += playerSpeed;
    if (player.x > CANVASWIDTH - PLAYER_WIDTH / 2) {
      // making the player wrap around the screen
      player.x = -PLAYER_WIDTH / 2;
    }
  }
};

const moveL1Enemies = () => {
  // moving the enemies in level 1 in a circle
  for (const enemy of L1EnemyArray) {
    // do this for every enemy in the array
    enemy.pos += 0.03; // move the enemy 0.03 radians around the circle (1.7 degrees)
    enemy.x = -Math.sin(enemy.pos) * L1_ENEMY_CIRCLE_RADIUS + L1_ENEMY_SPAWN_X; // the x position of the enemy should be equal to the negative sine of the enemy position (declared previously) to make the enemy move in a circle * the radius of the circle in order to translate it to the radius of the circle, + the spawn position to declare the center of the circle
    enemy.y = Math.cos(enemy.pos) * L1_ENEMY_CIRCLE_RADIUS + L1_ENEMY_SPAWN_Y; // the y position of the enemy should be equal to the cosine of the enemy position (declared previously) to make the enemy move in a circle * the radius of the circle in order to translate it to the radius of the circle, + the spawn position to declare the center of the circle
    enemy.tryShoot(); // see if the enemy can shoot based on the shoot timeout in the enemy projectile class
  }
};

const moveL2Enemies = () => {
  // moving the enemies in level 2 in a circle
  for (const enemy of L2EnemyArray) {
    // do this for every enemy in the array
    enemy.pos += 0.04; // move the enemy 0.04 radians around the circle (2.3 degrees)
    enemy.x = -Math.sin(enemy.pos) * L2_ENEMY_CIRCLE_RADIUS + L2_ENEMY_SPAWN_X; // the x position of the enemy should be equal to the negative sine of the enemy position (declared previously) to make the enemy move in a circle * the radius of the circle in order to translate it to the radius of the circle, + the spawn position to declare the center of the circle
    enemy.y = Math.cos(enemy.pos) * L2_ENEMY_CIRCLE_RADIUS + L2_ENEMY_SPAWN_Y; // the y position of the enemy should be equal to the cosine of the enemy position (declared previously) to make the enemy move in a circle * the radius of the circle in order to translate it to the radius of the circle, + the spawn position to declare the center of the circle
    enemy.tryShoot(); // see if the enemy can shoot based on the shoot timeout in the enemy projectile class
  }
};

const moveL3Enemies = () => {
  // moving the enemies in level 3 in a circle
  for (const enemy of L3EnemyArray) {
    // do this for every enemy in the array
    enemy.pos += 0.05; // move the enemy 0.05 radians around the circle (2.8 degrees)
    enemy.x = -Math.sin(enemy.pos) * L3_ENEMY_CIRCLE_RADIUS + L3_ENEMY_SPAWN_X; // the x position of the enemy should be equal to the negative sine of the enemy position (declared previously) to make the enemy move in a circle * the radius of the circle in order to translate it to the radius of the circle, + the spawn position to declare the center of the circle
    enemy.y = Math.cos(enemy.pos) * L3_ENEMY_CIRCLE_RADIUS + L3_ENEMY_SPAWN_Y; // the y position of the enemy should be equal to the cosine of the enemy position (declared previously) to make the enemy move in a circle * the radius of the circle in order to translate it to the radius of the circle, + the spawn position to declare the center of the circle
    enemy.tryShoot(); // see if the enemy can shoot based on the shoot timeout in the enemy projectile class
  }
};

const renderL1Enemies = () => {
  // draw the enemies onto the canvas
  for (const enemy of L1EnemyArray) {
    // do this for every enemy that exists in the level
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
  // draw the enemies onto the canvas
  for (const enemy of L2EnemyArray) {
    // do this for every enemy that exists in the level
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
  // draw the enemies onto the canvas
  for (const enemy of L3EnemyArray) {
    // do this for every enemy that exists in the level
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
  // draw the projectiles on the canvas
  if (!killPlayer) {
    // only do this if the player is not dead
    for (const projectile of projectileArray) {
      // do this for every projectile present in the array
      ctx.drawImage(
        PROJ_IMAGE,
        projectile.x,
        projectile.y,
        PROJ_WIDTH,
        PROJ_HEIGHT
      );
      projectile.y -= PROJ_SPEED;
    }
  }
};

const drawL1EnemyProjectiles = () => {
  // draw the projectiles for the enemy onto the screen
  for (const projectile of enemyProjectileArray) {
    // do this for every projectile in the array
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
  // draw the projectiles for the enemy onto the screen
  for (const projectile of L2EnemyProjectileArray) {
    // do this for every projectile in the array
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
  // draw the projectiles for the enemy onto the screen
  for (const projectile of L3EnemyProjectileArray) {
    // do this for every projectile in the array
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
  // move the projectiles the enemies shoot
  for (const projectile of enemyProjectileArray) {
    // do this for every projectile in the array
    projectile.moveL1EnemyProjectile(); // reference the projectile class
  }
};

const moveL2EnemyProjectiles = () => {
  for (const projectile of L2EnemyProjectileArray) {
    projectile.moveL2EnemyProjectile(); // draw the projectiles for the enemy onto the screen
  }
};

const moveL3EnemyProjectiles = () => {
  // move the projectiles the enemies shoot
  for (const projectile of L3EnemyProjectileArray) {
    // do this for every projectile in the array
    projectile.moveL3EnemyProjectile(); // draw the projectiles for the enemy onto the screen
  }
};
// logging which keys were pressed in order to move or shoot projectiles

const keyPressed = (keyboardEvent) => {
  // this function runs if a key is pressed
  keysPressed[keyboardEvent.key] = true; // if a key is pressed, evaluate to true
};

window.addEventListener("keydown", keyPressed);

// figuring out when keys are not pressed so that the character stops moving

const keyUp = (keyboardEvent) => {
  // if the key is not pressed call this function
  delete keysPressed[keyboardEvent.key]; // get rid of the log of the key being pressed
  if (keyboardEvent.key == " ") {
    // if the key pressed is space, spawn a projectile for the player
    projectileArray.push(
      new Projectile(player.x + PLAYER_WIDTH / 2 - PROJ_WIDTH / 2, player.y)
    );
  }
};

window.addEventListener("keyup", keyUp); // listen for the key to be depressed

const basicEnemyHit = (enemyArray) => {
  // check if the enemies are hits
  for (const projectile of projectileArray) {
    // reference the specific projectile in the array
    for (const enemy of enemyArray) {
      // reference the specific enemy in the enemy array
      if (projectile.checkEnemyCollision(enemy)) {
        // if the enemy is hit, do this
        const projIndex = projectileArray.indexOf(projectile); // find the projectile that hit the enemy
        const enemyIndex = enemyArray.indexOf(enemy); // find the enemy that was hit
        enemyArray.splice(enemyIndex, 1); // get rid of the enemy from the array
        projectileArray.splice(projIndex, 1); // get rid of the projectile from the array
      } // die
    }
  }
};

const L1PlayerHit = () => {
  // check if the player is hit in level 1
  for (const L1EnemyProjectile of enemyProjectileArray) {
    // find the enemy projectile
    if (L1EnemyProjectile.checkPlayerCollision(player)) {
      // take the player and the enemy projectile if they collide
      const enemyProjIndex = enemyProjectileArray.indexOf(L1EnemyProjectile); // make a variable which references the enemy projectile that hit the player
      enemyProjectileArray.splice(enemyProjIndex, 1); // get rid of the enemy projectile
      hearts--; // get rid of one heart from the player
    }
  }
};

const L2PlayerHit = () => {
  // check if the player is hit in level 2
  for (const L2EnemyProjectile of L2EnemyProjectileArray) {
    // find the enemy projectile which hit the player
    if (L2EnemyProjectile.checkPlayerCollision(player)) {
      // if it did hit the player, do this
      const L2EnemyProjIndex =
        L2EnemyProjectileArray.indexOf(L2EnemyProjectile); // make a variable containing the projectile
      L2EnemyProjectileArray.splice(L2EnemyProjIndex, 1); // get rid of the projectile from the array
      hearts--; // get rid of one of the players hearts
    }
  }
};

const L3PlayerHit = () => {
  // check if the player is hit in level 3
  for (const L3EnemyProjectile of L3EnemyProjectileArray) {
    // find the enemy projectile which hit the player
    if (L3EnemyProjectile.checkPlayerCollision(player)) {
      // if it did hit the player, do this
      const L3EnemyProjIndex =
        L3EnemyProjectileArray.indexOf(L3EnemyProjectile); // make a variable containing the projectile
      L3EnemyProjectileArray.splice(L3EnemyProjIndex, 1); // get rid of the projectile from the array
      hearts--; // get rid of one of the players hearts
    }
  }
};

const removeRedundantProjectiles = () => {
  // remove projectiles that left the screen to reduce lag
  for (const projectile of projectileArray) {
    // do this for every projectile in the array
    if (projectile.y < 0) {
      // if it is above the screen, do this
      const projIndex = projectileArray.indexOf(projectile); // make a variable with the projectile
      projectileArray.splice(projIndex, 1); // get rid of the projectile from the array
    }
  }
};

const heartFunction = () => {
  // function which handles drawing hearts
  for (let i = 0; i < hearts; i++) {
    // spawn in 5 hearts. these will reduce if the player is hit thanks to the player hit functions
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
    //if the player has hearts left and there are no enemies do this
    setTimeout(() => {
      // do this on a timer
      ctx.fillStyle = "black"; // make the screen black
      ctx.clearRect(0, 0, CANVASHEIGHT, CANVASWIDTH);
      clearInterval(timer); // get rid of the game ticks
      screenName = "level1Completed"; // change the screen name for the click handler
      projectileArray.length = 0; // make it so there are no projectiles
      ctx.fillRect(0, 0, CANVASHEIGHT, CANVASWIDTH);
      ctx.fillStyle = "white"; // write text that says the level was passed
      ctx.font = "40px system-ui";
      ctx.fillText("Level 2", CANVASWIDTH / 2 - 59, CANVASHEIGHT / 2 - 40);
      ctx.font = "20px system-ui";
      ctx.fillText("Click to continue", CANVASWIDTH / 2 - 75, CANVASHEIGHT / 2);
    }, 2000); // do this after 2 seconds
  }
};

const L2Passed = () => {
  if (hearts > 0 && L2EnemyArray.length <= 0) {
    //if the player has hearts left and there are no enemies do this
    setTimeout(() => {
      // do this on a timer
      ctx.fillStyle = "black"; // make the screen black
      ctx.clearRect(0, 0, CANVASHEIGHT, CANVASWIDTH);
      clearInterval(timer); // get rid of the game ticks
      screenName = "level2Completed"; // change the screen name for the click handler
      projectileArray.length = 0; // make it so there are no projectiles
      ctx.fillRect(0, 0, CANVASHEIGHT, CANVASWIDTH);
      ctx.fillStyle = "white"; // write text that says the level was passed
      ctx.font = "40px system-ui";
      ctx.fillText("Level 3", CANVASWIDTH / 2 - 59, CANVASHEIGHT / 2 - 40);
      ctx.font = "20px system-ui";
      ctx.fillText("Click to continue", CANVASWIDTH / 2 - 75, CANVASHEIGHT / 2);
    }, 2000); // do this after 2 seconds
  }
};

const L3Passed = () => {
  if (hearts > 0 && L3EnemyArray.length <= 0) {
    // if the player has hearts left and there are no enemies do this
    setTimeout(() => {
      // do this on a timer
      ctx.fillStyle = "black";
      // make the screen black
      ctx.clearRect(0, 0, CANVASHEIGHT, CANVASWIDTH);
      clearInterval(timer); // get rid of the game ticks
      screenName = "gameOver"; // change the screen name for the click handler
      projectileArray.length = 0; // make it so there are no projectiles
      ctx.fillRect(0, 0, CANVASHEIGHT, CANVASWIDTH);
      ctx.fillStyle = "white"; // write text that says the level was passed
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
    }, 2000); // do this after 2 seconds
  }
};

const L1Failed = () => {
  if (hearts <= 0) {
    // if the player has no more hearts do this
    setTimeout(() => {
      ctx.fillStyle = "black"; // set the screen to black
      ctx.clearRect(0, 0, CANVASHEIGHT, CANVASWIDTH);
      clearInterval(timer); // reset the game ticks
      screenName = "gameOver"; // change the screen name for the click handler
      L1EnemyArray.length = 0; // get rid of all enemies
      projectileArray.length = 0; // get rid of all projectiles
      enemyProjectileArray.length = 0; // get rid of all enemy projectiles
      console.log(screenName); // log the screen name
      ctx.fillRect(0, 0, CANVASHEIGHT, CANVASWIDTH); // write text saying the level was failed
      ctx.fillStyle = "white";
      ctx.font = "40px system-ui";
      ctx.fillText("Game over", CANVASWIDTH / 2 - 90, CANVASHEIGHT / 2 - 40);
      ctx.font = "20px system-ui";
      ctx.fillText(
        "Click anywhere to return to main menu",
        CANVASWIDTH / 2 - 170,
        CANVASHEIGHT / 2
      );
    }, 2000); // do this after 2 seconds
  }
};

const L2Failed = () => {
  if (hearts <= 0) {
    // if the player has no more hearts do this
    setTimeout(() => {
      ctx.fillStyle = "black"; // set the screen to black
      ctx.clearRect(0, 0, CANVASHEIGHT, CANVASWIDTH);
      clearInterval(timer); // reset the game ticks
      screenName = "gameOver"; // change the screen name for the click handler
      L1EnemyArray.length = 0; // get rid of all enemies
      L2EnemyArray.length = 0; // get rid of all enemies
      projectileArray.length = 0; // get rid of all projectiles
      enemyProjectileArray.length = 0; // get rid of all enemy projectiles
      L2EnemyProjectileArray.length = 0; // get rid of all enemy projectiles
      console.log(screenName); // log the screen name
      ctx.fillRect(0, 0, CANVASHEIGHT, CANVASWIDTH); // write text saying the level was failed
      ctx.fillStyle = "white";
      ctx.font = "40px system-ui";
      ctx.fillText("Game over", CANVASWIDTH / 2 - 90, CANVASHEIGHT / 2 - 40);
      ctx.font = "20px system-ui";
      ctx.fillText(
        "Click anywhere to return to main menu",
        CANVASWIDTH / 2 - 170,
        CANVASHEIGHT / 2
      );
    }, 2000); // do this after 2 seconds
  }
};

const L3Failed = () => {
  if (hearts <= 0) {
    // if the player has no more hearts do this
    setTimeout(() => {
      ctx.fillStyle = "black"; // set the screen to black
      ctx.clearRect(0, 0, CANVASHEIGHT, CANVASWIDTH);
      clearInterval(timer); // reset the game ticks
      screenName = "gameOver"; // change the screen name for the click handler
      L1EnemyArray.length = 0; // get rid of all enemies
      L2EnemyArray.length = 0; // get rid of all enemies
      L3EnemyArray.length = 0; // get rid of all enemies
      projectileArray.length = 0; // get rid of all projectiles
      enemyProjectileArray.length = 0; // get rid of all enemy projectiles
      L2EnemyProjectileArray.length = 0; // get rid of all enemy projectiles
      L3EnemyProjectileArray.length = 0; // get rid of all enemy projectiles
      console.log(screenName); // log the screen name
      ctx.fillRect(0, 0, CANVASHEIGHT, CANVASWIDTH); // write text saying the level was failed
      ctx.fillStyle = "white";
      ctx.font = "40px system-ui";
      ctx.fillText("Game over", CANVASWIDTH / 2 - 90, CANVASHEIGHT / 2 - 40);
      ctx.font = "20px system-ui";
      ctx.fillText(
        "Click anywhere to return to main menu",
        CANVASWIDTH / 2 - 170,
        CANVASHEIGHT / 2
      );
    }, 2000); // do this after 2 seconds
  }
};

const removePlayer = () => {
  // function which gets rid of the player if the hearts are 0
  if (hearts <= 0) {
    killPlayer = true;
  }
};

class Projectile {
  // class for the projectile
  constructor(x, y) {
    // constructor for the x and y position
    this.x = x;
    this.y = y;
  }
  moveProjectile() {
    // moves the projectile referenced
    this.y -= PROJ_SPEED;
  }
  checkEnemyCollision(enemy) {
    // check if the projectile collided with the enemy
    return (
      this.x > enemy.x &&
      this.x < enemy.x + enemy.width &&
      this.y > enemy.y &&
      this.y < enemy.y + enemy.height
    );
  }
}

class Enemy {
  // enemy class
  constructor(x, y, width, height, pos) {
    // constructor for the x and y position, width, height, and position in the circle
    this.x = x;
    this.y = y;
    this.pos = pos;
    this.height = height;
    this.width = width;
    this.canShoot = true;
  }
  tryShoot() {
    //see if the enemies can shoot
    if (!this.canShoot) return; // if it can't shoot, dont
    if (screenName == "level1") {
      // if it can shoot, spawn a projectile
      enemyProjectileArray.push(
        new L1EnemyProjectile(
          this.x + BASIC_ENEMY_WIDTH / 2 - PROJ_WIDTH / 2,
          this.y
        )
      );
    } else if (screenName == "level2") {
      console.log("level two shoot");
      L2EnemyProjectileArray.push(
        // if it can shoot, spawn a projectile
        new L2EnemyProjectile(
          this.x + BASIC_ENEMY_WIDTH / 2 - PROJ_WIDTH / 2,
          this.y
        )
      );
    } else if (screenName == "level3") {
      console.log("level three shoot"); // if it can shoot, spawn a projectile
      L3EnemyProjectileArray.push(
        new L3EnemyProjectile(
          this.x + BASIC_ENEMY_WIDTH / 2 - PROJ_WIDTH / 2,
          this.y
        )
      );
    }

    this.canShoot = false;
    const shootingDelay = Math.floor(Math.random() * 1000) + 1000; // delay for more randomised shooting
    setTimeout(() => {
      this.canShoot = true;
    }, shootingDelay);
  }
}

class Player {
  // class for the player
  constructor(image, x, y, width, height, pos) {
    // constructor for the player image, x and y position, width, height, and position on the screen
    this.image = image;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.pos = pos;
  }
}

class L1EnemyProjectile {
  // class for the enemy projectiles
  constructor(x, y) {
    // constructor for enemy projectile x and y
    this.x = x;
    this.y = y;
  }
  moveL1EnemyProjectile() {
    // moves the projectiles
    this.y += PROJ_SPEED;
  }
  checkPlayerCollision(player) {
    // see if the projectile hit the player
    return (
      this.x > player.x &&
      this.x < player.x + player.width &&
      this.y > player.y &&
      this.y < player.y + player.height
    );
  }
}

class L2EnemyProjectile {
  // class for level 2 enemy projectiles
  constructor(x, y) {
    // constructor for enemy projectile x and y
    this.x = x;
    this.y = y;
  }
  moveL2EnemyProjectile() {
    // moves the projectiles
    this.y += PROJ_SPEED;
  }
  checkPlayerCollision(player) {
    // see if the projectile hit the player
    return (
      this.x > player.x &&
      this.x < player.x + player.width &&
      this.y > player.y &&
      this.y < player.y + player.height
    );
  }
}

class L3EnemyProjectile {
  // class for the level 3 enemy projectiles
  constructor(x, y) {
    // constructor for enemy projectile x and y
    this.x = x;
    this.y = y;
  }
  moveL3EnemyProjectile() {
    // moves the projectiles
    this.y += PROJ_SPEED;
  }
  checkPlayerCollision(player) {
    // see if the projectile hit the player
    return (
      this.x > player.x &&
      this.x < player.x + player.width &&
      this.y > player.y &&
      this.y < player.y + player.height
    );
  }
}

startCanvas(); // run the start canvas function
spawnNewEnemy();

canvas.addEventListener("click", handleClicks); // run the click handler

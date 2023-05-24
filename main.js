// Name: Εlliott Bell
// Date: 19/5/23
// Iteration 1

let ctx;
let CANVASWIDTH = 500;
let CANVASHEIGHT = 500;
let playerX = CANVASWIDTH / 2;
let playerY = CANVASHEIGHT - 50;
let playerColor = "#45A1E9";

window.onload = startCanvas;

function startCanvas() {
  ctx = document.getElementById("canvas").getContext("2d");
  console.log("canvas started");
  timer = setInterval(updateCanvas, 1000 / 60);
}

updateCanvas = () => {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, CANVASWIDTH, CANVASHEIGHT);
  ctx.fillStyle = "green";
  ctx.fillRect(playerX, playerY, 20, 30);
};

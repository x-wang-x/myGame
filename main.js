const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("myBtn");

const input1 = document.querySelector("body > input.input1");
const input2 = document.querySelector("body > input.input2");

canvas.width = 480;
canvas.height = 320;

let spriteSize = 16;
let spriteLoaded = [false, null];
const delay = (delayInms) => {
  return new Promise((resolve) => setTimeout(resolve, delayInms));
};

function clearScreen(color = "black") {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function loadSpritesheet(link = "./assets/Sprite-0001.png") {
  const sprites = new Image();
  sprites.src = link;
  sprites.onload = () => {
    spriteLoaded = [true, sprites];
    ctx.fillText("SXSXSX", 16, 16);
  };
}
window.onload = () => {
  console.log("Windows Loaded", Date.now());
  ctx.fillText("SSSS", 160, 160);
  loadSpritesheet();
};

function sprite(src, size = spriteSize) {
  let data = [];

  let horiz = src.width;
  let ver = src.height;
  for (let x = 0; x < ver; x += size) {
    for (let i = 0; i < horiz; i += size) {
      data.push([i, x]);
    }
  }
  console.log(data);
  return data;
}

function mapper(src, data) {
  const x = spriteLoaded;
  console.log(x);
  const sprites = sprite(x[1]);
  data = data["mapData"];
  let drawX = 0;
  let drawY = 0;
  const spriteXs = spriteSize;
  const spriteYs = spriteSize;

  for (i in data) {
    const spriteX = sprites[parseInt(data[i]) - 1][0];
    const spriteY = sprites[parseInt(data[i]) - 1][1];
    if (drawX >= canvas.width) {
      drawX = 0;
      drawY += spriteSize;
    }
    ctx.drawImage(
      x[1],
      spriteX,
      spriteY,
      spriteXs,
      spriteYs,
      drawX,
      drawY,
      spriteSize,
      spriteSize
    );

    drawX += spriteSize;

    console.log(drawX, drawY, parseInt(data[i])) + 1;
  }
}

function myFunction() {
  fetch("./data.json")
    .then((response) => response.json())
    .then((json) => mapper("./assets/Sprite-0001.png", json));
}

startButton.addEventListener("click", myFunction);
input2.addEventListener("click", clearScreen);

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const input = document.querySelector("#input");

let showMessage = true;
let resourceloaded = false;

function showMsg(msg) {
  if (showMessage) {
    console.log(msg);
  }
}
function createCanvas(w, h) {
  canvas.width = w;
  canvas.height = h;
  showMsg("Canvas Created");
}
function fillCanvas(color = "black") {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, ctx.width, ctx.height);
  showMsg("Canvas Filled : " + color);
}

function loadSpritesheet(link) {
  const sprites = new Image();
  sprites.src = link;
  showMsg("TryingLoad SpreadSheet");
  return new Promise((resolve) => {
    sprites.onload = () => {
      resolve(sprites);
      showMsg("Done load SpreadSheet");
      resourceloaded = true;
    };
  });
}

function spreadSpriteSheet(src, size = spriteSize) {
  let data = [];

  let horiz = src.width;
  let ver = src.height;
  for (let x = 0; x < ver; x += size) {
    for (let i = 0; i < horiz; i += size) {
      data.push([i, x]);
    }
  }
  return data;
}
function drawImage(con, datas = []) {
  console.log(datas);
  datas.forEach((data) => {
    const src = data[0];
    const id = data[1];
    const x = data[2];
    const y = data[3];
    const size = data[4];
    showMsg("Draw Image : " + x + "," + y);
    con.drawImage(src, id[0], id[1], 16, 16, x, y, size, size);
  });
}
function showText(text) {
  document.querySelector("#p1").innerHTML = text;
}
window.onload = async () => {
  createCanvas(480, 320);
  const link = "./assets/chibi-layered.png";
  const sprite = await loadSpritesheet(link);
  const dataSprite = spreadSpriteSheet(sprite, 16);

  if (!resourceloaded) {
    console.log("Resource not loaded");
    return;
  }
  document.querySelector("body > button").onclick = () => {
    const id = parseInt(input.value);
    if (id > dataSprite.length) {
      console.log("Out of range");
      return;
    }
    image1 = [sprite, dataSprite[id], canvas.width / 2, canvas.height / 2, 16];
    image2 = [sprite, dataSprite[id], 0, 0, 16];
    image = [image1, image2];
    drawImage(ctx, image);
    showText("Sprite id : " + id);
  };

  let ids = 0;
  window.onkeydown = (e) => {
    const key = e.key;
    if (ids > dataSprite.length - 1 || ids < 0) {
      console.log("Out of range");
    } else {
      image1 = [
        sprite,
        dataSprite[ids],
        canvas.width / 2,
        canvas.height / 2,
        16,
      ];
      image2 = [sprite, dataSprite[ids], 0, 0, 16];

      image = [image1, image2];
      drawImage(ctx, image);
    }
    if (key == "ArrowLeft") {
      ids--;
      input.value = ids;
      showText(key + " Clicked ! sprite id : " + ids);
    } else if (key == "ArrowRight") {
      ids++;
      input.value = ids;
      showText(key + " Clicked ! sprite id : " + ids);
    }
  };
};

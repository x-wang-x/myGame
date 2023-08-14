const input = document.querySelector("#input");

let showMessage = true;
let resourceloaded = false;

class Sprite {
  constructor(src, size) {
    this.src = src;
    this.sprite = new Image();
    this.sprite.src = src;
    this.size = size;
    this.data = [];
  }
  load() {
    showMsg("TryingLoad SpreadSheet");
    return new Promise((resolve) => {
      this.sprite.onload = () => {
        showMsg("Done load SpreadSheet : " + this.src);
        resourceloaded = true;
        resolve(this.sprite);
      };
    });
  }
  spread() {
    return new Promise((resolve) => {
      const src = this.sprite;
      const horiz = src.width;
      const ver = src.height;
      for (let x = 0; x < ver; x += this.size) {
        for (let i = 0; i < horiz; i += this.size) {
          this.data.push([i, x]);
        }
      }
      showMsg("SpreadSheet Data : " + this.data.length + " data");
      resolve(this.data);
    });
  }
  async mapper(canvas, mapdata) {
    const resData = (await fetch(mapdata)).json();
    const sprite = await this.load();
    const sprites = await this.spread();
    if (sprites.length <= 0) {
      showMsg("Sprite data not found");
      return;
    }

    const data = await resData;
    const width = parseInt(data["pixelSize"]) * parseInt(data["tileSize"][0]);
    const height = parseInt(data["pixelSize"]) * parseInt(data["tileSize"][1]);
    const map = data["mapData"];
    let drawX = 0;
    let drawY = 0;
    const spriteXs = this.size;
    const spriteYs = this.size;
    if (data.length >= width * height) {
      showMsg("Map data too large");
      return;
    }
    if (data.length <= width * height) {
      showMsg("Map data too small");
      return;
    }
    for (let i in map) {
      const spriteX = await sprites[parseInt(map[i]) - 1][0];
      const spriteY = await sprites[parseInt(map[i]) - 1][1];
      if (drawX >= width) {
        drawX = 0;
        drawY += this.size;
      }
      const image1 = [sprite, [spriteX, spriteY], drawX, drawY, 16];
      canvas.drawImage(image1);
      drawX += this.size;
    }
    showMsg("Mapper Done");
  }
}

class Canvas {
  constructor(w, h) {
    this.canvas = document.querySelector("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.width = w;
    this.height = h;
    this.createCanvas();
  }
  createCanvas() {
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    showMsg("Canvas Created");
  }
  fillCanvas(color = "black") {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    showMsg("Canvas Filled : " + color);
  }
  drawImage(data) {
    const src = data[0];
    const id = data[1];
    const x = data[2];
    const y = data[3];
    const size = data[4];
    showMsg("Draw Image : " + x + "," + y);
    this.ctx.drawImage(src, id[0], id[1], size, size, x, y, size, size);
  }
}

function showMsg(msg) {
  if (showMessage) {
    console.log(msg);
    document.querySelector("#p1").innerHTML = msg;
  }
}

function showText(text) {
  document.querySelector("#p1").innerHTML = text;
}
window.onload = async () => {
  const canvas = new Canvas(480, 320);
  const sprt = new Sprite("./assets/chibi-layered.png", 16);
  const sprite = await sprt.load();
  const dataSprite = await sprt.spread();
  const map = new Sprite("./assets/Sprite-0001.png", 16);
  await map.mapper(canvas, "./data.json");
  if (!resourceloaded) {
    showMsg("Resource not loaded");
    return;
  }
  document.querySelector("body > button").onclick = () => {
    const id = parseInt(input.value);
    if (id > dataSprite.length - 1) {
      showMsg("Sprite id not found");
      return;
    }
    image1 = [sprite, dataSprite[id], canvas.width / 2, canvas.height / 2, 16];
    canvas.drawImage(image1);
    showText("Sprite id : " + id);
  };
  setTimeout(() => {
    document.querySelector("#p1").innerHTML = "";
  }, 5000);
};

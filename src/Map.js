import { getPointer, SpriteSheet, loadImage, Sprite } from "./kontra";
import mapSheet from "./assets/imgs/m.png";

class Map {
  constructor(canvas) {
    this.canvas = canvas;
  }

  async init() {
    window.addEventListener("click", this.#onDownHandler.bind(this));
    const mapImage = await loadImage(mapSheet);

    const s = {
      frameWidth: 16,
      frameHeight: 16,
      spacing: 0,
      margin: 0,
      animations: {
        grass: {
          frames: 0
        },
        wall: {
          frames: 1
        }
      },
      image: mapImage,
    };

    const spritesheet = SpriteSheet(s);

    this.map = [];
    for (let y = 0; y < 13; y++) {
      for (let x = 0; x < 20; x++) {
        const sprite = new Sprite({
          x: x * 16,
          y: y * 16,
          animations: spritesheet.animations
        })
        if (y < 3 || y > 11) {
          sprite.playAnimation("wall");
        }
        this.map.push(sprite);
      }
    }
  }

  isOutOfBounds({ y }) {
    console.log("y", y);
    if (y <= 50 || y >= 192) {
      return true;
    }

    return false;
  }

  handleMapClick(callback) {
    window.addEventListener("mapClick", (event) => {
      callback(event.detail);
    });
  }

  render() {
    this.map.forEach((m) => m.render());
  }

  #onDownHandler(e) {
    if (e.target !== this.canvas) {
      return;
    }

    const { x, y } = getPointer();
    const outOfBounds = this.isOutOfBounds({ y });
    const event = new CustomEvent("mapClick", {
      detail: { x, y, outOfBounds },
    });
    window.dispatchEvent(event);
  }
}

async function initMap(canvas) {
  const map = new Map(canvas);
  await map.init();

  return map;
}

export { initMap };

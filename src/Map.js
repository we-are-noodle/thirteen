import { getPointer, loadImage, TileEngine, track } from "kontra";

import greenTileset from "./assets/imgs/PFT_EngravedGreen00.png";
import sandTileset from "./assets/imgs/PFT_GroundSand00.png";
import brickTileset from "./assets/imgs/PWT_BasicBrick00.png";
import mapData from "./assets/data/dungeon.json";

class Map {
  constructor() {
    this.tileEngine = null;
  }

  async init() {
    const [greenTilesetImg, sandTilesetImg, brickTilesetImg] =
      await Promise.all([
        loadImage(greenTileset),
        loadImage(sandTileset),
        loadImage(brickTileset),
      ]);

    // Tiled gives us a path to the image, but because Parcel will change the path to the image, we
    // have to load the it ourselves.
    mapData.tilesets[0].image = brickTilesetImg;
    mapData.tilesets[1].image = sandTilesetImg;
    mapData.tilesets[2].image = greenTilesetImg;

    this.tileEngine = TileEngine({
      ...mapData,
      onDown: (e) => {
        e.preventDefault();
        this.#onDownHandler();
      },
    });
    track(this.tileEngine);
  }

  isOutOfBounds({ x, y }) {
    return this.tileEngine.tileAtLayer("outOfBounds", { x, y });
  }

  handleMapClick(callback) {
    window.addEventListener("mapClick", (event) => {
      callback(event.detail);
    });
  }

  render() {
    this.tileEngine.render();
  }

  #onDownHandler() {
    const { x, y } = getPointer();
    const outOfBounds = this.tileEngine.tileAtLayer("outOfBounds", { x, y });
    const event = new CustomEvent("mapClick", {
      detail: { x, y, outOfBounds },
    });
    window.dispatchEvent(event);
  }
}

async function initMap() {
  const map = new Map();
  await map.init();

  return map;
}

export { initMap };

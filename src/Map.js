import { getPointer, loadImage, TileEngine, track } from "kontra";

import mapImg from "./assets/imgs/forrest.png";
import mapData from "./assets/data/forrest.json";

class Map {
  constructor() {
    this.tileEngine = null;
  }

  async init() {
    // Tiled gives us a path to the image, but because Parcel will change the path to the image, we
    // have to load the it ourselves.
    mapData.tilesets[0].image = await loadImage(mapImg);
    this.tileEngine = TileEngine({
      ...mapData,
      onDown: () => this.#onDownHandler(),
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

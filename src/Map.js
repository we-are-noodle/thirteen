import { getPointer } from "./kontra";

class Map {
  constructor(canvas) {
    this.canvas = canvas;
  }

  async init() {
    window.addEventListener("click", this.#onDownHandler.bind(this));
  }

  isOutOfBounds({ y }) {
    if (y <= 50) {
      return true;
    }

    return false;
  }

  handleMapClick(callback) {
    window.addEventListener("mapClick", (event) => {
      callback(event.detail);
    });
  }

  render() {}

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

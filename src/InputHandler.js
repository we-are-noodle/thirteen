import { getPointer, onInput, onKey, pointerPressed } from "kontra";

export default class InputHandler {
  constructor(selected, tileEngine) {
    this.selected = selected;
    onInput("down", () => {
      if (pointerPressed("left")) {
        const pointer = getPointer();
        if (tileEngine.tileAtLayer("outOfBounds", pointer)) {
          return;
        }

        // const x =
        //   Math.floor(pointer.x / tileEngine.tilewidth) * tileEngine.tilewidth;
        // const y =
        //   Math.floor(pointer.y / tileEngine.tileheight) * tileEngine.tileheight;

        this.selected.target = {
          x: pointer.x - this.selected.width / 2,
          y: pointer.y - this.selected.height / 2,
        };
      }
    });
  }

  setKeybind(key, selected) {
    onKey(key, () => {
      this.selected = selected;
    });
  }
}

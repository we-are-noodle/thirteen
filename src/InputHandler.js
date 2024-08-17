import { getPointer, onInput, onKey, pointerPressed } from "kontra";

export default class InputHandler {
  constructor(selected, map) {
    this.selected = selected;
    onInput("down", () => {
      if (pointerPressed("left")) {
        const pointer = getPointer();
        if (map.isOutOfBounds(pointer)) {
          return;
        }

        this.selected.target = { x: pointer.x, y: pointer.y };
      }
    });
  }

  setKeybind(key, selected) {
    onKey(key, () => {
      this.selected = selected;
    });
  }
}

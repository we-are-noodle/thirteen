import {getPointer, onInput, onKey, pointerPressed} from "kontra";

export default class InputHandler {
  constructor(selected) {
    this.selected = selected;
    onInput("down", () => {
      if (pointerPressed("left")) {
        const pointer = getPointer();
        this.selected.target = { x: pointer.x - 10, y: pointer.y - 20 };
      }
    });
  }

  setKeybind(key, selected) {
    onKey(key, () => {
      this.selected = selected;
    });
  }
}
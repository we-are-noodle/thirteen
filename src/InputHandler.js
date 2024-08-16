import {
  getPointer,
  initInput,
  initPointer,
  onInput,
  onKey,
  pointerPressed,
} from "kontra";

export default class InputHandler {
  constructor(selected) {
    initPointer();
    initInput();

    this.selected = selected;
    onInput("down", () => {
      if (pointerPressed("left")) {
        const pointer = getPointer();
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

import { SpriteClass } from "./kontra";

export default class CharacterSelected extends SpriteClass {
  init(properties) {
    super.init(properties);

    this.width = 4;
    this.height = 4;
    this.y -= 5;
    this.anchor = { x: 0.5, y: 0.5 };
  }

  update() {
    this.advance();
  }

  draw() {
    if (this.parent.isSelected) {
      this.context.strokeStyle = "#FFE629";
      this.context.lineWidth = 2;
      this.context.beginPath();
      this.context.ellipse(this.x + 16, this.y + 32, 6, 2, 0, 0, Math.PI);
      this.context.stroke();
    }
  }
}

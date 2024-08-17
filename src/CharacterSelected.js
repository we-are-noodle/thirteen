import { SpriteClass } from "kontra";

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
      // draw a yellow cirlce above the character
      this.context.fillStyle = "yellow";
      this.context.beginPath();
      this.context.arc(this.x + 2, this.y, 2, 0, 2 * Math.PI);
      this.context.fill();
    }
  }
}

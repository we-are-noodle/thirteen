import { SpriteClass } from "kontra";

export default class CharacterSelected extends SpriteClass {
  init(props) {
    super.init(props);

    this.width = 4;
    this.height = 4;
    this.y -= 5;
    this.anchor = { x: 0.5, y: 0.5 };
    this.opacity = 0.8;
    this.color = props?.color || "#0090FF";
  }

  update() {
    this.advance();
  }

  draw() {
    if (this.parent.showOutline) {
      this.context.strokeStyle = this.color;
      this.context.lineWidth = 2;
      this.context.beginPath();
      this.context.ellipse(this.x + 2, this.y + 18, 6, 2, 0, 0, Math.PI);
      this.context.stroke();
    }
  }
}

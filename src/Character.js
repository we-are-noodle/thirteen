import { angleToTarget, movePoint, SpriteClass } from "kontra";

export default class Character extends SpriteClass {
  init(properties) {
    super.init(properties);
    this.target = null;
    this.speed = properties.speed || 2;
    this.anchor = { x: 0.5, y: 0.5 };
  }

  update() {
    this.advance();
    if (this.target) {
      const distance = Math.hypot(
        this.target.x - this.x,
        this.target.y - this.y,
      );
      if (distance > this.speed) {
        const ang = angleToTarget(this, this.target);
        const { x, y } = movePoint(this, ang, this.speed);
        this.x = x;
        this.y = y;
      } else {
        this.target = null;
      }
    }
  }
}

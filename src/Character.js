import { angleToTarget, movePoint, SpriteClass } from "kontra";

export default class Character extends SpriteClass {
  init(properties) {
    super.init(properties);
    this.target = null;
    this.speed = properties.speed || 1;
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
        this.x = Math.round(x);
        this.y = Math.round(y);
        this.playAnimation("walk");
      } else {
        this.target = null;
        this.playAnimation("idle");
      }
    }
  }
}

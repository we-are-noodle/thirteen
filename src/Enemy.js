import { angleToTarget, movePoint, SpriteClass } from "kontra";

export default class Enemy extends SpriteClass {
  init(properties) {
    super.init(properties);

    this.width = 16;
    this.height = 16;
    this.anchor = { x: 0.5, y: 0.5 };
    this.movingTo = null;
    this.speed = properties.speed || 1;
  }

  moveTo({ x, y }) {
    this.movingTo = { x, y };
  }

  update() {
    this.advance();
    if (this.movingTo) {
      const distance = Math.hypot(
        this.movingTo.x - this.x,
        this.movingTo.y - this.y,
      );
      if (distance > this.speed) {
        const ang = angleToTarget(this, this.movingTo);
        const { x, y } = movePoint(this, ang, this.speed);
        this.x = Math.round(x);
        this.y = Math.round(y);
        this.playAnimation("walk");
      }
      // else if (collision detection stuff) {
      //   this.playAnimation("attack");
      // }
      else {
        this.movingTo = null;
        this.playAnimation("idle");
      }
    }
  }
}

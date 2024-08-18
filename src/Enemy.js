import { angleToTarget, movePoint, collides, SpriteClass } from "kontra";

export default class Enemy extends SpriteClass {
  init(properties) {
    super.init(properties);

    this.width = 16;
    this.height = 16;
    this.anchor = { x: 0.5, y: 0.5 };
    this.target = null;
    this.speed = properties.speed || 1;
  }

  update() {
    this.advance();

    if (collides(this.target, this)) {
        this.playAnimation("attack");
    } else {
      this.playAnimation("idle");
    }
  }
}

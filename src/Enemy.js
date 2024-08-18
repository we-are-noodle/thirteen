import { angleToTarget, movePoint, collides, SpriteClass } from "kontra";

export default class Enemy extends SpriteClass {
  init(properties) {
    super.init(properties);

    this.health = 100;

    this.width = 16;
    this.height = 16;
    this.anchor = { x: 0.5, y: 0.5 };
    this.target = null;
    this.speed = properties.speed || 1;
    this.cooldown = false;
  }

  attackTarget() {
      this.playAnimation("attack");
      this.target.takeDamage(10);
  }

  update() {
    this.advance();

    if (collides(this.target, this) && this.cooldown == false && this.target.isAlive()) {
      this.attackTarget();
      this.cooldown = true;
      setTimeout(() => this.cooldown = false, 500);
    } else {
      this.playAnimation("idle");
    }
  }
}

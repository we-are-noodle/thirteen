import { angleToTarget, movePoint, SpriteClass } from "kontra";

import CharacterSelected from "./CharacterSelected";

export default class Character extends SpriteClass {
  init(properties) {
    super.init(properties);

    this.health = 100;
    this.width = 16;
    this.height = 16;
    this.anchor = { x: 0.5, y: 0.5 };
    this.movingTo = null;
    this.speed = properties.speed || 1;
    this.isSelected = false;

    this.addChild(new CharacterSelected());
  }

  moveTo({ x, y }) {
    this.movingTo = { x, y };
  }

  isAlive() {
    return this.health > 0;
  }

  takeDamage(damage) {
    console.log(damage);
    return this.health -= damage;
  }

  update() {
    this.advance();
    // if (Math.random() < 0.01) {
    //   this.health -= 10;
    // }
    if (!this.isAlive()) {
      this.playAnimation("dead");
      return;
    }

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
      } else {
        this.movingTo = null;
        this.playAnimation("idle");
      }
    }
  }
}

import { angleToTarget, movePoint, randInt, collides, SpriteClass } from "kontra";

import CharacterSelected from "./CharacterSelected";

export default class Character extends SpriteClass {
  init(properties) {
    super.init(properties);

    this.health = 100;
    this.width = 16;
    this.height = 16;
    this.anchor = { x: 0.5, y: 0.5 };
    this.movingTo = null;
    this.target = null;
    this.speed = properties.speed || 1;
    this.isSelected = false;
    this.cooldown = false;

    this.addChild(new CharacterSelected());
  }

  moveTo({ x, y }) {
    this.movingTo = { x, y };
  }

  isAlive() {
    return this.health > 0;
  }

  // We might want to also move this to the character classes to see if taking damage differs based on class
  takeDamage(damage) {
    console.log(`Character took ${damage} damage.`);
    return this.health -= damage;
  }

  // Specific attacks will be moven to character class
  basicAttack() {
    return randInt(7, 12);
  }

  attackTarget() {
    this.target.takeDamage(this.basicAttack());
    this.playAnimation("attack");
    console.log("Character Attacking!");
  }

  update() {
    this.advance();
    if (!this.isAlive()) {
      this.playAnimation("dead");
      return;
    }

    if (this.movingTo) {
      const distance = Math.hypot(
        this.movingTo.x - this.x,
        this.movingTo.y - this.y,
      );

    //target
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
      } else if (collides(this.target, this) && this.cooldown == false && this.target.isAlive()) {
      this.attackTarget();
      this.cooldown = true;
      setTimeout(() => this.cooldown = false, 1000);
      } else {
        this.movingTo = null;
        this.playAnimation("idle");
      }
    }
  }
}

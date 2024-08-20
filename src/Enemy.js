import {
  angleToTarget,
  movePoint,
  collides,
  SpriteClass,
  randInt,
  rand,
} from "kontra";

export default class Enemy extends SpriteClass {
  init(properties) {
    super.init(properties);

    this.health = 100;

    this.width = 16;
    this.height = 16;
    this.anchor = { x: 0.5, y: 0.5 };
    this.target = null;
    this.speed = properties.speed || 1;

    // setting this to 1 ensures we attack immediately
    this.timeSinceLastAttack = 1;
  }

  isAlive() {
    return this.health > 0;
  }

  takeDamage(damage) {
    console.log(damage);
    this.health -= damage;
  }

  basicAttack() {
    return randInt(1, 25);
  }

  attackTarget() {
    this.target.takeDamage(this.basicAttack());
    if (this.currentAnimation.name !== "attack") {
      this.playAnimation("attack");
    }
  }

  update(dt) {
    this.advance();

    if (!this.isAlive()) {
      this.playAnimation("dead");
      return;
    }

    // to do
    //abstract out collision and attack here
    // set variable state to is attacking
    // handle animations in one loop

    if (this.target && this.target.isAlive() && collides(this, this.target)) {
      if (this.timeSinceLastAttack >= 1) {
        this.attackTarget();
        this.timeSinceLastAttack = 0;
      }

      this.timeSinceLastAttack += dt;
    } else {
      this.playAnimation("idle");
      // this makes it so when you move away and back in you get hit immediately
      this.timeSinceLastAttack = 1;
    }
  }
}

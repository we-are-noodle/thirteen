import { angleToTarget, movePoint, collides, SpriteClass, randInt, rand } from "kontra";

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

  isAlive() {
    return this.health > 0;
  }

  takeDamage(damage) {
    console.log(damage);
    return this.health -= damage;
  }

  basicAttack() {
    return randInt(1, 10);
  }

  attackTarget() {
    this.target.takeDamage(this.basicAttack());
    this.playAnimation("attack");
  }

  update() {
    this.advance();

    // if (!this.isAlive()) {
    //   this.playAnimation("dead");
    //   return;
    // }

    // to do
    //abstract out collision and attack here
    // set variable state to is attacking
    // handle animations in one loop


      if (!this.isAlive()) {
        this.playAnimation("dead");
      } else if (collides(this.target, this) && this.cooldown == false && this.target.isAlive()) {
      this.attackTarget();
      this.cooldown = true;
      setTimeout(() => this.cooldown = false, 1000);
      } else {
      this.playAnimation("idle");
    }
  }
}

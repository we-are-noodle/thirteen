import {
  angleToTarget,
  movePoint,
  collides,
  SpriteClass,
  randInt,
} from "./kontra";

import HealthBar from "./HealthBar";
import CharacterOutline from "./CharacterOutline";

export default class Enemy extends SpriteClass {
  init(props) {
    super.init({
      ...props,
      anchor: { x: 0.5, y: 0.5 },
    });

    this.mh = 100;
    this.h = this.mh;

    this.d = null;
    this.a = null;
    this.damage = 5;
    this.width = 32;
    this.height = 32;
    this.target = null;
    this.speed = props.speed || 1;

    // setting this to 1 ensures we attack immediately
    this.timeSinceLastAttack = 1;

    this.co = new CharacterOutline({ parent: this, color: "#E54D2E" });
  }

  iA() {
    return this.h > 0;
  }

  dodgeAttack() {
    if (randInt(1, 100) <= this.d) {
      return true;
    }
    return false;
  }

  blockAttack() {
    if (randInt(1, 100) <= this.a) {
      return true;
    }
    return false;
  }

  takeDamage(damage) {
    if (this.blockAttack() || this.dodgeAttack()) {
      return;
    }
    this.h -= damage;
  }

  attackTarget() {
    this.target.takeDamage(this, this.damage);
    if (this.currentAnimation.name !== "attack") {
      this.playAnimation("attack");
    }
  }

  collidesWithPointer(pointer) {
    return (
      pointer.x > this.x - this.width / 2 &&
      pointer.x < this.x + this.width / 2 &&
      pointer.y > this.y - this.height / 2 &&
      pointer.y < this.y + this.height / 2
    );
  }

  update(dt) {
    this.advance();

    if (!this.iA()) {
      this.playAnimation("dead");
      this.so = false;
      this.opacity = 0.5;
      return;
    }

    if (!this.target || !this.target.iA()) {
      // pick a random target
      const characters = this.characters;
      this.target = characters[randInt(0, characters.length - 1)];
    }

    if (this.target && this.target.iA()) {
      if (this.target.x < this.x) {
        this.scaleX = -1;
      } else {
        this.scaleX = 1;
      }
      if (
        !collides(
          {
            x: this.x - 8,
            y: this.y - 8,
            width: 8,
            height: 8,
          },
          this.target,
        )
      ) {
        const ang = angleToTarget(this, this.target);
        const { x, y } = movePoint(this, ang, this.speed);
        this.x = x;
        this.y = y;
        this.playAnimation("w");
      }
    }

    if (
      this.target &&
      this.target.iA() &&
      collides(
        {
          x: this.x - 8,
          y: this.y - 8,
          width: 8,
          height: 8,
        },
        this.target,
      )
    ) {
      if (this.timeSinceLastAttack >= 1) {
        this.attackTarget();
        this.timeSinceLastAttack = 0;
      }

      this.timeSinceLastAttack += dt;
    } else {
      this.playAnimation("i");
      // this makes it so when you move away and back in you get hit immediately
      this.timeSinceLastAttack = 1;
    }
  }

  draw() {
    super.draw();

    this.co.draw();

    if (this.iA()) {
      const healthBar = new HealthBar({
        parent: this,
        combatant: this,
        maxWidth: 12,
        height: 2,
        x: 10,
        y: 0,
      });
      healthBar.render();
    }
  }
}

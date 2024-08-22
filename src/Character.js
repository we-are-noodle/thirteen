import { angleToTarget, movePoint, randInt, collides, SpriteClass, keyPressed } from "kontra";

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
    this.friendlyTarget = null;
    this.speed = properties.speed || 1;
    this.isSelected = false;

    // setting this to 1 ensures we attack immediately
    this.timeSinceLastAttack = 1;
    this.timeSinceLastHeal = 1;

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
   this.health -= damage;
  }

  gainHealth(heal) {
    this.health += heal;
  }

  // Specific attacks will be moven to character class
  basicAttack() {
    return randInt(10, 12);
  }

  // Abilities
  // We can move this to the appropriate classes after testing

  breathOfLife() {
    console.log(this.friendlyTarget.health);
    if (this.friendlyTarget.health < 80) {
      this.friendlyTarget.health += 20;
    } else {
      this.friendlyTarget.health = 100;
    }
    if (this.currentAnimation.name !== "attack") {
      this.playAnimation("attack");
    }
    console.log("Character healed!");
  }

  attackTarget() {
    this.target.takeDamage(this.basicAttack());
    console.log("Character Attacking!");
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

      if (this.friendlyTarget && this.friendlyTarget.isAlive() && keyPressed('q')) {
        if (this.timeSinceLastHeal >= 1) {
          this.breathOfLife();
          this.timeSinceLastHeal = 0;
        }

        this.timeSinceLastHeal += dt;
      }

      if (distance > this.speed) {
        const ang = angleToTarget(this, this.movingTo);
        const { x, y } = movePoint(this, ang, this.speed);
        this.x = Math.round(x);
        this.y = Math.round(y);
        this.playAnimation("walk");
      } else if (this.target && this.target.isAlive() && collides(this, this.target)) {
      if (this.timeSinceLastAttack >= 1) {
        this.attackTarget();
        this.timeSinceLastAttack = 0;
      }

      this.timeSinceLastAttack += dt;
      } else {
        this.movingTo = null;
        this.playAnimation("idle");
        this.timeSinceLastAttack = 1;
      }
    }
  }
}

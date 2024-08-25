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
    this.target = null;
    this.friendlyTarget = null;
    this.speed = properties.speed || 1;
    this.isSelected = false;

    this.addChild(new CharacterSelected());

    this.abilities = [];
  }

  addAbility(ability) {
    this.abilities.push(ability);
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

  update(dt) {
    this.advance();

    if (!this.isAlive()) {
      this.playAnimation("dead");
      return;
    }

    // abilities need delta time to properly track cooldowns
    this.abilities.forEach((a) => a.update(dt));

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
      } else {
        this.movingTo = null;
        this.playAnimation("idle");

        // this makes it so when you move away and back in you get hit immediately
        // not all characters should have this
        if (this.basicAttack?.isMelee()) {
          this.basicAttack?.resetCooldown();
        }
      }
    }
  }
}

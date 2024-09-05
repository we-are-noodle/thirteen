import { angleToTarget, movePoint, randInt, SpriteClass } from "kontra";

import CharacterSelected from "./CharacterSelected";
import {getDistance} from "./utils.js";
import CharacterOutline from "./CharacterOutline";

export default class Character extends SpriteClass {
  init(props) {
    super.init({
      ...props,
    });

    this.maxHealth = 100;
    this.health = this.maxHealth;
    this.dexterity = null;
    this.armor = null;
    this.width = 16;
    this.height = 16;
    this.anchor = { x: 0.5, y: 0.5 };
    this.movingTo = null;
    this.target = null;
    this.friendlyTarget = null;
    this.speed = props.speed || 1;
    this.isSelected = false;

    this.addChild(new CharacterSelected());
    this.addChild(new CharacterOutline());

    this.abilities = [];
    this.enemies = [];
  }

  setEnemeies(enemies) {
    this.enemies = enemies;
    this.showOutline = false;
  }

  collidesWithPointer(pointer) {
    return (
      pointer.x > this.x - this.width / 2 &&
      pointer.x < this.x + this.width / 2 &&
      pointer.y > this.y - this.height / 2 &&
      pointer.y < this.y + this.height / 2
    );
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

  dodgeAttack() {
    if (randInt(1, 100) <= this.dexterity) {
      console.log("Character dodged attack!");
      return true;
    }
    console.log(this.dexterity);
    return false;
    // when we want to remove console logs, we can refactor to the following:
    // return randInt(1,100) <= this.dexterity ? true : false;
  }

  blockAttack() {
    if (randInt(1, 100) <= this.armor) {
      console.log("Character blocked attack!");
      return true;
    }
    console.log(this.armor);
    return false;
    // when we want to remove console logs, we can refactor to the following:
    // return randInt(1,100) <= this.armor ? true : false;
  }

  takeDamage(damage) {
    // do we want the percentages to aggregate like below?
    if (this.blockAttack() || this.dodgeAttack()) {
      return;
    }
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

    // Temporary logic to target the nearest enemy
    if (!this.target?.isAlive() && this.enemies.length > 0) {
      this.enemies.forEach((enemy) => {
        if (!this.target) {
          this.target = enemy;
        }

        if (enemy.isAlive() && getDistance(this, enemy) < getDistance(this, this.target)) {
          this.target = enemy;
        }
      })
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
        this.isMoving = true;
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

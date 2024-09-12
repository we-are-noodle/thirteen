import {
  angleToTarget,
  movePoint,
  collides,
  SpriteClass,
  randInt,
} from "kontra";

import HealthBar from "./HealthBar";
import CharacterOutline from "./CharacterOutline";

export default class Enemy extends SpriteClass {
  init(props) {
    super.init({
      ...props,
      anchor: { x: 0.5, y: 0.5 },
    });

    this.maxHealth = 100;
    this.health = this.maxHealth;

    this.dexterity = null;
    this.armor = null;
    this.damage = 15;
    this.probability = 10;
    this.amplification = 2;
    this.width = 16;
    this.height = 16;
    this.target = null;
    this.speed = props.speed || 1;

    // setting this to 1 ensures we attack immediately
    this.timeSinceLastAttack = 1;

    this.addChild(new CharacterOutline({ color: "#E54D2E" }));
  }

  isAlive() {
    return this.health > 0;
  }

  dodgeAttack() {
    if (randInt(1, 100) <= this.dexterity) {
      console.log("Enemy dodged attack!");
      return true;
    }
    return false;
  }

  blockAttack() {
    if (randInt(1, 100) <= this.armor) {
      console.log("Enemy blocked attack!");
      return true;
    }
    console.log(this.armor);
    return false;
  }

  takeDamage(damage) {
    // do we want the percentages to aggregate like below?
    if (this.blockAttack() || this.dodgeAttack()) {
      return;
    }
    console.log(`Enemy took ${damage} damage.`);
    this.health -= damage;
  }

  //

  basicAttack(damage) {
    return randInt(5, damage);
  }

  criticalHit(probability, amplification, damage) {
    return;
    if (randInt(1, 100) <= probability) {
      console.log("character took Critical Hit!");
      return damage * amplification;
    } else {
      return damage;
    }
    // below can be the final version, I just wanted to have it console log
    // for the time being.
    // return randInt(1,100) <= probability ? damage * amplification : damage;
  }

  attackTarget() {
    return;
    let damage = this.criticalHit(
      this.probability,
      this.amplification,
      this.basicAttack(this.damage),
    );
    console.log(damage);
    this.target.takeDamage(damage);
    if (this.currentAnimation.name !== "attack") {
      this.playAnimation("attack");
    }
    console.log("Enemy Attacking!");
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

    if (!this.isAlive()) {
      this.playAnimation("dead");
      this.dx = 0;
      this.dy = 0;
      return;
    }

    if (!this.target || !this.target.isAlive()) {
      // pick a random target
      const characters = this.characters;
      this.target = characters[randInt(0, characters.length - 1)];
    }

    // move back and forth
    // if (this.x < randInt(90, 100)) {
    //   this.dx = this.speed;
    // } else if (this.x > randInt(180, 200)) {
    //   this.dx -= this.speed;
    // }

    // move up and down
    // if (this.y < 100) {
    //   this.dy = this.speed;
    // } else if (this.y > 150) {
    //   this.dy -= this.speed;
    // }

    // to do
    //abstract out collision and attack here
    // set variable state to is attacking
    // handle animations in one loop
    //
    if (this.target && this.target.isAlive()) {
      const thisCollisionTarget = {
        x: this.x - 8,
        y: this.y - 8,
        width: 8,
        height: 8,
      };
      if (!collides(thisCollisionTarget, this.target)) {
        if (this.target.x < this.x) {
          this.scaleX = -1;
        } else {
          this.scaleX = 1;
        }
        const ang = angleToTarget(this, this.target);
        const { x, y } = movePoint(this, ang, this.speed);
        this.x = x;
        this.y = y;
        this.playAnimation("walk");
      }
    }

    const thisCollisionTarget = {
      x: this.x - 8,
      y: this.y - 8,
      width: 8,
      height: 8,
    };
    if (
      this.target &&
      this.target.isAlive() &&
      collides(thisCollisionTarget, this.target)
    ) {
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

  draw() {
    super.draw();

    if (this.isAlive()) {
      const healthBar = new HealthBar({
        parent: this,
        combatant: this,
        maxWidth: 12,
        height: 2,
        x: 2,
        y: -4,
      });
      healthBar.render();
    }
  }
}

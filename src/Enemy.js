import { collides, SpriteClass, randInt } from "./kontra";

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
    console.log(this.dexterity);
    return false;
    // when we want to remove console logs, we can refactor to the following:
    // return randInt(1,100) <= this.dexterity ? true : false;
  }

  blockAttack() {
    if (randInt(1, 100) <= this.armor) {
      console.log("Enemy blocked attack!");
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
    console.log(`Enemy took ${damage} damage.`);
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

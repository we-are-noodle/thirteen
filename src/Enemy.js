import {angleToTarget, collides, movePoint, randInt, SpriteClass} from "kontra";
import HealthBar from "./HealthBar";
import {getDistance} from "./utils.js";
import Character from "./Character.js";

export default class Enemy extends SpriteClass {
  init(properties) {
    super.init(properties);

    this.maxHealth = 100;
    this.health = this.maxHealth;

    this.dexterity = null;
    this.armor = null;
    this.width = 16;
    this.height = 16;
    this.anchor = { x: 0.5, y: 0.5 };
    this.target = null;
    this.speed = properties.speed || 1;
    this.fixate = properties.fixate || false;
    this.taunted = false;
    this.scene = properties.scene;
    this.timeDead = 0;

    // setting this to 1 ensures we attack immediately
    this.timeSinceLastAttack = 1;
    this.characters = [];

    this.scene.objects.forEach((object) => {
      if (object instanceof Character) {
        this.characters.push(object);
      }
    });

    this.target = this.characters[randInt(0, this.characters.length - 1)];
  }

  isAlive() {
    return this.health > 0;
  }

  isRemovable() {
    return !this.isAlive() && this.timeDead >= 10;
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

  update(dt) {
    this.advance();

    if (!this.isAlive()) {
      this.playAnimation("dead");
      this.timeDead += dt;
      this.dx = 0;
      this.dy = 0;
      return;
    }

    // to do
    //abstract out collision and attack here
    // set variable state to is attacking
    // handle animations in one loop

    if (!this.fixate && !this.taunted) {
      this.characters.forEach((character) => {
        if (character.isAlive() && getDistance(this, character) < getDistance(this, this.target)) {
          this.target = character;
        }
      })
    }

    if (this.target) {
      if (!collides(this, this.target)) {
        const ang = angleToTarget(this, this.target);
        const { x, y } = movePoint(this, ang, this.speed);
        this.x = x;
        this.y = y;
        this.playAnimation("walk");
      } else if (this.target.isAlive()) {
        if (this.timeSinceLastAttack >= 1) {
          this.attackTarget();
          this.timeSinceLastAttack = 0;
        }

        this.timeSinceLastAttack += dt;
      } else {
        this.characters.forEach((character) => {
          if (character.isAlive()) {
            this.target = character;
          }
        });
        this.playAnimation("idle");
        // this makes it so when you move away and back in you get hit immediately
        this.timeSinceLastAttack = 1;
      }
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

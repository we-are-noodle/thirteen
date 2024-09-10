import {angleToTarget, collides, movePoint, randInt, SpriteClass} from "kontra";
import HealthBar from "./HealthBar";
import {getDistance} from "./utils.js";
import Character from "./Character.js";
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
    this.damage = null;
    this.probability = null;
    this.amplification = null;

    this.width = 16;
    this.height = 16;
    this.target = null;
    this.speed = props.speed || 1;
    this.fixate = props.fixate || false;
    this.taunted = false;
    this.scene = props.scene;
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
    // setting this to 1 ensures we attack immediately
    this.timeSinceLastAttack = 1;

    this.addChild(new CharacterOutline({ color: "#E54D2E" }));
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

  basicAttack(damage) {
    return randInt(1, damage);
  }

  criticalHit(probability, amplification, damage) {
    if (randInt(1, 100) <= probability) {
      console.log('character took Critical Hit!')
      return damage * amplification;
    } else {
      return damage;
    }
    // below can be the final version, I just wanted to have it console log
    // for the time being.
    // return randInt(1,100) <= probability ? damage * amplification : damage;
  }

  attackTarget() {
    let damage = this.criticalHit(this.probability, this.amplification, this.basicAttack(this.damage));
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
      this.timeDead += dt;
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

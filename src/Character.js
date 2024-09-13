import { angleToTarget, movePoint, randInt, SpriteClass } from "./kontra";

import CharacterSelected from "./CharacterSelected";
import CharacterOutline from "./CharacterOutline";

class Character extends SpriteClass {
  init(props) {
    super.init({
      ...props,
    });

    // mh = maxHealth, h = health, d = dexterity, a = armor,
    this.mh = 100;
    this.h = this.mh;
    this.d = null;
    this.a = null;
    this.width = 32;
    this.height = 32;
    this.anchor = { x: 0.5, y: 0.5 };
    this.movingTo = null;
    this.target = null;
    this.friendlyTarget = null;
    this.speed = props.speed || 1;
    this.isSelected = false;

    this.chl = new CharacterSelected({ parent: this });
    this.co = new CharacterOutline({ parent: this });

    this.abilities = [];
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

  takeDamage(enemy, damage) {
    if (this.isAlive() && !this.target) {
      this.target = enemy;
      if (this.isSelected) {
        this.enemies.forEach((c) => (c.showOutline = false));
        enemy.showOutline = true;
      }
    }

    if (this.blockAttack() || this.dodgeAttack()) {
      return;
    }
    this.health -= damage;
  }

  gainHealth(heal) {
    this.health += heal;
  }

  draw() {
    super.draw();

    this.chl.draw();
    this.co.draw();
  }

  update(dt) {
    this.advance();

    if (!this.isAlive()) {
      this.playAnimation("dead");
      return;
    }

    if (this.target && !this.target.isAlive()) {
      this.target.showOutline = false;
      this.target = null;
    }

    this.abilities.forEach((a) => a.update(dt));

    if (this.movingTo) {
      const distance = Math.hypot(
        this.movingTo.x - this.x,
        this.movingTo.y - this.y,
      );

      if (distance > this.speed) {
        this.isMoving = true;
        // flip left or right
        if (this.movingTo.x < this.x) {
          this.scaleX = -1;
        } else {
          this.scaleX = 1;
        }
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

Character.frameRates = {
  image: null,
  frameWidth: 32,
  frameHeight: 32,
  spacing: 0,
  margin: 0,
  animations: {
    idle: {
      frames: [4, 5],
      frameRate: 2,
    },
    walk: {
      frames: [6, 7],
      frameRate: 6,
    },
    attack: {
      frames: [2, 3],
      loop: false,
      frameRate: 6,
    },
    ability: {
      frames: [0, 1],
      loop: false,
      frameRate: 6,
    },
    profile: {
      frames: [1],
      frameRate: 1,
    },
    dead: {
      frames: [8],
      frameRate: 1,
    },
  },
};

export default Character;

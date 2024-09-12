import {
  collides,
  loadImage,
  SpriteSheet,
  angleToTarget,
  movePoint,
} from "./kontra";

import Character from "./Character.js";
import Ability from "./Ability.js";

import tankSheet from "./assets/imgs/GutzDraft03-Sheet.png";

class CharacterTank extends Character {
  init(props) {
    super.init({
      ...props,
    });

    this.addAbility(
      new Ability({
        name: "Taunt",
        description: "Force enemies to attack you.",
        action: () => this.taunt(),
        cooldown: 3,
      }),
    );

    this.basicAttack = new Ability({
      type: "melee",
      name: "Basic Attack",
      description: "Deal 25 damage to target.",
      action: () => this.attack(25),
      cooldown: 1,
    });

    this.armor = 5;
    this.dexterity = 5;
  }

  taunt() {
    if (!this.target?.isAlive()) {
      return false;
    }

    console.log("Taunted!");
    this.target.target = this;
    this.playAnimation("taunt");

    return true;
  }

  attack(damage) {
    damage = this.basicAttack.criticalHit(15, 2, damage);

    const thisCollisionTarget = {
      x: this.x - 8,
      y: this.y - 8,
      width: 8,
      height: 8,
    };
    if (
      !this.target?.isAlive() ||
      !collides(thisCollisionTarget, this.target)
    ) {
      return false;
    }

    console.log("Attacking!");
    this.target.takeDamage(damage);
    if (this.currentAnimation.name !== "taunt") {
      this.playAnimation("attack");
    }

    return true;
  }

  update(dt) {
    super.update(dt);

    if (!this.isAlive()) {
      return;
    }

    this.basicAttack.update(dt);
    this.basicAttack.use();

    if (
      ["attack", "taunt"].includes(this.currentAnimation.name) &&
      this.currentAnimation.isStopped
    ) {
      this.playAnimation("idle");
    }

    if (this.target && !this.target.isAlive()) {
      this.playAnimation("idle");
    }

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
  }
}

async function initCharacterTank() {
  const tankImg = await loadImage(tankSheet);

  const spritesheet = SpriteSheet({
    image: tankImg,
    frameWidth: 32,
    frameHeight: 32,
    spacing: 0,
    margin: 0,
    animations: {
      idle: {
        frames: [0, 8, 16, 24, 32, 40, 48, 56],
        frameRate: 8,
      },
      walk: {
        frames: [2, 10, 18, 26, 34, 42, 50, 58],
        frameRate: 5,
      },
      attack: {
        frames: [5, 13, 21, 29, 37, 45, 53, 61],
        frameRate: 10,
      },
      profile: {
        frames: [1],
        frameRate: 1,
      },
      dead: {
        frames: [45],
        frameRate: 1,
      },
      taunt: {
        frames: [7, 15, 23, 31, 39, 47, 55, 63],
        frameRate: 10,
        loop: false,
      },
    },
  });

  const tank = new CharacterTank({
    x: 112,
    y: 112,
    animations: spritesheet.animations,
  });

  return tank;
}

export { initCharacterTank };

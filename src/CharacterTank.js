import {
  collides,
  loadImage,
  SpriteSheet,
  angleToTarget,
  movePoint,
} from "./kontra";

import Character from "./Character.js";
import Ability from "./Ability.js";

import tankSheet from "./assets/imgs/t.png";

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
    this.playAnimation("ability");

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
    if (this.currentAnimation.name !== "ability") {
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
      ["attack", "ability"].includes(this.currentAnimation.name) &&
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
  });

  const tank = new CharacterTank({
    x: 112,
    y: 112,
    animations: spritesheet.animations,
  });

  return tank;
}

export { initCharacterTank };

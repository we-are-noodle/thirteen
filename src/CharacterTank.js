import {
  collides,
  loadImage,
  SpriteSheet,
  angleToTarget,
  movePoint,
} from "kontra";

import Character from "./Character.js";
import Ability from "./Ability.js";

import tankSheet from "./assets/imgs/swordsman_sheet.png";

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

    if (!this.target?.isAlive() || !collides(this, this.target)) {
      return false;
    }

    console.log("Attacking!");
    this.target.takeDamage(damage);
    this.playAnimation("attack");

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
      this.currentAnimation.name === "taunt" &&
      this.currentAnimation.isStopped
    ) {
      this.playAnimation("idle");
    }

    if (this.target && this.target.isAlive()) {
      const distance = Math.hypot(
        this.target.x - this.x,
        this.target.y - this.y,
      );

      if (distance > this.speed && !collides(this, this.target)) {
        const ang = angleToTarget(this, this.target);
        const { x, y } = movePoint(this, ang, this.speed);
        this.x = Math.round(x);
        this.y = Math.round(y);
        this.playAnimation("walk");
      }
    }
  }
}

async function initCharacterTank() {
  const tankImg = await loadImage(tankSheet);

  const spritesheet = SpriteSheet({
    image: tankImg,
    frameWidth: 16,
    frameHeight: 16,
    spacing: 0,
    margin: 0,
    animations: {
      idle: {
        frames: [1, 0],
        frameRate: 2,
      },
      walk: {
        frames: "0..4",
        frameRate: 5,
      },
      attack: {
        frames: "20..23",
        frameRate: 8,
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
        frames: "40..45",
        frameRate: 5,
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

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
    super.init(props);

    this.speed = 1.1;

    this.addAbility(
      new Ability({
        action: () => this.taunt(),
        cooldown: 3,
      }),
    );

    this.basicAttack = new Ability({
      type: "melee",
      action: () => this.attack(25),
      cooldown: 1,
    });

    this.a = 5;
    this.d = 5;
  }

  taunt() {
    this.enemies.forEach((enemy) => {
      enemy.target = this;
    });

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
    if (!this.target?.iA() || !collides(thisCollisionTarget, this.target)) {
      return false;
    }

    this.target.takeDamage(damage);
    if (this.currentAnimation.name !== "ability") {
      this.playAnimation("attack");
    }

    return true;
  }

  update(dt) {
    super.update(dt);

    if (!this.iA()) {
      return;
    }

    this.basicAttack.update(dt);
    this.basicAttack.use();

    if (
      ["attack", "ability"].includes(this.currentAnimation.name) &&
      this.currentAnimation.isStopped
    ) {
      this.playAnimation("i");
    }

    if (this.target && !this.target.iA()) {
      this.playAnimation("i");
    }

    if (this.target && this.target.iA()) {
      const thisCollisionTarget = {
        x: this.x - 8,
        y: this.y - 8,
        width: 8,
        height: 8,
      };
      if (this.target.x < this.x) {
        this.scaleX = -1;
      } else {
        this.scaleX = 1;
      }
      if (!collides(thisCollisionTarget, this.target)) {
        const ang = angleToTarget(this, this.target);
        const { x, y } = movePoint(this, ang, this.speed);
        this.x = x;
        this.y = y;
        this.playAnimation("w");
      }
    }
  }
}

async function initCharacterTank() {
  const tankImg = await loadImage(tankSheet);

  const s = {
    ...Character.frameRates,
    image: tankImg,
    animations: {
      ...Character.frameRates.animations,
      ability: {
        frames: [0, 1, 0],
        loop: false,
        frameRate: 4,
      },
    },
  };

  const spritesheet = SpriteSheet(s);

  const tank = new CharacterTank({
    x: 112,
    y: 112,
    animations: spritesheet.animations,
  });

  return tank;
}

export { initCharacterTank };

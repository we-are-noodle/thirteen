import { loadImage, SpriteSheet, randInt } from "./kontra";

import Character from "./Character.js";
import Fireball from "./Fireball.js";
import Ability from "./Ability.js";

import dpsSheet from "./assets/imgs/DepzDraft02-Sheet.png";

class CharacterDps extends Character {
  init(props) {
    super.init({
      ...props,
    });

    this.addAbility(
      new Ability({
        name: "Attack",
        description: "Deal 10-12 damage to target.",
        action: (m) => this.fireball(m),
        cooldown: 1,
      }),
    );

    this.basicAttack = new Ability({
      name: "Basic Attack",
      description: "Deal 25 damage to target.",
      action: () => this.attack(25),
      cooldown: 2,
    });

    this.armor = 8;
    this.dexterity = 8;
  }

  fireball(m) {
    if (!this.target?.isAlive()) {
      return false;
    }

    console.log("Send fireball!");
    this.playAnimation("fireball");
    // instantiate new fireball
    // note that it will need to get rendered.

    const f = new Fireball({
      x: this.x,
      y: this.y,
      target: this.target,
      onHit: () => {
        if (!this.target?.isAlive()) {
          return false;
        }
        const dmg = randInt(30, 40);
        this.target.takeDamage(dmg);
      },
    });
    m.add(f);

    return true;
  }

  attack(damage) {
    damage = this.basicAttack.criticalHit(20, 4, damage);

    if (!this.target?.isAlive()) {
      return false;
    }

    console.log("Attacking!");
    this.target.takeDamage(damage);
    if (this.currentAnimation.name !== "fireball") {
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
      ["attack", "fireball"].includes(this.currentAnimation.name) &&
      this.currentAnimation.isStopped
    ) {
      this.playAnimation("idle");
    }

    if (
      this.currentAnimation.name !== "walk" &&
      this.target &&
      this.target.isAlive()
    ) {
      if (this.target.x < this.x) {
        this.scaleX = -1;
      } else {
        this.scaleX = 1;
      }
    }
  }
}

async function initCharacterDps() {
  const dpsImg = await loadImage(dpsSheet);

  const spritesheet = SpriteSheet({
    image: dpsImg,
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
        loop: false,
      },
      profile: {
        frames: [1],
        frameRate: 1,
      },
      dead: {
        frames: [30],
        frameRate: 1,
      },
      fireball: {
        frames: [7, 15, 23, 31, 39, 47, 55, 63],
        frameRate: 10,
        loop: false,
      },
    },
  });

  const dps = new CharacterDps({
    x: 80,
    y: 112,
    animations: spritesheet.animations,
  });

  return dps;
}

export { initCharacterDps };

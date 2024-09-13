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
      fireball: {
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

  const dps = new CharacterDps({
    x: 80,
    y: 112,
    animations: spritesheet.animations,
  });

  return dps;
}

export { initCharacterDps };

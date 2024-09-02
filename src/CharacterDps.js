import { loadImage, SpriteSheet, randInt } from "kontra";

import Character from "./Character.js";
import Fireball from "./Fireball.js";
import Ability from "./Ability.js";

import dpsSheet from "./assets/imgs/necromancer_sheet.png";

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
        cooldown: 5,
      }),
    );

    this.basicAttack = new Ability({
      name: "Basic Attack",
      description: "Deal 3 damage to target.",
      action: () => this.attack(3),
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

    m.add(new Fireball({
      x: this.x,
      y: this.y,
      target: this.target,
      hit: () => {
        if (!this.target?.isAlive()) {
          return false;
        };
        const dmg = randInt(10, 12);
        this.target.takeDamage(dmg);
      }
    }))

    return true;
  }

  attack(damage) {
    if (!this.target?.isAlive()) {
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
      ["attack", "fireball"].includes(this.currentAnimation.name) &&
      this.currentAnimation.isStopped
    ) {
      this.playAnimation("idle");
    }
  }
}

async function initCharacterDps() {
  const dpsImg = await loadImage(dpsSheet);

  const spritesheet = SpriteSheet({
    image: dpsImg,
    frameWidth: 16,
    frameHeight: 16,
    spacing: 0,
    margin: 0,
    animations: {
      idle: {
        frames: [1, 0],
        frameRate: 1,
      },
      walk: {
        frames: "0..4",
        frameRate: 5,
      },
      attack: {
        frames: ["24..29", 0, 1],
        frameRate: 5,
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
        frames: "24..29",
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

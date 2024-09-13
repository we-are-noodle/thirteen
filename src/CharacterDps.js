import { loadImage, SpriteSheet, randInt } from "./kontra";

import Character from "./Character.js";
import Fireball from "./Fireball.js";
import Ability from "./Ability.js";

import dpsSheet from "./assets/imgs/d.png";

class CharacterDps extends Character {
  init(props) {
    super.init(props);

    this.addAbility(
      new Ability({
        action: (m) => this.fireball(m),
        cooldown: 1,
      }),
    );

    this.basicAttack = new Ability({
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

    this.playAnimation("ability");

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
    m.push(f);

    return true;
  }

  attack(damage) {
    damage = this.basicAttack.criticalHit(20, 4, damage);

    if (!this.target?.isAlive()) {
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

  const s = {
    ...Character.frameRates,
    image: dpsImg,
  };

  const spritesheet = SpriteSheet(s);

  const dps = new CharacterDps({
    x: 80,
    y: 112,
    animations: spritesheet.animations,
  });

  return dps;
}

export { initCharacterDps };

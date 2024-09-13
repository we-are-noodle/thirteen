import { loadImage, SpriteSheet } from "./kontra";

import Character from "./Character.js";
import Ability from "./Ability.js";

import healSheet from "./assets/imgs/h.png";

class CharacterHeal extends Character {
  init(props) {
    super.init({
      ...props,
    });

    this.addAbility(
      new Ability({
        action: () => {
          this.playAnimation("bigHeal");
          return this.heal(40);
        },
        cooldown: 2,
      }),
    );

    this.autoHeal = new Ability({
      action: () => this.heal(3),
      cooldown: 1,
    });

    this.a = 10;
    this.d = 10;
  }

  heal(amount) {
    if (!this.friendlyTarget?.isAlive() || this.friendlyTarget.h >= 100) {
      return false;
    }

    this.friendlyTarget.h = Math.min(this.friendlyTarget.h + amount, 100);
    if (this.currentAnimation.name !== "bigHeal") {
      this.playAnimation("heal");
    }

    return true;
  }

  update(dt) {
    super.update(dt);

    if (!this.isAlive()) {
      return;
    }

    if (this.isSelected && this.friendlyTarget) {
      this.friendlyTarget.showOutline = true;
    } else if (this.friendlyTarget) {
      this.friendlyTarget.showOutline = false;
    }

    this.autoHeal.update(dt);
    this.autoHeal.use();

    if (
      ["heal", "bigHeal"].includes(this.currentAnimation.name) &&
      this.currentAnimation.isStopped
    ) {
      this.playAnimation("idle");
    }

    if (this.friendlyTarget && !this.friendlyTarget.isAlive()) {
      this.playAnimation("idle");
    }

    if (
      this.currentAnimation.name !== "walk" &&
      this.friendlyTarget &&
      this.friendlyTarget.isAlive()
    ) {
      if (this.friendlyTarget.x < this.x) {
        this.scaleX = -1;
      } else {
        this.scaleX = 1;
      }
    }
  }
}

async function initCharacterHeal() {
  const healImg = await loadImage(healSheet);

  const s = {
    ...Character.frameRates,
    image: healImg,
    animations: {
      ...Character.frameRates.animations,
      heal: {
        frames: [2, 3],
        loop: false,
        frameRate: 3,
      },
      bigHeal: {
        frames: [0, 1, 2, 1, 0],
        loop: false,
        frameRate: 6,
      },
    },
  };

  const spritesheet = SpriteSheet(s);

  const heal = new CharacterHeal({
    x: 144,
    y: 112,
    animations: spritesheet.animations,
  });

  return heal;
}

export { initCharacterHeal };

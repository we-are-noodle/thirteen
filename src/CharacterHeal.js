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
          this.playAnimation("hh");
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
    if (!this.ft?.iA() || this.ft.h >= 100) {
      return false;
    }

    this.ft.h = Math.min(this.ft.h + amount, 100);
    if (this.currentAnimation.name !== "hh") {
      this.playAnimation("heal");
    }

    return true;
  }

  update(dt) {
    super.update(dt);

    if (!this.iA()) {
      return;
    }

    if (this.isSelected && this.ft) {
      this.ft.so = true;
    } else if (this.ft) {
      this.ft.so = false;
    }

    this.autoHeal.update(dt);
    this.autoHeal.use();

    if (
      ["heal", "hh"].includes(this.currentAnimation.name) &&
      this.currentAnimation.isStopped
    ) {
      this.playAnimation("i");
    }

    if (this.ft && !this.ft.iA()) {
      this.playAnimation("i");
    }

    if (this.currentAnimation.name !== "walk" && this.ft && this.ft.iA()) {
      if (this.ft.x < this.x) {
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
      hh: {
        frames: [0, 1, 2, 1, 0],
        loop: false,
        frameRate: 6,
      },
    },
  };

  return new CharacterHeal({
    x: 144,
    y: 112,
    animations: SpriteSheet(s).animations,
  });
}

export { initCharacterHeal };

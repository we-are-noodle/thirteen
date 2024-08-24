import { loadImage, SpriteSheet } from "kontra";

import Character from "./Character.js";

import healSheet from "./assets/imgs/mage_sheet.png";

class CharacterHeal extends Character {
  init(props) {
    super.init({
      ...props,
    });
    this.abilities = [
      {
        name: "Big Heal",
        description: "Heal 20 health to target.",
        action: () => {
          if (this.timeSinceLastAbility[0] < 2) {
            return;
          }
          this.timeSinceLastAbility[0] = 0;
          console.log("Heal");
          if (this.friendlyTarget.health < 80) {
            this.friendlyTarget.health += 20;
          } else {
            this.friendlyTarget.health = 100;
          }
          this.playAnimation("bigHeal");
        },
        cooldown: 2,
      },
    ];
    this.timeSinceLastAbility = this.abilities.map((a) => a.cooldown);
  }

  update(dt) {
    super.update(dt);
    if (
      this.currentAnimation.name === "bigHeal" &&
      this.currentAnimation.isStopped
    ) {
      this.playAnimation("idle");
    }
  }
}

async function initCharacterHeal() {
  const healImg = await loadImage(healSheet);

  const spritesheet = SpriteSheet({
    image: healImg,
    frameWidth: 16,
    frameHeight: 16,
    spacing: 0,
    margin: 0,
    animations: {
      idle: {
        frames: [1, 0],
        frameRate: 1.5,
      },
      walk: {
        frames: "0..3",
        frameRate: 5,
      },
      attack: {
        frames: "24..29",
        frameRate: 5,
      },
      bigHeal: {
        frames: "24..29",
        frameRate: 5,
        loop: false,
      },
      profile: {
        frames: [1],
        frameRate: 1,
      },
      dead: {
        frames: [35],
        frameRate: 1,
      },
    },
  });

  const heal = new CharacterHeal({
    x: 144,
    y: 112,
    animations: spritesheet.animations,
  });

  return heal;
}

export { initCharacterHeal };

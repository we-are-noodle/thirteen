import { loadImage, SpriteSheet } from "kontra";

import Character from "./Character.js";

import tankSheet from "./assets/imgs/swordsman_sheet.png";

class CharacterTank extends Character {
  init(props) {
    super.init({
      ...props,
    });

    this.abilities = [
      {
        name: "Taunt",
        description: "Force enemies to attack you.",
        action: () => {
          if (this.timeSinceLastAbility[0] < 3) {
            return;
          }
          this.timeSinceLastAbility[0] = 0;
          console.log("Taunt");
        },
        cooldown: 3,
      },
    ];
    this.timeSinceLastAbility = this.abilities.map((a) => a.cooldown);
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
        frameRate: 5,
      },
      profile: {
        frames: [1],
        frameRate: 1,
      },
      dead: {
        frames: [45],
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

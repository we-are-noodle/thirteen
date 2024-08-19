import { loadImage, SpriteSheet } from "kontra";

import Character from "./Character.js";

import dpsSheet from "./assets/imgs/necromancer_sheet.png";

class CharacterDps extends Character {}

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
        frames: "24..27",
        frameRate: 10,
      },
      profile: {
        frames: [1],
        frameRate: 1,
      },
      dead: {
        frames: 5,
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

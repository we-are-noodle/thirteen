import { loadImage, SpriteSheet } from "kontra";

import Character from "./Character.js";

import healSheet from "./assets/imgs/mage_sheet.png";

class CharacterHeal extends Character {}

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
        frames: "24..30",
        frameRate: 5,
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

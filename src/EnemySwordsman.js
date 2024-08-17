import { loadImage, SpriteSheet } from "kontra";

import Enemy from "./Enemy.js";

import tankSheet from "./assets/imgs/swordsman_sheet.png";

class EnemySwordsman extends Enemy {}

async function initEnemySwordsman() {
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
    },
  });

  const swordsman = new EnemySwordsman({
    x: 50,
    y: 50,
    animations: spritesheet.animations,
  });

  return swordsman;
}

export { initEnemySwordsman };

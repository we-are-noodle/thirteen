import { loadImage, SpriteSheet } from "kontra";

import Enemy from "./Enemy.js";

import tankSheet from "./assets/imgs/Skeleton-Soldier.png";

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
        frames: [40, 41],
        frameRate: 2,
      },
      walk: {
        frames: "0..4",
        frameRate: 5,
      },
      attack: {
        frames: "20..23",
        frameRate: 10,
      },
      dead: {
        frames: [45],
        frameRate: 1,
      },
    },
    onDown: function () {},
  });

  const swordsman1 = new EnemySwordsman({
    x: 50,
    y: 50,
    speed: 1,
    animations: spritesheet.animations,
  });

  const swordsman2 = new EnemySwordsman({
    x: 50,
    y: 100,
    speed: 1,
    animations: spritesheet.animations,
  });

  // track(swordsman);

  return [swordsman1, swordsman2];
}

export { initEnemySwordsman };

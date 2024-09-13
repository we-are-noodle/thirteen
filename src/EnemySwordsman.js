import { loadImage, SpriteSheet } from "./kontra";

import Enemy from "./Enemy.js";

import skeletonSheet from "./assets/imgs/e.png";

class EnemySwordsman extends Enemy {
  init(props) {
    super.init({
      ...props,
    });

    this.a = 10;
    this.d = 10;
  }
}

async function initEnemySwordsman() {
  const skeletonImg = await loadImage(skeletonSheet);

  const spritesheet = SpriteSheet({
    image: skeletonImg,
    frameWidth: 32,
    frameHeight: 32,
    spacing: 0,
    margin: 0,
    animations: {
      idle: {
        frames: [3, 4],
        frameRate: 2,
      },
      walk: {
        frames: [3, 4],
        frameRate: 5,
      },
      attack: {
        frames: [3, 4, 1, 2],
        frameRate: 10,
      },
      dead: {
        frames: [0],
        frameRate: 1,
      },
    },
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

  return [swordsman1, swordsman2];
}

export { initEnemySwordsman };

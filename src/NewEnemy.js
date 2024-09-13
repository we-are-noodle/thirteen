import { loadImage, SpriteSheet } from "./kontra";

import Character from "./Character.js";

import skeletonSheet from "./assets/imgs/e.png";

class Enemy extends Character {}

async function initEnemy() {
  const skeletonImg = await loadImage(skeletonSheet);

  const s = {
    ...Character.frameRates,
    image: skeletonImg,
  };

  const spritesheet = SpriteSheet({
    ...s,
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

  return Array.from({ length: 2 }, (_, i) => {
    const enemy = new Enemy({
      x: 50,
      y: 50 + i * 50,
      speed: 1,
      animations: spritesheet.animations,
    });
    return enemy;
  });
}

export { initEnemy };

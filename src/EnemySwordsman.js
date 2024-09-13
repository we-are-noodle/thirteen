import { loadImage, SpriteSheet, randInt } from "./kontra";

import Enemy from "./Enemy.js";

import skeletonSheet from "./assets/imgs/e.png";

function spawnRandomEnemies(animations, num) {
  return Array.from({ length: num }, () => {
    const enemy = new Enemy({
      x: randInt(0, 2) % 2 === 0 ? -10 : 330,
      y: randInt(60, 190),
      speed: 1,
      animations,
    });
    return enemy;
  });
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

  return (num) => {
    return spawnRandomEnemies(spritesheet.animations, num);
  };
}

export { initEnemySwordsman };

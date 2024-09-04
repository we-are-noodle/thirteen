import { loadImage, SpriteSheet } from "kontra";

import Enemy from "./Enemy.js";

import spearmanSheet from "./assets/imgs/SpearmanRed.png";

class EnemySpearman extends Enemy {
  init(props) {
    super.init({
      ...props,
    });

    this.armor = 10;
    this.dexterity = 10;
  }
}

async function initEnemySpearman() {
  const spearmanImg = await loadImage(spearmanSheet);

  const spritesheet = SpriteSheet({
    image: spearmanImg,
    frameWidth: 16,
    frameHeight: 16,
    spacing: 0,
    margin: 0,
    animations: {
      idle: {
        frames: [50, 51],
        frameRate: 2,
      },
      walk: {
        frames: "0..4",
        frameRate: 5,
      },
      attack: {
        frames: [20, 30, 40, 30, 20],
        frameRate: 10,
      },
      dead: {
        frames: [7],
        frameRate: 1,
      },
    },
  });

  const spearman1 = new EnemySpearman({
    x: 250,
    y: 50,
    speed: 1,
    animations: spritesheet.animations,
  });

  const spearman2 = new EnemySpearman({
    x: 250,
    y: 100,
    speed: 1,
    animations: spritesheet.animations,
  });

  return [spearman1, spearman2];
}

export { initEnemySpearman };

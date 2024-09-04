import { loadImage, SpriteSheet } from "kontra";

import Enemy from "./Enemy.js";

import assasinSheet from "./assets/imgs/AssasinRed.png";

class EnemyAssasin extends Enemy {
  init(props) {
    super.init({
      ...props,
    });

    this.armor = 10;
    this.dexterity = 10;
  }
}

async function initEnemyAssasin() {
  const assasinImg = await loadImage(assasinSheet);

  const spritesheet = SpriteSheet({
    image: assasinImg,
    frameWidth: 16,
    frameHeight: 16,
    spacing: 0,
    margin: 0,
    animations: {
      idle: {
        frames: [20,21,22,23,28,27,26,25],
        // frames: [0, 1],
        frameRate: 10,
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
  });

  const assasin1 = new EnemyAssasin({
    x: 250,
    y: 115,
    speed: 1,
    animations: spritesheet.animations,
  });

  const assasin2 = new EnemyAssasin({
    x: 250,
    y: 165,
    speed: 1,
    animations: spritesheet.animations,
  });

  return [assasin1, assasin2];
}

export { initEnemyAssasin };

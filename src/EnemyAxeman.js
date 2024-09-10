import { loadImage, SpriteSheet } from "kontra";

import Enemy from "./Enemy.js";

import axemanSheet from "./assets/imgs/AxemanRed.png";

class EnemyAxeman extends Enemy {
  init(props) {
    super.init({
      ...props,
    });

    this.armor = 10;
    this.dexterity = 10;
    this.damage = 10;
    this.probability = 10;
  }
}

async function initEnemyAxeman() {
  const axemanImg = await loadImage(axemanSheet);

  const spritesheet = SpriteSheet({
    image: axemanImg,
    frameWidth: 16,
    frameHeight: 16,
    spacing: 0,
    margin: 0,
    animations: {
      idle: {
        frames: [0, 1],
        frameRate: 2,
      },
      walk: {
        frames: "0..4",
        frameRate: 5,
      },
      attack: {
        frames: [30,31,32,33,34,35],
        frameRate: 10,
      },
      dead: {
        frames: [6],
        frameRate: 1,
      },
    },
  });

  const axeman1 = new EnemyAxeman({
    x: 150,
    y: 50,
    speed: 1,
    animations: spritesheet.animations,
  });

  const axeman2 = new EnemyAxeman({
    x: 150,
    y: 100,
    speed: 1,
    animations: spritesheet.animations,
  });

  return [axeman1, axeman2];
}

export { initEnemyAxeman };

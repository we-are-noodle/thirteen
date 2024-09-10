import { loadImage, SpriteSheet } from "kontra";

import Enemy from "./Enemy.js";

import musketeerSheet from "./assets/imgs/MusketeerRed.png";

class EnemyMusketeer extends Enemy {
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

async function initEnemyMusketeer() {
  const musketeerImg = await loadImage(musketeerSheet);

  const spritesheet = SpriteSheet({
    image: musketeerImg,
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
        frames: "20..23",
        frameRate: 10,
      },
      dead: {
        frames: [9],
        frameRate: 1,
      },
    },
  });

  const musketeer1 = new EnemyMusketeer({
    x: 50,
    y: 115,
    speed: 1,
    animations: spritesheet.animations,
  });

  const musketeer2 = new EnemyMusketeer({
    x: 50,
    y: 165,
    speed: 1,
    animations: spritesheet.animations,
  });

  return [musketeer1, musketeer2];
}

export { initEnemyMusketeer };

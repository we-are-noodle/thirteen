import { loadImage, SpriteSheet } from "kontra";
import skeletonSheet from "./assets/imgs/Skeleton-Soldier.png";

class EnemySwordsman extends Enemy {
  init(props) {
    super.init({
      ...props,
    });

    this.armor = 10;
    this.dexterity = 10;
    this.damage = 10;
    this.probability = 10;
    this.amplification = 2;
  }
}

async function initEnemySwordsman() {
  const skeletonImg = await loadImage(skeletonSheet);

  return SpriteSheet({
    image: skeletonImg,
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
  });
}

export { initEnemySwordsman };

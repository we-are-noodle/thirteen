import { loadImage, SpriteSheet } from "kontra";
import skeletonSheet from "./assets/imgs/Skeleton-Soldier.png";

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
    onDown: function () {},
  });
}

export { initEnemySwordsman };

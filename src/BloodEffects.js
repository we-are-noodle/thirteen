import { loadImage, Sprite, SpriteSheet } from "kontra";

import bloodSheet from "./assets/imgs/blood.png";

class BloodEffects {
  constructor() {
    this.spritesheet = null;
  }

  async init() {
    const bloodImg = await loadImage(bloodSheet);

    this.spritesheet = SpriteSheet({
      image: bloodImg,
      margin: 0,
      spacing: 0,
      frameWidth: 25,
      frameHeight: 25,
      animations: {
        splat: {
          frames: "0..29",
          frameRate: 30,
          loop: false,
        },
      },
    });
  }

  createBloodEffect({ x, y }) {
    const bloodEffect = Sprite({
      anchor: { x: 0.5, y: 0.5 },
      x,
      y,
      animations: this.spritesheet.animations,
      ttl: 50,
    });

    return bloodEffect;
  }
}

async function initBloodEffects() {
  const bloodEffects = new BloodEffects();
  await bloodEffects.init();

  return bloodEffects;
}

export { initBloodEffects };

import { loadImage, SpriteSheet } from "./kontra";

import Projectile from "./Projectile.js";

import bloodSheet from "./assets/imgs/d.png";

class Fireball extends Projectile {
  init(props) {
    super.init({
      ...props,
      animations: Fireball.spritesheet.animations,
      width: 12,
      height: 12,
    });
  }

  update(dt) {
    super.update(dt);
  }
}

async function initFireball() {
  const bloodImg = await loadImage(bloodSheet);

  const spritesheet = SpriteSheet({
    image: bloodImg,
    frameWidth: 32,
    frameHeight: 32,
    spacing: 0,
    margin: 0,
    animations: {
      seek: {
        frames: [0, 1],
        frameRate: 4,
        loop: true,
      },
      explode: {
        frames: [0],
        frameRate: 30,
        loop: false,
      },
    },
  });

  // We will have to spawn the fireball at the location of the caster.
  Fireball.spritesheet = spritesheet;
}

export default Fireball;
export { initFireball };

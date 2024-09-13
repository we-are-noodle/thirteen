import { loadImage, SpriteSheet } from "./kontra";

import Projectile from "./Projectile.js";

import bloodSheet from "./assets/imgs/f.png";

class Fireball extends Projectile {
  init(props) {
    super.init({
      ...props,
      animations: Fireball.spritesheet.animations,
      width: 8,
      height: 8,
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
    frameWidth: 4,
    frameHeight: 4,
    spacing: 0,
    margin: 0,
    animations: {
      seek: {
        frames: "0..7",
        frameRate: 30,
        loop: true,
      },
      explode: {
        frames: "3..7",
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

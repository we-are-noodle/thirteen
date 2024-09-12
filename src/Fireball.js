import { loadImage, SpriteSheet } from "./kontra";

import Projectile from "./Projectile.js";

import bloodSheet from "./assets/imgs/blood.png";

class Fireball extends Projectile {
  init(props) {
    super.init({
      ...props,
      animations: Fireball.spritesheet.animations,
      width: 16,
      height: 16,
    });
  }

  update(dt) {
    super.update(dt);
  }

  // update(dt) {
  //   super.update(dt);
  //   // console.log("abeek");
  // }
}

async function initFireball() {
  const bloodImg = await loadImage(bloodSheet);

  const spritesheet = SpriteSheet({
    image: bloodImg,
    frameWidth: 25,
    frameHeight: 25,
    spacing: 0,
    margin: 0,
    animations: {
      seek: {
        frames: "0..4",
        frameRate: 30,
        loop: true,
      },
      explode: {
        frames: "0..29",
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

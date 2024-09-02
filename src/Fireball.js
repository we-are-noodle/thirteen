import { loadImage, SpriteSheet, randInt } from "kontra";

import Projectile from "./Character.js";
import Ability from "./Ability.js";

import bloodSheet from "./assets/imgs/blood.png";

class Fireball extends Projectile {
  init(props) {
    super.init({
      ...props,
      animations: Fireball.spritesheet.animations,
    });

    // how do we pass you in?
    // this.caster = ;
    // this.target = ;
  }


  update(dt) {
    super.update(dt);
    // console.log("abeek");
  }
}

async function initFireball() {
  const bloodImg = await loadImage(bloodSheet);

  const spritesheet = SpriteSheet({
    image: bloodImg,
    frameWidth: 16,
    frameHeight: 16,
    spacing: 0,
    margin: 0,
    animations: {
      seek: {
        frames: [5],
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

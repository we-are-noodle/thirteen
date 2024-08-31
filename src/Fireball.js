import { loadImage, SpriteSheet, randInt } from "kontra";

import Projectile from "./Character.js";
import Ability from "./Ability.js";

import bloodSheet from "./assets/imgs/blood.png";

class Fireball extends Projectile {
  init(props) {
    super.init({
      ...props,
    });

    // how do we pass you in?
    this.caster = ;
    this.target = ;
  }


  update(dt) {
    super.update(dt);
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
        frames: "0..4",
        frameRate: 30,
        loop: false,
      },
      explode: {
        frames: "0..29",
        frameRate: 30,
        loop: false,
      },
    },
  });

  // We will have to spawn the fireball at the location of the caster.
  //

  const fireball = new Fireball({
    // we will have to use caster location here.
    x: this.caster.x,
    y: this.caster.y,
    target: this.target,
    caster: this.caster,
    animations: spritesheet.animations,
  });

  return fireball;
}

export { initFireball };

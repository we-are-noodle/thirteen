import { loadImage, SpriteSheet } from "./kontra";

import Projectile from "./Projectile.js";

import bloodSheet from "./assets/imgs/e.png";

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
}

async function initFireball() {
  const bloodImg = await loadImage(bloodSheet);

  const spritesheet = SpriteSheet(this.frameRates);

  // We will have to spawn the fireball at the location of the caster.
  Fireball.spritesheet = spritesheet;
}

export default Fireball;
export { initFireball };

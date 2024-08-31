import {angleToTarget, collides, movePoint, SpriteClass} from "kontra";

export default class Projectile extends SpriteClass {
  init(properties) {
    super.init(properties);

    this.width = 16;
    this.height = 16;
    this.anchor = { x: 0.5, y: 0.5 };
    this.target = null;
    this.caster = null;
    this.speed = properties.speed || 1;

    // Will we need to add additional functions from child?
    this.abilities = [];
  }


  // Will we need to add additional functions from child?
  addAbility(ability) {
    this.abilities.push(ability);
  }


  update(dt) {
    this.advance();

    // abilities need delta time to properly track cooldowns
    this.abilities.forEach((a) => a.update(dt));


    if (this.target) {
      if (!collides(this, this.target)) {
        const ang = angleToTarget(this, this.target);
        const { x, y } = movePoint(this, ang, this.speed);
        this.x = x;
        this.y = y;
        this.playAnimation("seek");
      } else if(collides(this, this.target)) {
        if (this.currentAnimation.name !== "explode") {
          this.playAnimation("explode");
        }

        return;
      }
    }
  }
}

import { angleToTarget, movePoint, randInt, SpriteClass } from "kontra";


export default class Projectile extends SpriteClass {
  init(properties) {
    super.init(properties);

    this.width = 16;
    this.height = 16;
    this.anchor = { x: 0.5, y: 0.5 };
    this.movingTo = null;
    this.target = null;
    this.friendlyTarget = null;
    this.speed = properties.speed || 1;
    this.isSelected = false;

    // Will we need to add additional functions from child?
    this.abilities = [];
  }


  // Will we need to add additional functions from child?
  addAbility(ability) {
    this.abilities.push(ability);
  }

  moveTo({ x, y }) {
    this.movingTo = { x, y };
  }

  // if projectile location is equal to target location or collision


  update(dt) {
    this.advance();

    // abilities need delta time to properly track cooldowns
    this.abilities.forEach((a) => a.update(dt));

    //target
    if (this.movingTo) {
      const distance = Math.hypot(
        this.movingTo.x - this.x,
        this.movingTo.y - this.y,
      );

      if (distance > this.speed) {
        const ang = angleToTarget(this, this.movingTo);
        const { x, y } = movePoint(this, ang, this.speed);
        this.x = Math.round(x);
        this.y = Math.round(y);
        this.playAnimation("seek");
      } else {
        this.movingTo = null;

        // if projectile location is equal to target location or collision
        this.playAnimation("explode");
        // should return after explosion
      }
    }
  }
}

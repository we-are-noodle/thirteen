import { angleToTarget, collides, movePoint, SpriteClass } from "./kontra";

export default class Projectile extends SpriteClass {
  init(props) {
    super.init({
      ...props,
      anchor: { x: 0.5, y: 0.5 },
    });

    this.speed = props.speed || 1;
    this.onHit = props.onHit || (() => {});
  }

  update() {
    this.advance();

    const isExploding = this.currentAnimation.name === "explode";

    if (isExploding) {
      if (this.currentAnimation.isStopped) {
        this.ttl = -1;
      }
      return;
    }

    if (!this.target) {
      return;
    }

    if (collides(this, this.target)) {
      this.onHit();
      this.playAnimation("explode");
      return;
    }

    const ang = angleToTarget(this, this.target);
    const { x, y } = movePoint(this, ang, this.speed);
    this.x = x;
    this.y = y;
  }
}

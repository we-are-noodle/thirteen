import { Sprite, SpriteClass } from "kontra";

export default class HealthBar extends SpriteClass {
  draw() {
    const hp = Math.max(0, this.combatant.health);
    const healthPercent = hp / this.combatant.maxHealth;
    const hpWidth = Math.ceil(healthPercent * this.maxWidth);

    const border = Sprite({
      x: -1,
      y: -1,
      width: this.maxWidth + 2,
      height: this.height + 2,
      color: "black",
    });
    border.render();

    const bg = Sprite({
      x: 0,
      y: 0,
      width: this.maxWidth,
      height: this.height,
      color: "#203C25",
    });
    bg.render();

    const health = Sprite({
      x: 0,
      y: 0,
      width: hpWidth,
      height: this.height,
      color: healthPercent < 0.3 ? "#E54D2E" : "#46A758",
    });
    health.render();

    const highlight = Sprite({
      x: 0,
      y: 0,
      width: this.maxWidth,
      height: Math.floor(this.height / 2),
      color: "rgba(255, 255, 255, 0.3)",
    });
    highlight.render();
  }
}

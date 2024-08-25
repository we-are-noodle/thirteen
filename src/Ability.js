export default class Ability {
  #elapsedTime;

  constructor({ name, type, description, action, cooldown }) {
    this.name = name;
    this.type = type;
    this.description = description;
    this.action = action;
    this.cooldown = cooldown;
    this.#elapsedTime = this.cooldown;
  }

  update(dt) {
    this.#elapsedTime += dt;
  }

  isMelee() {
    return this.type === "melee";
  }

  canUse() {
    return this.#elapsedTime >= this.cooldown;
  }

  resetCooldown() {
    this.#elapsedTime = this.cooldown;
  }

  percentRemainingCooldown() {
    return (this.cooldown - this.#elapsedTime) / this.cooldown;
  }

  use() {
    if (!this.canUse()) {
      return;
    }

    const wasUsed = this.action();
    if (wasUsed) {
      this.#elapsedTime = 0;
    }
  }
}

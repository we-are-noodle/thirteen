import { randInt } from "kontra";

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

  criticalHit(probability, amplification, damage){
    if (randInt(1,100) <= probability) {
      // console.log('Critical Hit!')
      return damage * amplification;
    } else {
      return damage;
    }
    // return randInt(1,100) <= probability ? damage * amplification : damage;
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

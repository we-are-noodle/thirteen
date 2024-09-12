import { loadImage, SpriteSheet } from "kontra";

import Character from "./Character.js";
import Ability from "./Ability.js";

import healSheet from "./assets/imgs/RobeDraft03-Sheet.png";

class CharacterHeal extends Character {
  init(props) {
    super.init({
      ...props,
    });

    this.addAbility(
      new Ability({
        name: "Big Heal",
        description: "Heal 20 health to target.",
        action: () => {
          this.playAnimation("bigHeal");
          return this.heal(40);
        },
        cooldown: 2,
      }),
    );

    this.autoHeal = new Ability({
      name: "Auto Heal",
      description: "Heal 3 health every second.",
      action: () => this.heal(3),
      cooldown: 1,
    });

    this.armor = 10;
    this.dexterity = 10;
  }

  heal(amount) {
    if (!this.friendlyTarget?.isAlive() || this.friendlyTarget.health >= 100) {
      return false;
    }

    console.log("Character healed!");
    this.friendlyTarget.health = Math.min(
      this.friendlyTarget.health + amount,
      100,
    );
    if (this.currentAnimation.name !== "bigHeal") {
      this.playAnimation("heal");
    }

    return true;
  }

  update(dt) {
    super.update(dt);

    if (!this.isAlive()) {
      return;
    }

    if (this.isSelected && this.friendlyTarget) {
      this.friendlyTarget.showOutline = true;
    } else if (this.friendlyTarget) {
      this.friendlyTarget.showOutline = false;
    }

    this.autoHeal.update(dt);
    this.autoHeal.use();

    if (
      ["heal", "bigHeal"].includes(this.currentAnimation.name) &&
      this.currentAnimation.isStopped
    ) {
      this.playAnimation("idle");
    }

    if (this.friendlyTarget && !this.friendlyTarget.isAlive()) {
      this.playAnimation("idle");
    }

    if (
      this.currentAnimation.name !== "walk" &&
      this.friendlyTarget &&
      this.friendlyTarget.isAlive()
    ) {
      if (this.friendlyTarget.x < this.x) {
        this.scaleX = -1;
      } else {
        this.scaleX = 1;
      }
    }
  }
}

async function initCharacterHeal() {
  const healImg = await loadImage(healSheet);

  const spritesheet = SpriteSheet({
    image: healImg,
    frameWidth: 32,
    frameHeight: 32,
    spacing: 0,
    margin: 0,
    animations: {
      idle: {
        frames: [0, 8, 16, 24, 32, 40, 48, 56],
        frameRate: 8,
      },
      walk: {
        frames: [2, 10, 18, 26, 34, 42, 50, 58],
        frameRate: 5,
      },
      heal: {
        frames: [5, 13, 21, 29, 37, 45, 53, 61],
        frameRate: 10,
      },
      bigHeal: {
        frames: [7, 15, 23, 31, 39, 47, 55, 63],
        frameRate: 10,
        loop: false,
      },
      profile: {
        frames: [1],
        frameRate: 1,
      },
      dead: {
        frames: [35],
        frameRate: 1,
      },
    },
  });

  const heal = new CharacterHeal({
    x: 144,
    y: 112,
    animations: spritesheet.animations,
  });

  return heal;
}

export { initCharacterHeal };

import { Sprite, loadImage, SpriteSheet } from "kontra";

import Character from "./Character.js";
import Ability from "./Ability.js";

import healSheet from "./assets/imgs/mage_sheet.png";

class CharacterHeal extends Character {
  init(props) {
    super.init({
      ...props,
    });

    this.addAbility(
      new Ability({
        name: "Big Heal",
        description: "Heal 20 health to target.",
        action: () => this.heal(20),
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
    this.playAnimation("bigHeal");

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
      this.currentAnimation.name === "bigHeal" &&
      this.currentAnimation.isStopped
    ) {
      this.playAnimation("idle");
    }
  }
}

async function initCharacterHeal() {
  const healImg = await loadImage(healSheet);

  const spritesheet = SpriteSheet({
    image: healImg,
    frameWidth: 16,
    frameHeight: 16,
    spacing: 0,
    margin: 0,
    animations: {
      idle: {
        frames: [1, 0],
        frameRate: 1.5,
      },
      walk: {
        frames: "0..3",
        frameRate: 5,
      },
      attack: {
        frames: "24..29",
        frameRate: 5,
      },
      bigHeal: {
        frames: "24..29",
        frameRate: 5,
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

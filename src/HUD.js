import { GameObjectClass, Sprite } from "kontra";

import HealthBar from "./HealthBar";

class HUD extends GameObjectClass {
  #characters;
  #profiles;
  setCharacters(...characters) {
    this.#characters = characters;
    this.#profiles = characters.map((character) => {
      const profile = Sprite({
        width: 16,
        height: 16,
        animations: character.animations,
      });
      profile.playAnimation("profile");
      return profile;
    });
  }

  update(dt) {
    this.#profiles.forEach((profile) => profile.update(dt));
  }

  draw() {
    this.context.fillStyle = "white";
    this.context.font = "8px monospace";

    this.#characters.forEach((character, i) => {
      const hl = Sprite({
        x: i * 72 + 4,
        y: 4,
        width: 34,
        height: 34,
        color: character.isSelected ? "#FFE629" : "black",
      });
      const bg = Sprite({
        x: 1,
        y: 1,
        width: 32,
        height: 32,
        color: "black",
      });
      hl.addChild(bg);

      hl.addChild(
        new HealthBar({
          combatant: character,
          maxWidth: 30,
          height: 4,
          x: 2,
          y: 28,
        }),
      );

      const abilityIcons = [];
      character.abilities?.forEach((ability) => {
        const abilityIcon = Sprite({
          x: 36,
          y: 0,
          width: 24,
          height: 24,
          color: ability.isReady() ? "black" : `rgba(0,0,0,.7)`,
        });
        hl.addChild(abilityIcon);

        const maxWidth = 24;
        const width = Math.max(
          0,
          ability.percentRemainingCooldown() * maxWidth,
        );

        const cooldownBar = Sprite({
          x: 0,
          y: 20,
          width,
          height: 4,
          color: "white",
        });
        abilityIcon.addChild(cooldownBar);
        abilityIcons.push(abilityIcon);
      });

      hl.render();

      const { x: profileX, y: profileY } = hl.world;

      this.#profiles[i].x = profileX + 9;
      this.#profiles[i].y = profileY + 9;
      this.#profiles[i].render();

      this.context.font = "8px monospace";
      this.context.fillText(`${i + 1}`, hl.x + 3, 14);

      abilityIcons.forEach((icon) => {
        const { x, y } = icon.world;
        this.context.fillText("Q", x + 2, y + 8);
      });
    });
  }
}

async function initHUD() {
  const hud = new HUD();
  console.log("initHUD");

  return hud;
}

export { initHUD };

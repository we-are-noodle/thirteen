import { GameObjectClass, Sprite } from "./kontra";

import HealthBar from "./HealthBar";

class HUD extends GameObjectClass {
  #characters;
  #profiles;
  setCharacters(...characters) {
    this.#characters = characters;
    this.#profiles = characters.map((character) => {
      const profile = Sprite({
        width: 32,
        height: 32,
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
      const baseX = i * 72;
      const baseY = 4;
      const hl = Sprite({
        x: baseX,
        y: baseY,
        width: 34,
        height: 34,
        color: character.isSelected ? "#FFE629" : "black",
      });
      hl.render();

      const bg = Sprite({
        x: baseX + 1,
        y: baseY + 1,
        width: 32,
        height: 32,
        color: "black",
      });
      bg.render();

      const hb = new HealthBar({
        combatant: character,
        maxWidth: 30,
        height: 4,
        x: baseX + 2,
        y: baseY + 28,
      });
      hb.render();

      const abilityIcons = [];
      character.abilities?.forEach((ability) => {
        const abilityIcon = Sprite({
          x: baseX + 36,
          y: baseY + 4,
          width: 24,
          height: 24,
          color: ability.isReady() ? "black" : `rgba(0,0,0,.7)`,
        });
        abilityIcon.render();

        const maxWidth = 24;
        const width = Math.max(
          0,
          ability.percentRemainingCooldown() * maxWidth,
        );

        const cooldownBar = Sprite({
          x: baseX + 36,
          y: baseY + 24,
          width,
          height: 4,
          color: "white",
        });
        cooldownBar.render();

        abilityIcons.push(abilityIcon);
      });

      const { x: profileX, y: profileY } = hl.world;

      this.#profiles[i].x = profileX;
      this.#profiles[i].y = profileY;
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

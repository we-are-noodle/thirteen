import { GameObjectClass, Sprite } from "kontra";

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
        color: character.isSelected ? "yellow" : "black",
      });
      const bg = Sprite({
        x: 1,
        y: 1,
        width: 32,
        height: 32,
        color: "black",
      });
      hl.addChild(bg);

      const health = Math.max(0, character.health);
      const maxWidth = 30;
      const healthbar = Sprite({
        x: 2,
        y: 28,
        width: Math.max(1, Math.floor((health / 100) * maxWidth)),
        height: 4,
        color: character.health < 30 ? "red" : "green",
      });
      hl.addChild(healthbar);

      const abilityIcons = [];
      character.abilities?.forEach((ability, i) => {
        const abilityIcon = Sprite({
          x: 36,
          y: 0,
          width: 24,
          height: 24,
          color: "black",
        });
        hl.addChild(abilityIcon);

        const maxWidth = 24;
        const cd = ability.cooldown;
        const timeSinceLastAbility = character.timeSinceLastAbility[i];
        const width = Math.max(
          0,
          ((cd - timeSinceLastAbility) / cd) * maxWidth,
        );

        const cooldownBar = Sprite({
          x: 0,
          y: 22,
          width,
          height: 2,
          color: "blue",
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

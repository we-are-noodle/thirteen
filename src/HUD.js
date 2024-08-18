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
      const bg = Sprite({
        x: i * 40 + 4,
        y: 4,
        width: 32,
        height: 32,
        color: "rgba(0, 0, 0, .9)",
      });
      bg.render();

      if (character.isSelected) {
        this.context.strokeStyle = "yellow";
        this.context.strokeRect(i * 40 + 4, 4, 32, 32);
      }

      this.#profiles[i].x = i * 40 + 12;
      this.#profiles[i].y = 14;
      this.#profiles[i].render();

      this.context.fillText(`${i + 1}`, i * 40 + 8, 14);
      const health = Math.max(0, character.health);
      const maxWidth = 28;
      const healthbar = Sprite({
        x: i * 40 + 6,
        y: 30,
        width: Math.max(1, Math.floor((health / 100) * maxWidth)),
        height: 4,
        color: character.health < 30 ? "red" : "green",
      });
      healthbar.render();
    });
  }
}

async function initHUD() {
  const hud = new HUD();
  console.log("initHUD");

  return hud;
}

export { initHUD };

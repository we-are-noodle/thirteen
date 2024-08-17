import { init, initInput, initPointer, track, onKey, GameLoop } from "kontra";

import { initMap } from "./Map.js";
import { initBloodEffects } from "./BloodEffects.js";
import { initCharacterDps } from "./CharacterDps.js";
import { initCharacterHeal } from "./CharacterHeal.js";
import { initCharacterTank } from "./CharacterTank.js";
import { initEnemySwordsman } from "./EnemySwordsman.js";

(async function () {
  init();
  initInput();
  initPointer();

  const [map, bloodEffects, dps, heal, tank, swordsman] = await Promise.all([
    initMap(),
    initBloodEffects(),
    initCharacterDps(),
    initCharacterHeal(),
    initCharacterTank(),
    initEnemySwordsman(),
  ]);

  let selected = dps;
  onKey("1", () => (selected = dps));
  onKey("2", () => (selected = tank));
  onKey("3", () => (selected = heal));

  const effects = [];
  map.handleMapClick(({ x, y, outOfBounds }) => {
    if (outOfBounds) {
      return;
    }

    selected.moveTo({ x, y });

    effects.push(bloodEffects.createBloodEffect({ x, y }));

    if (effects.length > 10) {
      effects.shift();
    }
  });

  const playerCharacters = [dps, tank, heal];
  const enemies = [swordsman];

  const loop = GameLoop({
    blur: true,
    update: function () {
      playerCharacters.forEach((c) => c.update());
      enemies.forEach((c) => c.update());
      effects.forEach((e) => e.update());
    },
    track: function () {
      enemies.forEach((c) => track(c));
      enemies.forEach((e) => track(e));
    },
    render: function () {
      map.render();
      effects.forEach((f) => f.render());
      playerCharacters.forEach((c) => c.render());
      enemies.forEach((e) => e.render());
    },
  });

  loop.start();
})();

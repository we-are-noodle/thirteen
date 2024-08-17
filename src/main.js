import {
  depthSort,
  init,
  initInput,
  initPointer,
  onKey,
  GameLoop,
  Scene,
} from "kontra";

import { initMap } from "./Map.js";
import { initBloodEffects } from "./BloodEffects.js";
import { initCharacterDps } from "./CharacterDps.js";
import { initCharacterHeal } from "./CharacterHeal.js";
import { initCharacterTank } from "./CharacterTank.js";

(async function () {
  init();
  initInput();
  initPointer();

  const [map, bloodEffects, dps, heal, tank] = await Promise.all([
    initMap(),
    initBloodEffects(),
    initCharacterDps(),
    initCharacterHeal(),
    initCharacterTank(),
  ]);

  let selected = dps;
  onKey("1", () => (selected = dps));
  onKey("2", () => (selected = tank));
  onKey("3", () => (selected = heal));

  const scene = Scene({
    id: "main",
    objects: [dps, tank, heal],
    sortFunction: depthSort,
  });

  const effects = Scene({
    id: "effects",
    objects: [],
  });

  map.handleMapClick(({ x, y, outOfBounds }) => {
    if (outOfBounds) {
      return;
    }

    selected.moveTo({ x, y });

    effects.add(bloodEffects.createBloodEffect({ x, y }));
  });

  const loop = GameLoop({
    blur: true,
    update: function (dt) {
      effects.update(dt);
      effects.objects.forEach((effect) => {
        if (effect.isAlive()) {
          return;
        }

        effects.remove(effect);
      });
      scene.update(dt);
    },
    render: function () {
      map.render();
      effects.render();
      scene.render();
    },
  });

  loop.start();
})();

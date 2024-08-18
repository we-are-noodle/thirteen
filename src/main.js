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
import { initHUD } from "./HUD.js";

(async function () {
  init();
  initInput();
  initPointer();

  const [map, bloodEffects, dps, heal, tank, hud] = await Promise.all([
    initMap(),
    initBloodEffects(),
    initCharacterDps(),
    initCharacterHeal(),
    initCharacterTank(),
    initHUD(),
  ]);

  const characters = [dps, tank, heal];
  hud.setCharacters(...characters);

  let selected;
  const selectCharacter = (index) => () => {
    characters.forEach((c) => (c.isSelected = false));
    selected = characters[index];
    selected.isSelected = true;
  };
  selectCharacter(0)();
  onKey("1", selectCharacter(0));
  onKey("2", selectCharacter(1));
  onKey("3", selectCharacter(2));

  const scene = Scene({
    id: "main",
    objects: characters,
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
      hud.update();
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
      hud.render();
      scene.render();
    },
  });

  loop.start();
})();

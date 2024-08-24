import {
  depthSort,
  init,
  initInput,
  initPointer,
  initKeys,
  onKey,
  GameLoop,
  Scene,
  track,
} from "kontra";

import { initMap } from "./Map.js";
import { initBloodEffects } from "./BloodEffects.js";
import { initCharacterDps } from "./CharacterDps.js";
import { initCharacterHeal } from "./CharacterHeal.js";
import { initCharacterTank } from "./CharacterTank.js";
import { initEnemySwordsman } from "./EnemySwordsman.js";
import { initHUD } from "./HUD.js";

(async function () {
  init();
  initInput();
  initPointer();
  initKeys();

  const [map, bloodEffects, dps, heal, tank, hud, swordsman] =
    await Promise.all([
      initMap(),
      initBloodEffects(),
      initCharacterDps(),
      initCharacterHeal(),
      initCharacterTank(),
      initHUD(),
      initEnemySwordsman(),
    ]);

  const characters = [dps, tank, heal];
  hud.setCharacters(...characters);
  swordsman.target = dps;
  tank.target = swordsman;
  heal.target = swordsman;
  dps.target = swordsman;
  heal.friendlyTarget = tank;

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
  onKey("q", () => selected.abilities[0].use());

  const scene = Scene({
    id: "main",
    objects: [...characters, swordsman],
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
    track: function () {
      track(scene);
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

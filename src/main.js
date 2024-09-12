import { depthSort, init, initInput, onKey, GameLoop, Scene } from "kontra";

import { initMap } from "./Map.js";
import { initBloodEffects } from "./BloodEffects.js";
import { initCharacterDps } from "./CharacterDps.js";
import { initCharacterHeal } from "./CharacterHeal.js";
import { initCharacterTank } from "./CharacterTank.js";
import { initEnemySwordsman } from "./EnemySwordsman.js";

import { initEnemyAxeman } from "./EnemyAxeman.js";
import { initEnemySpearman } from "./EnemySpearman.js";
import { initEnemyMusketeer } from "./EnemyMusketeer.js";
import { initEnemyAssasin } from "./EnemyAssasin.js";
import { initFireball } from "./Fireball.js";
import { initHUD } from "./HUD.js";

(async function () {
  init();
  initInput();

  // disable right click context menu
  document.addEventListener("contextmenu", (event) => event.preventDefault());

  const [map, bloodEffects, dps, heal, tank, hud, swordsman, axeman, spearman, musketeer, assasin] = await Promise.all([
    initMap(),
    initBloodEffects(),
    initCharacterDps(),
    initCharacterHeal(),
    initCharacterTank(),
    initHUD(),
    initEnemySwordsman(),
    initEnemySpearman(),
    initEnemyAxeman(),
    initEnemyMusketeer(),
    initEnemyAssasin(),
    initFireball(),
  ]);

  // I know this is slop but I think chaining methods in js is funny.
  const enemies = swordsman.concat(axeman).concat(spearman).concat(musketeer).concat(assasin);

  const characters = [dps, tank, heal];
  hud.setCharacters(...characters);

  // set some default targets
  enemies.forEach((enemy) => {
    enemy.target = dps;
  });
  tank.target = enemies[0];
  dps.target = enemies[0];

  heal.target = enemies[0];
  heal.friendlyTarget = tank;

  let selected;
  const selectCharacter = (index) => () => {
    characters.forEach((c) => (c.isSelected = false));
    selected = characters[index];
    selected.isSelected = true;
    enemies.forEach((c) => (c.showOutline = false));
    selected.target.showOutline = true;
  };
  selectCharacter(0)();

  const scene = Scene({
    id: "main",
    objects: [...characters, ...enemies],
    sortFunction: depthSort,
  });

  onKey("1", selectCharacter(0));
  onKey("2", selectCharacter(1));
  onKey("3", selectCharacter(2));
  onKey("q", () => selected.abilities[0].use(scene));

  const effects = Scene({
    id: "effects",
    objects: [],
  });

  map.handleMapClick(({ x, y, outOfBounds }) => {
    if (outOfBounds) {
      return;
    }

    const character = characters.find((c) => c.collidesWithPointer({ x, y }));
    const enemy = enemies.find((e) => e.collidesWithPointer({ x, y }));

    if (selected === heal && character) {
      characters.forEach((c) => (c.showOutline = false));
      heal.friendlyTarget = character;
      return;
    } else if ([dps, tank].includes(selected) && enemy) {
      enemies.forEach((c) => (c.showOutline = false));
      selected.target = enemy;
      selected.target.showOutline = true;

      if (selected === tank) {
        selected.movingTo = null;
      }
      return;
    }

    if (selected === tank) {
      selected.target = null;
      enemies.forEach((c) => (c.showOutline = false));
    }

    selected.moveTo({ x, y });

    effects.add(bloodEffects.createBloodEffect({ x, y }));
  });

  const loop = GameLoop({
    blur: true,
    fps: 60,
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
      scene.objects.forEach((o) => {
        if (o.isAlive()) {
          return;
        }
        scene.remove(o);
      });
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

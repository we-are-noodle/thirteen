import { depthSort, init, initInput, onKey, GameLoop, Scene } from "./kontra";

import { initMap } from "./Map.js";
import { initCharacterDps } from "./CharacterDps.js";
import { initCharacterHeal } from "./CharacterHeal.js";
import { initCharacterTank } from "./CharacterTank.js";
import { initEnemySwordsman } from "./EnemySwordsman.js";
import Fireball, { initFireball } from "./Fireball.js";
import { initHUD } from "./HUD.js";

(async function () {
  init();
  initInput();

  const canvas = document.getElementById("game");

  // disable right click context menu
  document.addEventListener("contextmenu", (event) => event.preventDefault());

  const [map, dps, heal, tank, hud, enemies] = await Promise.all([
    initMap(canvas),
    initCharacterDps(),
    initCharacterHeal(),
    initCharacterTank(),
    initHUD(),
    initEnemySwordsman(),
    initFireball(),
  ]);

  const characters = [dps, tank, heal];
  hud.setCharacters(...characters);

  // set some default targets
  enemies.forEach((enemy) => {
    enemy.characters = characters;
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
    if (selected.target) {
      selected.target.showOutline = true;
    }
  };
  selectCharacter(0)();

  const scene = Scene({
    id: "main",
    objects: [...characters, ...enemies],
    sortFunction: (obj1, obj2, prop = "y") => {
      const order = depthSort(obj1, obj2, prop);
      if (obj1.isAlive && obj2.isAlive) {
        if (obj1.isAlive() && !obj2.isAlive()) {
          return 1;
        } else if (!obj1.isAlive() && obj2.isAlive()) {
          return -1;
        }
      }

      return order;
    },
  });

  onKey("1", selectCharacter(0));
  onKey("2", selectCharacter(1));
  onKey("3", selectCharacter(2));
  onKey("q", () => selected.abilities[0].use(scene));

  map.handleMapClick(({ x, y, outOfBounds }) => {
    if (outOfBounds) {
      return;
    }

    const character = characters.find((c) => {
      if (!c.isAlive()) {
        return false;
      }

      return c.collidesWithPointer({ x, y });
    });

    const enemy = enemies.find((e) => {
      if (!e.isAlive()) {
        return false;
      }

      return e.collidesWithPointer({ x, y });
    });

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
      selected.showOutline = false;
      selected.target = null;
    }

    selected.moveTo({ x, y });
  });

  const loop = GameLoop({
    blur: true,
    fps: 60,
    update: function (dt) {
      hud.update();
      scene.update(dt);
    },
    render: function () {
      map.render();
      hud.render();
      scene.render();
      scene.objects.forEach((o) => {
        if (o instanceof Fireball && o.currentAnimation.isStopped) {
          scene.remove(o);
        }
      });
    },
  });

  loop.start();
})();

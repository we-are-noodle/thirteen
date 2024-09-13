import { depthSort, init, initInput, onKey, GameLoop, randInt } from "./kontra";

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

  const [map, dps, heal, tank, hud, spawner] = await Promise.all([
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

  const enemies = spawner(1);
  enemies.forEach((enemy) => {
    enemy.characters = characters;
  });
  characters.forEach((character) => (character.enemies = enemies));

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

  const objects = [...characters, ...enemies];

  onKey("1", selectCharacter(0));
  onKey("2", selectCharacter(1));
  onKey("3", selectCharacter(2));
  onKey("q", () => selected.abilities[0].use(objects));
  onKey("r", () => {
    window.location.reload();
  });

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

  let level = 1;
  let gameOver = false;

  const loop = GameLoop({
    blur: true,
    fps: 60,
    update: function (dt) {
      if (characters.every((c) => !c.isAlive())) {
        gameOver = true;
        return;
      }

      hud.update();
      if (enemies.every((e) => !e.isAlive())) {
        level += 1;
        const newEnemies = spawner(Math.min(level, 13));
        newEnemies.forEach((enemy) => {
          enemy.characters = characters;
        });
        characters.forEach((character) => (character.enemies = newEnemies));
        objects.push(...newEnemies);
        enemies.push(...newEnemies);
      }
      objects.sort((obj1, obj2) => {
        const order = depthSort(obj1, obj2, "y");
        if (obj1.isAlive && obj2.isAlive) {
          if (obj1.isAlive() && !obj2.isAlive()) {
            return 1;
          } else if (!obj1.isAlive() && obj2.isAlive()) {
            return -1;
          }
        }

        return order;
      });
      objects.forEach((o) => o.update(dt));
    },
    render: function () {
      map.render();
      hud.render();
      objects.forEach((o) => {
        if (o instanceof Fireball && o.currentAnimation.isStopped) {
          objects.splice(objects.indexOf(o), 1);
        }
        o.render();
      });
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#fff";
      ctx.font = "bold 14px monospace";
      ctx.fillText(`${level}`, canvas.width - 24, 20);

      if (gameOver) {
        ctx.fillText("Game Over", 100, 100);
        ctx.fillText("Press R to restart", 100, 120);
      }
    },
  });

  loop.start();
})();

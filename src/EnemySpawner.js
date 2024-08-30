import Enemy from "./Enemy.js";
import {initEnemySwordsman} from "./EnemySwordsman.js";
import {randInt} from "kontra";

export default class EnemySpawner {
  constructor(frequency, scene) {
    this.frequency = frequency || 10;
    initEnemySwordsman().then((spritesheet) => {
      this.spritesheet = spritesheet;
    });
    this.scene = scene;
    this.timeSinceLastSpawn = this.frequency;
    this.start = false;
  }

  spawnEnemy() {
    const spawn = randInt(0, 3);
    const pos = { x: 285, y: 115 };

    if (spawn === 0) {
      pos.x = 160;
      pos.y = 55;
    } else if (spawn === 1) {
      pos.x = 160;
      pos.y = 175;
    } else if (spawn === 2) {
      pos.x = 35;
      pos.y = 115;
    }
    const enemy = new Enemy({
      ...pos,
      animations: this.spritesheet.animations,
      scene: this.scene,
      fixate: randInt(0, 1),
    });
    this.scene.add(enemy);
  }

  update(dt) {
    this.timeSinceLastSpawn += dt;

    if (this.timeSinceLastSpawn >= this.frequency && this.start) {
      this.spawnEnemy();
      this.timeSinceLastSpawn = 0;
    }
  }
}
import Enemy from "./Enemy.js";
import {initEnemySwordsman} from "./EnemySwordsman.js";
import {randInt} from "kontra";

export default class EnemySpawner {
  constructor(frequency, scene, characters) {
    this.frequency = frequency || 10;
    initEnemySwordsman().then((spritesheet) => {
      this.spritesheet = spritesheet;
    });
    this.scene = scene;
    this.characters = characters;
    this.timeSinceLastSpawn = 0;
  }

  spawnEnemy() {
    const enemy = new Enemy({
      x: 50,
      y: 50,
      animations: this.spritesheet.animations,
    });
    enemy.target = this.characters[randInt(0, this.characters.length - 1)];
    this.scene.add(enemy);
  }

  update(dt) {
    this.timeSinceLastSpawn += dt;

    if (this.timeSinceLastSpawn >= this.frequency) {
      this.spawnEnemy();
      this.timeSinceLastSpawn = 0;
    }
  }
}
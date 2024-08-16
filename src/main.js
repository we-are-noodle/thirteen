import {
  init,
  initInput,
  initPointer,
  getPointer,
  loadImage,
  TileEngine,
  track,
  Sprite,
  SpriteSheet,
  GameLoop,
} from "kontra";

import outdoorImg from "./assets/imgs/forrest.png";
import bloodSheet from "./assets/imgs/blood.png";
import necromancerSheet from "./assets/imgs/necromancer_sheet.png";
import mageSheet from "./assets/imgs/mage_sheet.png";
import swordsmanSheet from "./assets/imgs/swordsman_sheet.png";
import outdoorData from "./assets/data/forrest.json";

import Character from "./Character.js";
import InputHandler from "./InputHandler.js";

(async function () {
  init();
  initInput();
  initPointer();

  const [, bloodImg, necromancerImg, mageImg, swordsmanImg] = await Promise.all(
    [
      loadImage(outdoorImg),
      loadImage(bloodSheet),
      loadImage(necromancerSheet),
      loadImage(mageSheet),
      loadImage(swordsmanSheet),
    ],
  );
  outdoorData.tilesets[0].image = outdoorImg;

  const necromancerSpritesheet = SpriteSheet({
    image: necromancerImg,
    frameWidth: 16,
    frameHeight: 16,
    spacing: 0,
    margin: 0,
    animations: {
      idle: {
        frames: [1, 0],
        frameRate: 1,
      },
      walk: {
        frames: "0..4",
        frameRate: 5,
      },
    },
  });

  const mageSpritesheet = SpriteSheet({
    image: mageImg,
    frameWidth: 16,
    frameHeight: 16,
    spacing: 0,
    margin: 0,
    animations: {
      idle: {
        frames: [1, 0],
        frameRate: 1.5,
      },
      walk: {
        frames: "0..3",
        frameRate: 5,
      },
    },
  });

  const swordsmanSpritesheet = SpriteSheet({
    image: swordsmanImg,
    frameWidth: 16,
    frameHeight: 16,
    spacing: 0,
    margin: 0,
    animations: {
      idle: {
        frames: [1, 0],
        frameRate: 2,
      },
      walk: {
        frames: "0..4",
        frameRate: 5,
      },
    },
  });

  const bloodSpritesheet = SpriteSheet({
    image: bloodImg,
    margin: 0,
    spacing: 0,
    frameWidth: 25,
    frameHeight: 25,
    animations: {
      splat: {
        frames: "0..29",
        frameRate: 30,
        loop: false,
      },
    },
  });

  const effects = [];
  const tileEngine = TileEngine({
    ...outdoorData,
    onDown() {
      const { x, y } = getPointer();

      const tile = tileEngine.tileAtLayer("outOfBounds", { x, y });

      if (tile) {
        return;
      }

      const blood = Sprite({
        anchor: { x: 0.5, y: 0.5 },
        x,
        y,
        animations: bloodSpritesheet.animations,
      });
      blood.playAnimation("splat");

      effects.push(blood);

      if (effects.length > 10) {
        effects.shift();
      }
    },
  });

  track(tileEngine);

  const dps = new Character({
    x: 80,
    y: 112,
    animations: necromancerSpritesheet.animations,
    width: 16,
    height: 16,
  });

  const tank = new Character({
    x: 112,
    y: 112,
    animations: swordsmanSpritesheet.animations,
    width: 16,
    height: 16,
  });

  const healer = new Character({
    x: 144,
    y: 112,
    animations: mageSpritesheet.animations,
    width: 16,
    height: 16,
  });

  const inputHandler = new InputHandler(dps, tileEngine);
  inputHandler.setKeybind("1", dps);
  inputHandler.setKeybind("2", tank);
  inputHandler.setKeybind("3", healer);

  const playerCharacters = [dps, tank, healer];

  const loop = GameLoop({
    blur: true,
    update: function () {
      playerCharacters.forEach((c) => c.update());
      effects.forEach((f) => f.update());
    },
    render: function () {
      tileEngine.render();
      effects.forEach((f) => f.render());
      playerCharacters.forEach((c) => c.render());
    },
  });

  loop.start();
})();

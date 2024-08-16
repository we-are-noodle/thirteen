import {
  init,
  loadImage,
  TileEngine,
  track,
  Sprite,
  SpriteSheet,
  GameLoop,
} from "kontra";

import getMousePosition from "./getMousePosition.js";

import outdoorImg from "./assets/imgs/outdoor.png";
import bloodSheet from "./assets/imgs/blood.png";
import outdoorData from "./assets/data/outdoor.json";

import Character from "./Character.js";
import InputHandler from "./InputHandler.js";

(async function () {
  init();

  const dps = new Character({
    x: 80,
    y: 112,
    color: "red",
    width: 16,
    height: 16,
  });

  const tank = new Character({
    x: 112,
    y: 112,
    color: "blue",
    width: 16,
    height: 16,
  });

  const healer = new Character({
    x: 144,
    y: 112,
    color: "green",
    width: 16,
    height: 16,
  });

  const inputHandler = new InputHandler(dps);
  inputHandler.setKeybind("1", dps);
  inputHandler.setKeybind("2", tank);
  inputHandler.setKeybind("3", healer);

  const playerCharacters = [dps, tank, healer];

  const [, bloodImg] = await Promise.all([
    loadImage(outdoorImg),
    loadImage(bloodSheet),
  ]);
  outdoorData.tilesets[0].image = outdoorImg;

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
    onDown(e) {
      const { x, y } = getMousePosition(this.context.canvas, e);

      if (tileEngine.tileAtLayer("outOfBounds", { x, y })) {
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
    },
  });

  track(tileEngine);

  const loop = GameLoop({
    blur: true,
    update: function () {
      playerCharacters.forEach((c) => c.update());
      effects.forEach((f) => f.update());
    },
    render: function () {
      tileEngine.render();
      playerCharacters.forEach((c) => c.render());
      effects.forEach((f) => f.render());
    },
  });

  loop.start();
})();

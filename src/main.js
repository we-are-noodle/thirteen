import {
  init,
  initPointer,
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

const { canvas } = init();
initPointer();

(async function () {
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
      effects.forEach((ef) => ef.update());
    },
    render: function () {
      tileEngine.render();
      effects.forEach((ef) => ef.render());
    },
  });

  loop.start();
})();

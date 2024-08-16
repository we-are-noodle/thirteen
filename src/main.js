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
      let { row, col } = this.getPosition(e);
      const blood = Sprite({
        anchor: { x: 0.5, y: 0.5 },
        x: col * this.tilewidth + this.tilewidth / 2,
        y: row * this.tileheight + this.tileheight / 2,
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

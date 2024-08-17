import { init, GameLoop } from "kontra";
import Character from "./Character.js";
import InputHandler from "./InputHandler.js";

init();

const dps = new Character({
  x: 100,
  y: 80,
  color: "red",
  width: 20,
  height: 40,
});

const tank = new Character({
  x: 200,
  y: 100,
  color: "blue",
  width: 20,
  height: 40,
});

const healer = new Character({
  x: 200,
  y: 300,
  color: "green",
  width: 20,
  height: 40,
});

const inputHandler = new InputHandler(dps);
inputHandler.setKeybind("1", dps);
inputHandler.setKeybind("2", tank);
inputHandler.setKeybind("3", healer);

const loop = GameLoop({
  update: function () {
    tank.update();
    dps.update();
    healer.update();
  },
  render: function () {
    tank.render();
    dps.render();
    healer.render();
  },
});

loop.start();

// lib
import initCanvas from "./lib/initCanvas";
import input from "./input";
import Demo from "./scenes/Demo";

const { context } = initCanvas("#stage", "2d", 800, 600);
input.addEventListeners();

const scene = new Demo(context, input).load().start();

const autoPause = e => {
  if (document.hidden) {
    scene.stop();
  } else {
    scene.start();
  }
};

window.addEventListener("visibilitychange", autoPause);

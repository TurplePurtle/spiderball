// lib
import initCanvas from "./lib/initCanvas";
import input from "./input";
import Demo from "./scenes/Demo";
import allTexturesLoaded from "./textures";

const { context } = initCanvas("#stage", "2d", 800, 600);
input.addEventListeners();

allTexturesLoaded.then(textures => {

  const scene = new Demo({
    canvasContext: context,
    input,
    textures,
  }).load().start();

  const autoPause = e => {
    if (document.hidden) {
      scene.stop();
    } else {
      scene.start();
    }
  };

  window.addEventListener("visibilitychange", autoPause);

});

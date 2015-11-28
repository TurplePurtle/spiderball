// lib
import initCanvas from "./lib/initCanvas";
import input from "./input";
import Demo from "./scenes/Demo";

const { context } = initCanvas("#stage", "2d", 800, 600);
input.addEventListeners();

new Demo(context, input).run();

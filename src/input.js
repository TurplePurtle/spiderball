import Input from "./lib/Input";

export default new Input({
  keys: {
    "w": "up",
    "a": "left",
    "s": "down",
    "d": "right",
    " ": "action",
    "&": "up",
    "%": "left",
    "(": "down",
    "'": "right",
  },
  axesFromKeys: [
    {"axis": "x", "defaultValue": 0, names: ["left", "right"], values: [-1, 1]},
    {"axis": "y", "defaultValue": 0, names: ["up", "down"], values: [-1, 1]},
  ],
  gamepad: {
    buttons: [
      0, "action",
      12, "up",
      13, "down",
      14, "left",
      15, "right",
    ],
    axes: [
      0, "x",
      1, "y",
    ],
  },
});

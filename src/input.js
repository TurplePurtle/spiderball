import Input from "./lib/Input";

export default new Input({
  keys: {
    " ": "action",
    "W": "jump",
    "A": "left",
    "S": "down",
    "D": "right",
    "&": "jump",
    "%": "left",
    "(": "down",
    "'": "right",
  },
  axesFromKeys: [
    {"axis": "x", "defaultValue": 0, names: ["left", "right"], values: [-1, 1]},
  ],
  gamepad: {
    buttons: [
      0, "jump",
      2, "action",
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

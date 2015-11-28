import Input from "./lib/Input";

export default new Input({
  keys: {
    "w": "up",
    "a": "left",
    "s": "down",
    "d": "right",
    " ": "jump",
  },
  axesFromKeys: [
    {"axis": "x", "defaultValue": 0, names: ["left", "right"], values: [-1, 1]},
    {"axis": "y", "defaultValue": 0, names: ["up", "down"], values: [-1, 1]},
  ],
});

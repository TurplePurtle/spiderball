import Gamepad from "./Gamepad";

export default function GamepadManager() {
  this.gamepads = [];
  this.updateGamepads();
}

GamepadManager.prototype.updateGamepads = function() {
  if (!navigator.getGamepads) return;

  const gpads = navigator.getGamepads();
  const len = gpads.length;

  for (let i = 0; i < len; i++) {
    const gpad = gpads[i];
    if (i + 1 > this.gamepads.length || this.gamepads[gpad.index].gamepad !== gpad) {
      this.gamepads[gpad.index] = new Gamepad(gpad);
    }
  }

  if (this.gamepads.length !== len) {
    this.gamepads.length = len;
  }
};

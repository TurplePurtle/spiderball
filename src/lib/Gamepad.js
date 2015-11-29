import mappings from "./gamepadMappings";

export default function Gamepad(gamepad) {
  this.gamepad = gamepad;
  this.mapping = null;
  this.autoMap();
}

Gamepad.prototype.autoMap = function() {
  if (this.gamepad.id.indexOf("Xbox One") >= 0) {
    this.mapping = mappings.XBOXONE.fromStandard;
  }
};

Gamepad.prototype.isPressed = function(btnIndex) {
  const ind = this.mapping ? this.mapping.buttons[btnIndex] : btnIndex;
  return this.gamepad.buttons[ind].pressed;
};

Gamepad.prototype.getAxis = function(axisIndex) {
  const ind = this.mapping ? this.mapping.axes[axisIndex] : axisIndex;
  return this.gamepad.axes[ind];
};

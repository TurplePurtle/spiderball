/**
  Usage:
    const input = new Input({
     "w": "up",
     "a": "left",
     "s": "down",
     "d": "right",
     " ": "jump",
    }).addEventListeners();

    function update(dt) {
      if (input.isPressed("jump")) {
        player.jump();
      }
    }
 */

export default function Input(config) {
  if (!config) throw new Error("No config was given.");

  this.codeToName = {};
  this.nameToValue = {};
  this.axisToValue = {};
  this.nameToAxisFromKeys = {};
  this.justPressedInputs = [];
  this.gamepadConfig = config.gamepad;

  if (config.keys) {
    const keyToName = config.keys;
    for (let key in keyToName) {
      const code = key.toUpperCase().charCodeAt(0);
      const name = keyToName[key];
      this.codeToName[code] = name;
      this.nameToValue[name] = false;
    }
  }

  if (config.axesFromKeys) {
    const axesFromKeys = config.axesFromKeys;
    for (let i = 0, len = axesFromKeys.length; i < len; i++) {
      const axisFromKey = axesFromKeys[i];
      this.axisToValue[axisFromKey.axis] = axisFromKey.defaultValue;
      this.nameToAxisFromKeys[axisFromKey.names[0]] = axisFromKey;
      this.nameToAxisFromKeys[axisFromKey.names[1]] = axisFromKey;
    }
  }

  this.listenersAttached = false;
  this.keydown = e => { this._onkeydown(e); };
  this.keyup = e => { this._onkeyup(e); };
}

Input.prototype.isPressed = function(name) {
  return this.nameToValue[name];
};

Input.prototype.justPressed = function(name) {
  return this.justPressedInputs.indexOf(name) >= 0;
};

Input.prototype.getAxis = function(axis) {
  return this.axisToValue[axis];
};

Input.prototype.clearJustPressed = function() {
  this.justPressedInputs.length = 0;
};

Input.prototype.updateAxisFromKey = function(name) {
  const axisFromKey = this.nameToAxisFromKeys[name];
  if (!axisFromKey) return;
  const { names, values } = axisFromKey;
  this.axisToValue[axisFromKey.axis] =
    this.nameToValue[names[0]] ? values[0] :
    this.nameToValue[names[1]] ? values[1] :
    /* otherwise */ axisFromKey.defaultValue;
};

Input.prototype.updateFromGamepad = function(gamepad, mapping) {
  // update buttons
  const buttons = this.gamepadConfig.buttons;
  if (buttons) {
    for (let i = 0, len = buttons.length; i < len; i+=2) {
      const name = buttons[i+1];
      const btnIndex = mapping ? mapping.buttons[buttons[i]] : buttons[i];
      const pressed = gamepad.buttons[btnIndex].pressed;
      if (pressed && !this.nameToValue[name]) {
        this.justPressedInputs.push(name);
      }
      this.nameToValue[name] = pressed;
    }
  }

  // update axes
  const axes = this.gamepadConfig.axes;
  if (axes) {
    for (let i = 0, len = axes.length; i < len; i+=2) {
      const axisIndex = mapping ? mapping.axes[axes[i]] : axes[i];
      this.axisToValue[axes[i+1]] = gamepad.axes[axisIndex];
    }
  }
};

Input.prototype.afterUpdate = function() {
  this.clearJustPressed();
};

Input.prototype._onkeydown = function(e) {
  const code = e.keyCode;
  const name = this.codeToName[code];
  if (name) {
    if (!this.nameToValue[name]) this.justPressedInputs.push(name);
    this.nameToValue[name] = true;
    this.updateAxisFromKey(name);
  }
};

Input.prototype._onkeyup = function(e) {
  const code = e.keyCode;
  const name = this.codeToName[code];
  if (name) {
    this.nameToValue[name] = false;
    this.updateAxisFromKey(name);
  }
};

Input.prototype.addEventListeners = function() {
  if (!this.listenersAttached) {
    this.listenersAttached = true;
    window.addEventListener("keydown", this.keydown);
    window.addEventListener("keyup", this.keyup);
  }
  return this;
};

Input.prototype.removeEventListeners = function() {
  if (this.listenersAttached) {
    this.listenersAttached = false;
    window.removeEventListener("keydown", this.keydown);
    window.removeEventListener("keyup", this.keyup);
  }
  return this;
};

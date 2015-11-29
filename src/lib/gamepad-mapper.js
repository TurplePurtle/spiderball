const mappings = {
  XBOXONE: {
    standard: {
      buttons: [11, 12, 13, 14, 8, 9, -1, -1, 5, 4, 6, 7, 0, 1, 2, 3, 10],
      axes: [0, 1, 2, 3],
    },
  },
};

export function mappingForGamepad(gamepad) {
  if (gamepad.mapping === "") {
    if (gamepad.id.indexOf("Xbox One") >= 0) {
      return mappings.XBOXONE.standard;
    }
  }
  return null;
}

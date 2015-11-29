const mappings = {
  XBOXONE: {
    toStandard: {
      buttons: [12, 13, 14, 15, 9, 8, 10, 11, 4, 5, 16, 0, 1, 2, 3],
      axes: [0, 1, -1, 2, 3, -1],
    },
    fromStandard: {
      buttons: [11, 12, 13, 14, 8, 9, -1, -1, 5, 4, 6, 7, 0, 1, 2, 3, 10],
      axes: [0, 1, 2, 3],
    },
  },
};

export default mappings;

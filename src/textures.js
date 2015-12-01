const textures = {
  spider: {
    image: null,
    src: "sprites/spider.png",
    frameWidth: 16,
    frameHeight: 16,
    scale: 1,
    numFrames: 0,
    fps: 8,
  },
  platform: {
    image: null,
    src: "sprites/platform.png",
    frameWidth: 8,
    frameHeight: 8,
    scale: 1,
    numFrames: 0,
    fps: 0,
  },
};

const texturesLoaded = Object.keys(textures).map(name => new Promise((resolve, reject) => {
  const texture = textures[name];
  const image = new Image();
  image.onload = e => {
    texture.image = image;
    if (!texture.numFrames) {
      texture.numFrames = image.width / texture.frameWidth;
    }
    resolve(image);
  };
  image.src = texture.src;
}));

const allTexturesLoaded = Promise.all(texturesLoaded).then(ps => textures);

export default allTexturesLoaded;

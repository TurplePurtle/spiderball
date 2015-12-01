export default function(selector, ctxType, width, height) {
  const stage = document.querySelector(selector);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext(ctxType);
  canvas.width = width;
  canvas.height = height;
  context.mozImageSmoothingEnabled = false;
  context.webkitImageSmoothingEnabled = false;
  context.imageSmoothingEnabled = false;
  stage.appendChild(canvas);
  return { canvas, context };
}

import Position from "../components/Position";
import Sprite from "../components/Sprite";

export default class SpriteRenderSystem {
  constructor() {
  }

  run(context) {
    const ctx = context.canvasContext;
    const dt = context.dt;
    const entities = context.entityService.getComponentMap(Sprite);
    for (let i = 0, len = entities.length; i < len; i++) {
      const entity = entities[i];
      const pos = entity.getComponent(Position);
      const spriteComp = entity.getComponent(Sprite);
      const sprite = spriteComp.sprite;
      if (!sprite.image) continue;
      const w = sprite.frameWidth;
      const h = sprite.frameHeight;
      let xOff = 0;
      if (sprite.numFrames > 1) {
        xOff = (spriteComp.currentFrame | 0) * w;
        spriteComp.currentFrame = (spriteComp.currentFrame + sprite.fps * dt) % sprite.numFrames;
      }
      const s = sprite.scale;
      const x = (pos.x - 0.5*s*w) | 0;
      const y = (pos.y - 0.5*s*h) | 0;
      ctx.drawImage(sprite.image, xOff, 0, w, h, x, y, s*w, s*h);
    }
  }
}

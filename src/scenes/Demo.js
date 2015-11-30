// lib
import assign from "lodash/object/assign";
import Loop from "../lib/Loop";
import { EntityService } from "../lib/ezs";
import { mappingForGamepad } from "../lib/gamepad-mapper";
// components
import Position from "../components/Position";
import Velocity from "../components/Velocity";
import Gravity from "../components/Gravity";
import CollisionBox from "../components/CollisionBox";
import RenderBox from "../components/RenderBox";
import Platform from "../components/Platform";
import PlatformStander from "../components/PlatformStander";
import Player from "../components/Player";
import FallDeath from "../components/FallDeath";
import Spider from "../components/Spider";
import Web from "../components/Web";
// systems
import PlayerSpiderControlSystem from "../systems/PlayerSpiderControlSystem";
import GravitySystem from "../systems/GravitySystem";
import VelocitySystem from "../systems/VelocitySystem";
import ClearScreenSystem from "../systems/ClearScreenSystem";
import RenderBoxSystem from "../systems/RenderBoxSystem";
import PlatformSystem from "../systems/PlatformSystem";
import SpiderWebSystem from "../systems/SpiderWebSystem";
import SpiderWebRenderSystem from "../systems/SpiderWebRenderSystem";

export default function Demo(canvasContext, input) {
  this.canvasContext = canvasContext;
  this.input = input;
  this.loop = new Loop(this.tick, { useRAF: true }, this);
  this.running = false;
  this.entityService = null;
  this.player = null;
  this.dt = 0;

  this.updateSystems = [
    new PlayerSpiderControlSystem,
    new GravitySystem,
    new SpiderWebSystem,
    new VelocitySystem,
    new PlatformSystem,
  ];

  this.renderSystems = [
    new ClearScreenSystem,
    new SpiderWebRenderSystem,
    new RenderBoxSystem,
  ];
}

Demo.prototype.load = function() {
  this.entityService = new EntityService();
  window.entityService = this.entityService;
  this.entityService.registerComponent(Position);
  this.entityService.registerComponent(Velocity);
  this.entityService.registerComponent(Gravity);
  this.entityService.registerComponent(CollisionBox);
  this.entityService.registerComponent(RenderBox);
  this.entityService.registerComponent(Platform);
  this.entityService.registerComponent(PlatformStander);
  this.entityService.registerComponent(Player);
  this.entityService.registerComponent(FallDeath);
  this.entityService.registerComponent(Spider);
  this.entityService.registerComponent(Web);

  const player = this.entityService.createEntity();
  player.setComponent(Position, assign(new Position, { x: 150, y: 250 }));
  player.setComponent(Velocity, assign(new Velocity, { x: 1000 }));
  player.setComponent(Gravity, new Gravity(300));
  player.setComponent(CollisionBox, assign(new CollisionBox, { x: -10, y: -10, w: 20, h: 20 }));
  player.setComponent(RenderBox, assign(new RenderBox, { x: -10, y: -10, w: 20, h: 20 }));
  player.setComponent(PlatformStander, new PlatformStander);
  player.setComponent(Player, new Player);
  player.setComponent(FallDeath, new FallDeath(this.canvasContext.canvas.height));
  player.setComponent(Spider, new Spider);
  player.setComponent(Web, new Web);
  this.player = player;

  [
    { x: 50, y: 400, vx: 50 },
    { x: 150, y: 450 },
    { x: 250, y: 400 },
    { x: 350, y: 350 },
    { x: 550, y: 350 },
    { x: 650, y: 300 },
    { x: 700, y: 250 },
    { x: 650, y: 200 },
    { x: 425, y: 100, w: 80 },
    { x: 300, y: 200, w: 100 },
  ].forEach(props => {
    const w = props.w || 50;
    const h = props.h || 6;
    const pos = new Position();
    pos.x = props.x;
    pos.y = props.y;
    const collBox = new CollisionBox();
    const renBox = new RenderBox();
    collBox.x = renBox.x = -w / 2;
    collBox.y = renBox.y = -h / 2;
    collBox.w = renBox.w = w;
    collBox.h = renBox.h = h;
    const platform = new Platform;
    const entity = this.entityService.createEntity();
    entity.setComponent(Position, pos);
    entity.setComponent(CollisionBox, collBox);
    entity.setComponent(RenderBox, renBox);
    entity.setComponent(Platform, platform);
  });

  return this;
};

Demo.prototype.tick = function(dt) {
  this.dt = Math.min(dt, 0.04); // cap dt at 1 / 25
  const updateSystems = this.updateSystems;
  const renderSystems = this.renderSystems;

  if (this.player.getComponent(FallDeath).triggered) {
    this.load();
    return;
  }

  const gamepad = navigator.getGamepads && navigator.getGamepads()[0];
  if (gamepad) {
    this.input.updateFromGamepad(gamepad, mappingForGamepad(gamepad));
  }

  for (let i = 0, len = updateSystems.length; i < len; i++) {
    updateSystems[i].run(this);
  }
  this.input.afterUpdate();

  for (let i = 0, len = renderSystems.length; i < len; i++) {
    renderSystems[i].run(this);
  }
};

Demo.prototype.start = function() {
  if (this.running) return;
  this.running = true;
  this.loop.start();
  return this;
};

Demo.prototype.stop = function() {
  if (!this.running) return;
  this.running = false;
  this.loop.stop();
  return this;
};

Demo.prototype.unload = function() {
  this.stop();
  this.loop = null;
  return this;
};

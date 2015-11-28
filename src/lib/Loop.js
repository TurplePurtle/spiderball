export default function Loop(fn, opts, thisArg) {
  this.fn = fn;
  this.thisArg = thisArg;
  this.t0 = 0;
  this.running = false;
  this.opts = opts;
  this._loop = null;
  if (!this.opts.useRAF && !this.opts.interval) {
    this.opts.interval = 1000 / 60;
  }
}

Loop.prototype.run = function() {
  this.running = true;

  if (this.opts.useRAF) {
    this._loop = t => {
      if (!this.running) return;
      this.fn.call(this.thisArg, (t - this.t0) * 1e-3);
      this.t0 = t;
      window.requestAnimationFrame(this._loop);
    };

    window.requestAnimationFrame(t => {
      this.t0 = t;
      window.requestAnimationFrame(this._loop);
    });
  } else {
    this._loop = () => {
      const t = Date.now();
      if (!this.running) return;
      this.fn.call(this.thisArg, (t - this.t0) * 1e-3);
      this.t0 = t;
      window.setTimeout(this._loop, this.opts.interval);
    };

    this.t0 = Date.now() - this.opts.interval;
    this._loop();
  }

  return this;
};

Loop.prototype.start = Loop.prototype.run;

Loop.prototype.stop = function() {
  this.running = false;
  return this;
};

Loop.start = function(dt, opts, thisArg) {
  return new Loop(dt, opts, thisArg).run();
};

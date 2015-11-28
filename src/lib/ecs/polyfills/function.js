const fnNameExp = /function ([^\(]+)/;

function getFunctionName(fn) {
  let matchResults = fnNameExp.exec(fn.toString());
  if (matchResults)
    return matchResults[1];
  else
    return undefined;
}

function polyfillFunction(global) {
  let Function = global.Function;
  if (Function.prototype.name === undefined) {
    Object.defineProperty(Function.prototype, 'name', {
      get: function(){
        let fnName = this.$__name;
        if (fnName === undefined)
          fnName = this.$__name = getFunctionName(this);

        return fnName;
      },
      configurable: false,
      enumerable: false
    });
  }
}

polyfillFunction(self);

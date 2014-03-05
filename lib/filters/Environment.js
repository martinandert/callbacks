'use strict';

function Environment(target, halted, value, runFunc) {
  this._target   = target;
  this._halted   = halted;
  this._value    = value;
  this._runFunc  = runFunc;
}

Environment.prototype.getTarget = function() {
  return this._target;
};

Environment.prototype.setTarget = function(value) {
  this._target = value;
};

Environment.prototype.getHalted = function() {
  return this._halted;
};

Environment.prototype.setHalted = function(value) {
  this._halted = value;
};

Environment.prototype.getValue = function() {
  return this._value;
};

Environment.prototype.setValue = function(value) {
  this._value = value;
};

Environment.prototype.getRunFunc = function() {
  return this._runFunc;
};

Environment.prototype.setRunFunc = function(value) {
  this._runFunc = value;
};

module.exports = Environment;

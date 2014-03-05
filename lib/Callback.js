'use strict';

var Type    = require('./Type');
var Filters = require('./Filters');

var wrap = require('./utils/wrap');

function Callback(name, filter, kind, options, chainConfig) {
  this.name   = name;
  this.kind   = kind;
  this.filter = filter;
  this.key    = this._computeIdentifier(filter);
  this.if     = wrap(options.if);
  this.unless = wrap(options.unless);
  this.chainConfig = chainConfig;
}

Callback.build = function(chain, filter, kind, options) {
  return new Callback(chain.name, filter, kind, options, chain.config);
};

Callback.prototype.getKind = function() {
  return this.kind;
};

Callback.prototype.setKind = function(value) {
  this.kind = value;
};

Callback.prototype.getName = function() {
  return this.name;
};

Callback.prototype.setName = function(value) {
  this.name = value;
};

Callback.prototype.getChainConfig = function() {
  return this.chainConfig;
};

Callback.prototype.getFilter = function() {
  return this.key;
};

Callback.prototype.getRawFilter = function() {
  return this.filter;
};

Callback.prototype.merge = function(chain, newOptions) {
  var options = {
    if:     this.if.slice(),
    unless: this.unless.slice()
  };

  options.if      = options.if.concat(wrap(newOptions.unless));
  options.unless  = options.unless.concat(wrap(newOptions.if));

  return Callback.build(chain, this.filter, this.kind, options);
};

Callback.prototype.matches = function(_kind, _filter) {
  return this.kind === _kind && this.getFilter() === _filter;
};

Callback.prototype.duplicates = function(other) {
  if (Object.prototype.toString.call(this.filter) === '[object String]') {
    return this.matches(other.getKind(), other.getFilter());
  }

  return false;
};

Callback.prototype.apply = function(nextCallback) {
  var userConditions = this._getConditionsFunctions();
  var userCallback   = this._makeFunction(this.filter);

  switch (this.getKind()) {
    case Type.BEFORE:
      return Filters.Before(nextCallback, userCallback, userConditions, this.getChainConfig, this.filter);
    case Type.AFTER:
      return Filters.After(nextCallback, userCallback, userConditions, this.getChainConfig);
    case Type.AROUND:
      return Filters.Around(nextCallback, userCallback, userConditions, this.getChainConfig);
    default:
      throw new Error('Callback#apply: unknown callback type: ' + this.getKind().toString());
  }
};

Callback.prototype._invertFunction = function(fn) {
  var self = this;

  return function() {
    return !fn.apply(self, arguments);
  };
};

Callback.prototype._makeFunction = function(filter) {
  switch (Object.prototype.toString.call(filter)) {
    case '[object String]':
      return function(target, _, fn) {
        return target[filter](fn);
      };

    case '[object Function]':
      return function(target, _) {
        return filter.call(target, target);
      };

    default:
      return filter;
  }
};

Callback.prototype._computeIdentifier = function(filter) {
  return filter.toString();
};

Callback.prototype._getConditionsFunctions = function() {
  return this.if.map(function(c) {
    return this._makeFunction(c);
  }, this).concat(this.unless.map(function(c) {
    return this._invertFunction(this._makeFunction(c));
  }, this));
};

module.exports = Callback;

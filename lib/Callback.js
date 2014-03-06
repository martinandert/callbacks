'use strict';

var Type    = require('./Type');
var Filters = require('./Filters');

var wrap = require('./utils/wrap');

function Callback(name, filter, type, options, chainConfig) {
  this._name   = name;
  this._type   = type;
  this._filter = filter;
  this._key    = this._computeIdentifier(filter);
  this._if     = wrap(options.if);
  this._unless = wrap(options.unless);
  this._chainConfig = chainConfig;
}

Callback.build = function(chain, filter, type, options) {
  return new Callback(chain.name, filter, type, options, chain.config);
};

Callback.prototype.getType = function() {
  return this._type;
};

Callback.prototype.setType = function(value) {
  this._type = value;
};

Callback.prototype.getName = function() {
  return this._name;
};

Callback.prototype.setName = function(value) {
  this._name = value;
};

Callback.prototype.getChainConfig = function() {
  return this._chainConfig;
};

Callback.prototype.getFilter = function() {
  return this._key;
};

Callback.prototype.getRawFilter = function() {
  return this._filter;
};

Callback.prototype.merge = function(chain, newOptions) {
  var options = {
    if:     this._if.slice(),
    unless: this._unless.slice()
  };

  options.if      = options.if.concat(wrap(newOptions.unless));
  options.unless  = options.unless.concat(wrap(newOptions.if));

  return Callback.build(chain, this._filter, this._type, options);
};

Callback.prototype.matches = function(type, filter) {
  return this._type === type && this.getFilter() === filter;
};

Callback.prototype.duplicates = function(other) {
  if (Object.prototype.toString.call(this._filter) === '[object String]') {
    return this.matches(other.getType(), other.getFilter());
  }

  return false;
};

Callback.prototype.apply = function(nextCallback) {
  var userConditions = this._getConditionsFunctions();
  var userCallback   = this._makeFunction(this._filter);

  switch (this.getType()) {
    case Type.BEFORE:
      return Filters.Before(nextCallback, userCallback, userConditions, this.getChainConfig, this._filter);
    case Type.AFTER:
      return Filters.After(nextCallback, userCallback, userConditions, this.getChainConfig);
    case Type.AROUND:
      return Filters.Around(nextCallback, userCallback, userConditions, this.getChainConfig);
    default:
      throw new Error('Callback#apply: unknown callback type: ' + this.getType().toString());
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
  return this._if.map(function(c) {
    return this._makeFunction(c);
  }, this).concat(this._unless.map(function(c) {
    return this._invertFunction(this._makeFunction(c));
  }, this));
};

module.exports = Callback;

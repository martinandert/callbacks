'use strict';

var Filters = require('./Filters');

var remove = require('./utils/remove');
var removeIf = require('./utils/removeIf');

function CallbackChain(name, config) {
  this._name   = name;
  this._config = config;
  this._chain  = [];
  this._callbacks = null;
}

CallbackChain.prototype.forEach = function(fn) {
  return this._chain.forEach(fn);
};

CallbackChain.prototype.indexOf = function(callback) {
  return this._chain.indexOf(callback);
};

CallbackChain.prototype.isEmpty = function() {
  return this._chain.length === 0;
};

CallbackChain.prototype.insert = function(index, callback) {
  this._callbacks = null;
  this._chain.splice(index, 0, callback);
};

CallbackChain.prototype.remove = function(callback) {
  this._callbacks = null;
  remove(this._chain, callback);
};

CallbackChain.prototype.clear = function() {
  this._callbacks = null;
  this._chain = [];
  return this;
};

CallbackChain.prototype.compile = function() {
  return this._callbacks || (
    this._callbacks = this._chain.slice().reverse().reduce(function(chain, callback) {
      return callback.apply(chain);
    }, Filters.End)
  );
};

CallbackChain.prototype.append = function() {
  var callbacks = Array.prototype.slice.call(arguments);

  callbacks.forEach(function(callback) {
    this._appendOne(callback);
  }, this);
};

CallbackChain.prototype.prepend = function() {
  var callbacks = Array.prototype.slice.call(arguments);

  callbacks.forEach(function(callback) {
    this._prependOne(callback);
  }, this);
};

CallbackChain.prototype._appendOne = function(callback) {
  this._callbacks = null;
  this._removeDuplicates(callback);
  this._chain.push(callback);
};

CallbackChain.prototype._prependOne = function(callback) {
  this._callbacks = null;
  this._removeDuplicates(callback);
  this._chain.unshift(callback);
};

CallbackChain.prototype._removeDuplicates = function(callback) {
  this._callbacks = null;

  removeIf(this._chain, function(c) {
    return callback.duplicates(c);
  });
};

CallbackChain.copy = function(other) {
  var cbc = new CallbackChain();
  cbc._name   = this._name;
  cbc._config = this._config;
  cbc._chain  = other._chain.splice();
  cbc._callbacks = null;
};

module.exports = CallbackChain;

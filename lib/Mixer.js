'use strict';

var CallbackChain = require('./CallbackChain');
var Callback      = require('./Callback');
var Filters       = require('./Filters');
var Type          = require('./Type');

var include   = require('./utils/include');
var extend    = require('./utils/extend');
var slice     = Array.prototype.slice;
var toString  = Object.prototype.toString;

var Mixer = {
  mixInto: function(ctorFunc) {
    ctorFunc.callbacks = {};

    ctorFunc.defineCallbacks = function() {
      var names = slice.call(arguments);
      var options = {};

      if (toString.call(names[names.length - 1]) === '[object Object]') {
        extend(options, names.pop());
      }

      console.log(names, options);

      names.forEach(function(name) {
        this.callbacks[name] = new CallbackChain(name, options);
      }, this);
    };

    ctorFunc.setCallback = function() {
      var filters = slice.call(arguments);
      var name    = filters.shift();
      var chain   = this.callbacks[name];
      var type    = include(Type._ALL, filters[0]) ? filters.shift() : Type.BEFORE;
      var options = {};

      if (toString.call(filters[filters.length - 1]) === '[object Object]') {
        extend(options, filters.pop());
      }

      console.log(name, type, options);

      var callbacks = filters.map(function(filter) {
        return Callback.build(chain, filter, type, options);
      });

      options.prepend ? chain.prepend(callbacks) : chain.append(callbacks);

      this.callbacks[name] = chain;
    };

    var proto = ctorFunc.prototype;

    proto.runCallbacks = function(name, fn) {
      var chain = ctorFunc.callbacks[name];

      if (chain.isEmpty()) {
        if (fn) {
          return fn.call(this);
        }
      } else {
        var run = chain.compile();
        var env = new Filters.Environment(this, false, null, fn);

        return run(env).getValue();
      }
    };

    proto._haltedCallbackHook = function(filter) {
      // A hook invoked every time a before callback is halted.
      // This can be overridden in callback implementors in order
      // to provide better debugging/logging.
    };
  }
};

module.exports = Mixer;

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
    ctorFunc.callbackChains = {};

    ctorFunc.defineCallbackChains = function() {
      var names = slice.call(arguments);
      var options = {};

      if (toString.call(names[names.length - 1]) === '[object Object]') {
        extend(options, names.pop());
      }

      names.forEach(function(name) {
        this.callbackChains[name] = new CallbackChain(name, options);
      }, this);
    };

    ctorFunc.defineCallbackChain = ctorFunc.defineCallbackChains;

    ctorFunc.registerCallback = function() {
      var filters = slice.call(arguments);
      var name    = filters.shift();
      var chain   = this.callbackChains[name];
      var type    = include(Type._ALL, filters[0]) ? filters.shift() : Type.BEFORE;
      var options = {};

      if (toString.call(filters[filters.length - 1]) === '[object Object]') {
        extend(options, filters.pop());
      }

      var callbacks = filters.map(function(filter) {
        return Callback.build(chain, type, filter, options);
      });

      options.prepend ? chain.prepend(callbacks) : chain.append(callbacks);

      this.callbackChains[name] = chain;
    };

    var proto = ctorFunc.prototype;

    proto.runCallbacks = function(name, fn, done) {
      var chain = ctorFunc.callbackChains[name];

      if (!done) {
        done = fn;
        fn = null;
      }

      if (chain.isEmpty()) {
        if (fn) {
          fn.call(this, done);
        } else {
          done.call(this, null, this);
        }
      } else {
        var self  = this;

        chain.compile(function(run) {
          var env = { target: self, halted: false, error: null, result: null, fn: fn };

          run(env, function(env) {
            done.call(env.target, env.error, env.target);
          });
        });
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

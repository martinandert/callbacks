'use strict';

var hasProp = require('../utils/hasProp');
var all     = require('../utils/all');

function Around(nextCallback, userCallback, userConditions, chainConfig) {
  if (hasProp(chainConfig, 'terminator') && userConditions.length) {
    return function(env) {
      var target = env.getTarget();
      var value  = env.getValue();
      var halted = env.getHalted();

      if (!halted && all(userConditions, function(c) { return c.call(target, value); })) {
        userCallback.call(target, value, function() {
          env = nextCallback.call(env);
          return env.value;
        });

        return env;
      } else {
        return nextCallback.call(env);
      }
    };
  } else if (hasProp(chainConfig, 'terminator')) {
    return function(env) {
      var target = env.getTarget();
      var value  = env.getValue();

      if (!env.getHalted()) {
        userCallback.call(target, value, function() {
          env = nextCallback.call(env);
          return env.value;
        });

        return env;
      } else {
        return nextCallback.call(env);
      }
    };
  } else if (userConditions.length) {
    return function(env) {
      var target = env.getTarget();
      var value  = env.getValue();

      if (all(userConditions, function(c) { return c.call(target, value); })) {
        userCallback.call(target, value, function() {
          env = nextCallback.call(env);
          return env.value;
        });

        return env;
      } else {
        return nextCallback.call(env);
      }
    };
  } else {
    return function(env) {
      userCallback.call(env.getTarget(), env.getValue(), function() {
        env = nextCallback.call(env);
        return env.value;
      });

      return env;
    };
  }
}

module.exports = Around;

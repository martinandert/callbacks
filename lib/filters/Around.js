'use strict';

var hasProp = require('../utils/hasProp');
var all     = require('../utils/all');

function Around(nextCallback, userCallback, userConditions, chainConfig) {
  if (hasProp(chainConfig, 'terminator') && userConditions.length) {
    return function(env) {
      var target = env.getTarget();
      var value  = env.getValue();
      var halted = env.getHalted();

      if (!halted && all(userConditions, function(c) { return c(target, value); })) {
        userCallback(target, value, function() {
          env = nextCallback(env);
          return env.value;
        });

        return env;
      } else {
        return nextCallback(env);
      }
    };
  } else if (hasProp(chainConfig, 'terminator')) {
    return function(env) {
      var target = env.getTarget();
      var value  = env.getValue();

      if (!env.getHalted()) {
        userCallback(target, value, function() {
          env = nextCallback(env);
          return env.value;
        });

        return env;
      } else {
        return nextCallback(env);
      }
    };
  } else if (userConditions.length) {
    return function(env) {
      var target = env.getTarget();
      var value  = env.getValue();

      if (all(userConditions, function(c) { return c(target, value); })) {
        userCallback(target, value, function() {
          env = nextCallback(env);
          return env.value;
        });

        return env;
      } else {
        return nextCallback(env);
      }
    };
  } else {
    return function(env) {
      userCallback(env.getTarget(), env.getValue(), function() {
        env = nextCallback(env);
        return env.value;
      });

      return env;
    };
  }
}

module.exports = Around;

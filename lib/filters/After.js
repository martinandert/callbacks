'use strict';

var hasProp = require('../utils/hasProp');
var all     = require('../utils/all');

function After(nextCallback, userCallback, userConditions, chainConfig) {
  if (chainConfig.skipAfterCallbacksIfTerminated === true) {
    if (hasProp(chainConfig, 'terminator') && userConditions.length) {
      return function(env) {
        env = nextCallback.call(env);

        var target = env.getTarget();
        var value  = env.getValue();
        var halted = env.getHalted();

        if (!halted && all(userConditions, function(c) { return c.call(target, value); })) {
          userCallback.call(target, value);
        }

        return env;
      };
    } else if (hasProp(chainConfig, 'terminator')) {
      return function(env) {
        env = nextCallback.call(env);

        var target = env.getTarget();
        var value  = env.getValue();

        if (!env.getHalted()) {
          userCallback.call(target, value);
        }

        return env;
      };
    } else if (userConditions.length) {
      return function(env) {
        env = nextCallback.call(env);

        var target = env.getTarget();
        var value  = env.getValue();

        if (all(userConditions, function(c) { return c.call(target, value); })) {
          userCallback.call(target, value);
        }

        return env;
      };
    } else {
      return function(env) {
        env = nextCallback.call(env);

        userCallback.call(env.getTarget(), env.getValue());

        return env;
      };
    }
  } else {
    if (userConditions.length) {
      return function(env) {
        env = nextCallback.call(env);

        var target = env.getTarget();
        var value  = env.getValue();

        if (all(userConditions, function(c) { return c.call(target, value); })) {
          userCallback.call(target, value);
        }

        return env;
      };
    } else {
      return function(env) {
        env = nextCallback.call(env);

        userCallback.call(env.getTarget(), env.getValue());

        return env;
      };
    }
  }
}

module.exports = After;

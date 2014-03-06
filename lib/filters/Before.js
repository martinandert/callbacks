'use strict';

var hasProp = require('../utils/hasProp');
var all     = require('../utils/all');

function Before(nextCallback, userCallback, userConditions, chainConfig, filter) {
  var haltedFunc = chainConfig.terminator;

  if (hasProp(chainConfig, 'terminator') && userConditions.length) {
    return function(env) {
      var target = env.target;
      var value  = env.value;
      var halted = env.halted;

      if (!halted && all(userConditions, function(c) { return c(target, value); })) {
        var result = userCallback(target, value);

        env.halted = haltedFunc(target, result);

        if (env.halted) {
          target._haltedCallbackHook(filter);
        }
      }

      return nextCallback(env);
    };
  } else if (hasProp(chainConfig, 'terminator')) {
    return function(env) {
      var target = env.target;
      var value  = env.value;
      var halted = env.halted;

      if (!halted) {
        var result = userCallback(target, value);

        env.halted = haltedFunc(target, result);

        if (env.halted) {
          target._haltedCallbackHook(filter);
        }
      }

      return nextCallback(env);
    };
  } else if (userConditions.length) {
    return function(env) {
      var target = env.target;
      var value  = env.value;

      if (all(userConditions, function(c) { return c(target, value); })) {
        userCallback(target, value);
      }

      return nextCallback(env);
    };
  } else {
    return function(env) {
      userCallback(env.target, env.value);
      return nextCallback(env);
    };
  }
}

module.exports = Before;
